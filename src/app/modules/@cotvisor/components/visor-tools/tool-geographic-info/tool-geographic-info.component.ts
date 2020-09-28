import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import * as ol from 'openlayers';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';
import { HttpProxyService } from '@cotvisor/services/http-proxy.service';
import { environment } from 'src/environments/environment';

/**
 * Componente que realiza consultas geogra´ficas sobre el click del ratón
 * @param  {'app-geographic-info'}                 {selector   [description]
 * @param  {'./geographic-info.component.html'}    templateUrl [description]
 * @param  {['./geographic-info.component.scss']}} styles      [description]
 * @return {[type]}                                            [description]
 */
@Component({
  selector: 'cot-tool-geographic-info',
  styleUrls: ['tool-geographic-info.component.scss'],
  templateUrl: 'tool-geographic-info.component.html'
})

export class ToolGeographicInfoComponent extends AbstractParentToolSelectableComponent implements OnInit {

  @ViewChild('overlayElement') public overlayElement: ElementRef;
  @Input() tooltip: string;

  protected lastCoordinate: any;
  protected X: number;
  protected Y: number;
  public coordX: number;
  public coordY: number;
  public gms: string;
  protected SRS: string;
  protected srsOptions: Array<{ code: string, name: string }>;
  protected mapProjection: string;
  protected scale: number;
  protected zoom: number;
  protected resolution: number;
  protected popUp: ol.Overlay;
  protected _mdtSource: ol.source.TileWMS;
  private mapChange: Subject<boolean> = new Subject<boolean>();

  private elevationSubject: Subject<number> = new Subject<number>();
  public elevation: number;
  public elevationChanged$: Observable<number>;
  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(private httpProxyService: HttpProxyService) {
    super();
    this.isActive = false;
    this.elevation = 0;
    this.elevationSubject = new BehaviorSubject<number>(this.elevation);
    this.elevationChanged$ = this.elevationSubject.asObservable();

    this.elevationChanged$.subscribe((value) => {
      this.elevation = value;
    });
  }

  /**
   * implementación de metodo abstracto de AbstractParentToolSelectableComponent. Metodo de activación de la herramienta
   * @return {[type]} [description]
   */
  public activateTool() {
    // primero activamos nuestra tool
    this.map.activateTool(this);
    // Establecemos los eventos de nuestra tool
    this.setToolEvents();
    this.isActive = true;

    // cambiar cursor al activar la herramienta
    (this.map.getTargetElement() as HTMLElement).style.cursor = 'crosshair';
  }

  /**
   * implementación de metodo abstracto de AbstractParentToolSelectableComponent
   * Método de desactivación de la herramienta
   * @return {[type]} [description]
   */
  public deactivateTool() {
    // eliminamos los eventos de nuestra herramienta
    this.unsetToolEvents();
    // desactivamos la heramienta en el mapa
    this.map.deactivateTool();
    // en este caso eliminamos el overlay
    this.removeOverlay();
    this.isActive = false;
    // cambiar cursor al desactivar la herramienta
    (this.map.getTargetElement() as HTMLElement).style.cursor = 'auto';
  }

  /**
   * Método abstracto  heredado de la clase que se extiende.
   * Es llamado tras inicializar el componente padre
   * Establece el SRS por defecto sobre el que se harán las consultas
   * Los SRS disponibles y la proyeccion del mapa actual
   * @return {[type]} [description]
   */
  public afterChangeActiveMap() {
    this.SRS = this.map.getView().getProjection().getCode();
    this.srsOptions = environment.all_app_projections;
    this.mapProjection = this.map.getView().getProjection().getCode();
    this._mdtSource = new ol.source.TileWMS({
      url: environment.elevation_provider.mdt_url,
      params: {
        LAYERS: environment.elevation_provider.layers,
        TILED: true,
      },
      projection: environment.map_view.default_projection,
      // crossOrigin: 'Anonymous'
    });
    // },
    // );

    this.mapChange.next(true);

    // Subscripción al servicio del mapa que reproyecta las capas al vuelo
    this.map.observableMapViewChange$.pipe(takeUntil(this.mapChange)).subscribe(
      ([oldView, newView]) => {
        if (this.popUp) {
          this.mapProjection = newView.getProjection().getCode();
          const transformCoord = ol.proj.transform(this.lastCoordinate, oldView.getProjection(), this.mapProjection);
          this.getGeographicInfo(null, transformCoord);
        }
      });

    if (this.isActive) { this.activateTool(); }
  }

  public beforeChangeActiveMap() { }

