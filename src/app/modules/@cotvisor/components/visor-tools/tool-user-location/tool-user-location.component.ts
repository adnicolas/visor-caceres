import { Component, ElementRef, ViewChild, Input, OnInit } from '@angular/core';
import * as ol from 'openlayers';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as xml2js from 'xml2js';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';
import { HttpProxyService } from '@cotvisor/services/http-proxy.service';
import { environment } from 'src/environments/environment';
import { UserLocationsService } from '@cotvisor/services/user-locations.service';
import { ToastService } from '@theme/services/toast.service';


@Component({
  selector: 'cot-tool-user-location',
  styleUrls: ['tool-user-location.component.scss'],
  templateUrl: 'tool-user-location.component.html'
})

export class ToolUserLocationComponent extends AbstractParentToolSelectableComponent implements OnInit {

  @ViewChild('overlayElement') public overlayElement: ElementRef;
  @ViewChild('mouseOverlay') public mouseOverlay: ElementRef;
  @Input() tooltip: string;

  public name: string; // nombre de la ubicacion
  public description: string; // descripcion de la ubicacion
  protected srs: string; // sistema de referencia de la ubicacion
  protected lastCoordinate: any;
  protected X: number;
  protected Y: number;
  public coordX: number;
  public coordY: number;
  public gms: string;
  protected srsOptions: Array<{ code: string, name: string }>;
  protected mapProjection: string;
  protected scale: number;
  protected zoom: number;
  protected resolution: number;
  protected popUp: ol.Overlay;
  protected _mdtSource: ol.source.TileWMS;
  protected cursor: HTMLElement;

  private mapChange: Subject<boolean> = new Subject<boolean>();
  private elevationSubject: Subject<number> = new Subject<number>();

  public elevation: number;
  public elevationChanged$: Observable<number>;
  public editing: boolean; // whether currently editing a userLocation or not
  public helpTooltip: ol.Overlay;

  public loading$: Observable<boolean>;

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor(private httpProxyService: HttpProxyService, private userLocationService: UserLocationsService, private toastService: ToastService) {
    super();
    this.isActive = false;
    this.elevation = 0;
    this.elevationSubject = new BehaviorSubject<number>(this.elevation);
    this.elevationChanged$ = this.elevationSubject.asObservable();
    this.loading$ = this.userLocationService.loading$;
    this.elevationChanged$.subscribe((value) => {
      this.elevation = value;
    });
    // recoge traducciones
    this.useLiterals(['TOOLS.USER_LOCATIONS.LOCATION_SAVED', 'TOOLS.USER_LOCATIONS.SAVE_ERROR']);
  }

  // public ngOnInit() {

  // }


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
    this.cursor = (this.map.getTargetElement() as HTMLElement);
    this.cursor.style.cursor = 'crosshair';

    this.map.on('pointermove', this.showHelpMessage);
  }

  /**
   * Asigna al overlay de ayuda la posición del cursor sobre el mapa.
   *
   * @private
   * @memberof ToolUserLocationComponent
   */
  private showHelpMessage = (evt: ol.MapBrowserEvent) => {
    this.helpTooltip.setPosition(evt.coordinate);
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
    this.editing = false;
    this.isActive = false;
    // cambiar cursor al desactivar la herramienta
    this.cursor.style.cursor = 'auto';

    this.map.un('pointermove', this.showHelpMessage);
  }

  /**
   * Método abstracto  heredado de la clase que se extiende.
   * Es llamado tras inicializar el componente padre
   * Establece el SRS por defecto sobre el que se harán las consultas
   * Los SRS disponibles y la proyeccion del mapa actual
   * @return {[type]} [description]
   */
  public afterChangeActiveMap() {
    this.srs = this.map.getView().getProjection().getCode();
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

    // Creo el overlay que se va moviendo junto al ratón
    this.helpTooltip = new ol.Overlay({
      element: this.mouseOverlay.nativeElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
    });
    this.map.addOverlay(this.helpTooltip);
  }

  public beforeChangeActiveMap() { }

  /**
   * Actualiza los datos presentados tras el cambio de SRS de la herramienta
   * @return {[type]} [description]
   */
  public updatePointfromSRS() {
    const srsCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, this.srs);
    const geoCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, 'EPSG:4326');
    this.coordX = srsCoordinate[0];
    this.coordY = srsCoordinate[1];
    this.gms = ol.coordinate.toStringHDMS(geoCoordinate);
  }

  public saveButtonClicked() {
    const point = new ol.geom.Point(this.lastCoordinate);
    const wkt: string = new ol.format.WKT().writeGeometry(point);
    // const coordinates = (feature.getGeometry() as ol.geom.Point).getCoordinates();
    try {
      this.userLocationService.save({
        name: this.name,
        description: this.description,
        // coordinates: this.lastCoordinate,
        wktPoint: wkt,
        srs: this.srs,
        zoom: this.zoom,
        show: true
      }).pipe().subscribe(
        _success => {
          this.map.removeOverlay(this.popUp);
          this.editing = false;
          this.deactivateTool();
          this.toastService.showSuccess({ summary: this.componentLiterals['TOOLS.USER_LOCATIONS.LOCATION_SAVED'], detail: '' });
        }
      );

    } catch {
      this.toastService.showError({ summary: this.componentLiterals['TOOLS.USER_LOCATIONS.SAVE_ERROR'], detail: '' });
    }

  }

  public cancelButtonClicked() {
    this.map.removeOverlay(this.popUp);
    this.editing = false;
  }

  /**
   * Elimina el overlay
   * @return {[type]} [description]
   */
  public removeOverlay() {
    this.map.removeOverlay(this.popUp);
    this.editing = false;
  }

  /**
   * Obtiene los datos geográficos del punto recibido en el evento
   * @return {[type]} [description]
   */
  private getGeographicInfo = (evt: ol.MapBrowserEvent, coordinate?: ol.Coordinate) => {
    this.removeOverlay();
    this.elevation = null;
    this.name = null;
    this.description = null;
    this.lastCoordinate = evt ? evt.coordinate : coordinate;
    const geoCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, 'EPSG:4326');
    this.gms = ol.coordinate.toStringHDMS(geoCoordinate);
    this.resolution = this.map.getView().getResolution();
    // resolution * OpenLayers.INCHES_PER_UNIT[units] * OpenLayers.DOTS_PER_INCH
    this.zoom = this.map.getView().getZoom();
    this.scale = Math.round(this.resolution * ol.proj.METERS_PER_UNIT[this.map.getView().getProjection().getUnits()]
      * environment.units.dots_per_inch * environment.units.inches_per_meter);

    const srsCoordinate = ol.proj.transform(this.lastCoordinate, this.mapProjection, this.srs);
    this.coordX = srsCoordinate[0];
    this.coordY = srsCoordinate[1];
    this.getElevation(this.lastCoordinate);

    // .then((elevation) => this.coordZ = elevation)
    // .catch((elevation) => {
    //     this.coordZ = null;
    //     // console.log('No se ha recibido datos al consultar la elevación a  ' + this.moduleConfig.mdt_url);
    // });
    this.addOverlay();
    this.editing = true;
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
   * @memberof ToolUserlocationComponent
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