  /**
   * Actualiza los datos presentados tras el cambio de SRS de la herramienta
   * @return {[type]} [description]
   */
  public updatePointfromSRS() {
    const srsCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, this.SRS);
    const geoCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, 'EPSG:4326');
    this.coordX = srsCoordinate[0];
    this.coordY = srsCoordinate[1];
    this.gms = ol.coordinate.toStringHDMS(geoCoordinate);
  }

  /**
   * Selecciona el texto oculto con el texto completo de los datos
   * geográficos y los copia  al portapapeles
   * @return {[type]} [description]
   */
  public copyDataToClipboard() {
    const textArea = document.createElement('textarea');
    const copyInfo = document.querySelector('#copyText') as HTMLElement;
    const copyText = copyInfo.innerText;
    textArea.value = copyText;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy geographic data', err);
    }
    document.body.removeChild(textArea);

  }

  /**
   * Elimina el overlay
   * @return {[type]} [description]
   */
  public removeOverlay() {
    this.map.removeOverlay(this.popUp);
  }

  /**
   * Obtiene los datos geográficos del punto recibido en el evento
   * @return {[type]} [description]
   */
  private getGeographicInfo = (evt: ol.MapBrowserEvent, coordinate?: ol.Coordinate) => {
    this.removeOverlay();
    this.elevation = null;
    this.lastCoordinate = evt ? evt.coordinate : coordinate;
    const geoCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, 'EPSG:4326');
    this.gms = ol.coordinate.toStringHDMS(geoCoordinate);
    this.resolution = this.map.getView().getResolution();
    // resolution * OpenLayers.INCHES_PER_UNIT[units] * OpenLayers.DOTS_PER_INCH
    this.zoom = this.map.getView().getZoom();
    this.scale = Math.round(this.resolution * ol.proj.METERS_PER_UNIT[this.map.getView().getProjection().getUnits()]
      * environment.units.dots_per_inch * environment.units.inches_per_meter);

    const srsCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, this.SRS);
    this.coordX = srsCoordinate[0];
    this.coordY = srsCoordinate[1];
    this.getElevation(this.lastCoordinate);

    // .then((elevation) => this.coordZ = elevation)
    // .catch((elevation) => {
    //     this.coordZ = null;
    //     // console.log('No se ha recibido datos al consultar la elevación a  ' + this.moduleConfig.mdt_url);
    // });
    this.addOverlay();

  }

  /**
   * Añade el overlay con el popup al mapa
   * @return {[type]} [description]
   */
  private addOverlay() {
    this.popUp = new ol.Overlay({
      element: this.overlayElement.nativeElement,
      position: this.lastCoordinate,
      positioning: 'bottom-left',
      stopEvent: true,
      offset: [0, 0],
    });

    this.map.addOverlay(this.popUp);
  }



  /**
   * Retorna la elevación de la coordenada mediante la consulta a una capa MDT de un servicio WMS
   * @param  {[number} coord   [description]
   * @param  {[type]}  number] [description]
   * @return {number}          [description]
   */
  private getElevation(coord: [number, number]) {
    this.unSubscribe.next();
    const url = this._mdtSource.getGetFeatureInfoUrl(
      coord, this.map.getView().getResolution(), this.map.getView().getProjection(),
      { INFO_FORMAT: 'application/vnd.ogc.gml' });

    this.httpProxyService.get(url, { responseType: 'text' }).pipe(takeUntil(this.unSubscribe))
      .subscribe((featureInfo) => {
        xml2js.parseString(featureInfo, { explicitArray: false, normalizeTags: true, tagNameProcessors: [this.removeXMLTags] }, (err, result) => {
          if (result) {
            if (result.featurecollection) {
              this.elevationSubject.next(Math.round(parseInt(result.featurecollection.featuremember.mdt05_piramidal_penbal.gray_index, 10)));
            }
          }
        });
      });

  }


  /**
   * Función necesaria porque no todos los wfs cumplen el mismo etiquetado
   *
   * @private
   * @param {string} name
   * @returns {string}
   * @memberof ToolGeographicInfoComponent
   */
  private removeXMLTags(name: string): string {
    name = name.replace('gml:', '');
    name = name.replace('mdt:', '');
    name = name.replace('wfs:', '');
    return name;
  }

  /**
   * Establece el evento al que responderña la herramienta
   * @return {[type]} [description]
   */
  private setToolEvents() {
    this.map.on('click', this.getGeographicInfo);
  }

  /**
   * desactiva en el mapa los eventos de la herramienta
   * @return {[type]} [description]
   */
  private unsetToolEvents() {
    this.map.un('click', this.getGeographicInfo);
  }

}
