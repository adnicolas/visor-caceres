import { Component, Input } from '@angular/core';
import * as ol from 'openlayers';
import { MenuItem } from 'primeng/api';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ToastService } from '@theme/services/toast.service';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { VsLayerWFS } from '@cotvisor/models/vs-layer-wfs';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsLayerWMTS } from '@cotvisor/models/vs-layer-wmts';
import { HttpProxyService } from '@cotvisor/services/http-proxy.service';

@Component({
  selector: 'cot-identify',
  templateUrl: './identify.component.html',
  styleUrls: ['./identify.component.scss']
})
export class IdentifyComponent extends AbstractParentToolSelectableComponent {
  @Input() tooltip: string;
  @Input() public alwaysActive?: boolean = false; // indica si mostrar boton para activarla o estará siempre activa
  public observableBatch = [];
  // Configuración para representar en distintas proyecciones las coordenadas del punto seleccionado a consultar
  public projections: Array<{ srs: string, format: string, title: string }> = [];
  public coordinates: Array<{ x: string, y: string, title: string }> = [];
  public info: Array<{ name: string, id: string, contents: any[], type: string }> = [];
  public tabs: MenuItem[] = [];
  public activeTab: MenuItem;
  public loading = false;
  public showModal = false;
  private cancelRequest: Subject<boolean> = new Subject<boolean>();

  constructor(
    private toastService: ToastService,
    private httpProxy: HttpProxyService) {
    super();
    this.getModuleConfigAsync().then(
      (moduleConfig) => {
        this.projections = this.moduleConfig.projections || [];
      });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnDestroy() {
    this.cancelRequest.next(true);
    this.cancelRequest.complete();
    super.ngOnDestroy();
  }

  public afterChangeActiveMap() {
    // si se establece el input alwaysActive la herramienta estará siempre
    // activa mientras no se desactive por otra herramienta cuyo evento que
    // entre en conflicto.
    if (this.alwaysActive) {
      this.setToolEvents();
    }
  }

  public beforeChangeActiveMap() {
    if (this.isActive && !this.alwaysActive) {
      this.deactivateTool();
    }
  }

  /**
   * implemantación de método abstracto que activa la herramienta
   * @return {[type]} [description]
   */
  public activateTool() {
    // primero activamos nuestra tool
    this.map.activateTool(this);
    // Establecemos los eventos de nuestra tool
    this.setToolEvents();
    // cambiar cursor al activar la herramienta
    (this.map.getTargetElement() as HTMLElement).style.cursor = 'crosshair';
    this.isActive = true;
  }

  /**
   * implemantación de método abstracto que desactiva la herramietna
   * @return {[type]} [description]
   */
  public deactivateTool() {
    // eliminamos los eventos de nuestra herramienta
    this.unsetToolEvents();
    // desactivamos la heramienta en el mapa
    this.map.deactivateTool();
    // cambiar cursor al activar la herramienta
    (this.map.getTargetElement() as HTMLElement).style.cursor = 'auto';
    this.isActive = false;
  }


  /**
   * Método llamado cada vez que cambia la visibilidad del modal
   * Al hacerse invisible cancela todas las peticiones pendientes
   * @param {*} visible
   * @memberof IdentifyComponent
   */
  public onModalVisibleChange(visible) {
    this.showModal = visible;
    // Si pasa a invisible cancelo todas las peticiones pendientes
    if (!visible) {
      this.cancelRequest.next(true);
    }
  }

  /**
   * Método que realiza la consulta a las capas cargadas en el mapa
   *
   * @private
   * @param {ol.MapBrowserEvent} evt
   * @memberof IdentifyComponent
   */
  private queryMapLayers = (evt: ol.MapBrowserEvent) => {
    this.info = [];
    this.observableBatch = [];
    this.coordinates = [];
    this.tabs = [];
    const projectionMap = this.map.getView().getProjection();
    // Construyo las coordenadas del punto seleccionado para las distintas proyecciones pasadas por configuración
    for (const projection of this.projections) {
      const coordinate = ol.proj.transform(evt.coordinate, projectionMap, projection.srs);
      let x;
      let y;
      if (projection.format === 'degrees') {
        const degreesCoordinate = this.convertDMS(coordinate[1], coordinate[0]);
        x = 'lat: ' + degreesCoordinate.lat;
        y = 'long: ' + degreesCoordinate.long;
      } else {
        x = 'X: ' + coordinate[0].toFixed(2);
        y = 'Y: ' + coordinate[1].toFixed(2);
      }
      this.coordinates.push({ x, y, title: projection.title });
    }

    const layers = this.map.getVisibleLayers();
    // De las capas visibles me quedo de momento con las de tipo wms que sean consultables o wmts
    const serviceLayers = layers.filter((layer) => {
      if ((layer instanceof VsLayerWMS || layer instanceof VsLayerWMTS) && layer.queryable
      ) { return true; }
    });
    // De las capas visibles me quedo con las de tipo vector
    const vectorLayers = layers.filter((layer) => {
      if ((layer instanceof VsLayerVector || layer instanceof VsLayerWFS) && layer.queryable) {
        return true;
      }
    });

    this.getServicesLayersInfo(serviceLayers, evt.coordinate);
    this.getVectorLayersInfo(vectorLayers, evt.pixel);

  }

  /**
   * Registra los eventos de la herramienta
   * @return {[type]} [description]
   */
  private setToolEvents() {
    this.map.on('singleclick', this.queryMapLayers);
  }


  /**
   * Desregistra los eventos de la herramienta
   * @return {[type]} [description]
   */
  private unsetToolEvents() {
    this.map.un('singleclick', this.queryMapLayers);
  }

  private generateArray(obj) {
    return Object.keys(obj).map((key) => ({ key, value: obj[key] }));
  }

  private toDegreesMinutesAndSeconds(coordinate) {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + 'º ' + minutes + '\' ' + seconds + '\'\'';
  }

  private convertDMS(lat, lng) {
    const latitude = this.toDegreesMinutesAndSeconds(lat);
    const latitudeCardinal = Math.sign(lat) >= 0 ? 'N' : 'S';

    const longitude = this.toDegreesMinutesAndSeconds(lng);
    const longitudeCardinal = Math.sign(lng) >= 0 ? 'E' : 'W';
    const latString = latitude + ' ' + latitudeCardinal;
    const longString = longitude + ' ' + longitudeCardinal;

    return { lat: latString, long: longString };
  }

  private getWMTSFeatureInfoUrl(coordinate: ol.Coordinate, wmtsLayer: VsLayerWMTS) {
    const source: ol.source.WMTS = wmtsLayer.olInstance.getSource();
    const resolution = this.map.getView().getResolution();
    const tilegrid = source.getTileGrid() as ol.tilegrid.WMTS;
    const tileResolutions = tilegrid.getResolutions();
    let zoomIdx;
    let diff = Infinity;

    for (let i = 0; i < tileResolutions.length; i++) {
      const tileResolution = tileResolutions[i];
      const diffP = Math.abs(resolution - tileResolution);
      if (diffP < diff) {
        diff = diffP;
        zoomIdx = i;
      }
      if (tileResolution < resolution) {
        break;
      }
    }

    let tileSize = tilegrid.getTileSize(zoomIdx);
    // Si no es un array, lo convierto en array
    tileSize = (Array.isArray(tileSize) ? tileSize : [tileSize, tileSize]);
    const coordinateSRS = ol.proj.transform(coordinate, this.map.getView().getProjection(), source.getProjection());
    const tileOrigin = tilegrid.getOrigin(zoomIdx);

    const fx = (coordinateSRS[0] - tileOrigin[0]) / (tileResolutions[zoomIdx] * tileSize[0]);
    const fy = (tileOrigin[1] - coordinateSRS[1]) / (tileResolutions[zoomIdx] * tileSize[1]);
    const tileCol = Math.floor(fx);
    const tileRow = Math.floor(fy);
    const tileI = Math.floor((fx - tileCol) * tileSize[0]);
    const tileJ = Math.floor((fy - tileRow) * tileSize[1]);
    const matrixIds = tilegrid.getMatrixIds()[zoomIdx];
    const matrixSet = source.getMatrixSet();
    const style = source.getStyle();
    let url = wmtsLayer.service.url + (wmtsLayer.service.url.indexOf('?') > -1 ? '&' : '?');
    url = url
      + 'SERVICE=WMTS&REQUEST=GetFeatureInfo&VERSION=1.0.0'
      + '&LAYER=' + wmtsLayer.name
      + '&INFOFORMAT=text/html'
      + '&FORMAT=' + source.getFormat()
      + '&STYLE=' + style
      + '&TILEMATRIX=' + matrixIds
      + '&TILEMATRIXSET=' + matrixSet
      + '&TILECOL=' + tileCol
      + '&TILEROW=' + tileRow
      + '&I=' + tileI
      + '&J=' + tileJ;

    return url;
  }

  private getServicesLayersInfo(serviceLayers: VsLayer[], coordinate: [number, number]) {
    const viewResolution = this.map.getView().getResolution();
    const projectionMap = this.map.getView().getProjection();

    for (const layer of serviceLayers) {
      let url;

      if (layer instanceof VsLayerWMS) {
        const projectionLayer = layer.olInstance.getSource().getProjection();
        const coordinates = ol.proj.transform(coordinate, projectionMap, projectionLayer);
        // aplica idioma, si tiene
        if (layer.activeLanguage) {
          url = layer.olInstance.getSource().getGetFeatureInfoUrl(
            coordinates, viewResolution, projectionMap, { INFO_FORMAT: 'text/html', SRS: projectionLayer.getCode(), FEATURE_COUNT: 50, LANGUAGE: layer.activeLanguage },
          );
        } else {
          url = layer.olInstance.getSource().getGetFeatureInfoUrl(
            coordinates, viewResolution, projectionMap, { INFO_FORMAT: 'text/html', SRS: projectionLayer.getCode(), FEATURE_COUNT: 50 },
          );
        }

      } else {
        url = this.getWMTSFeatureInfoUrl(coordinate, layer as VsLayerWMTS);
      }
      if (url) {
        // El catch es necesario para que si ocurre un error en una de las peticiones durante las peticiones en paralelo no influya en el resto.
        this.observableBatch.push(
          this.httpProxy.get(url, { responseType: 'text' }).pipe(
            catchError(
              (res) => {
                return of('');
              }
            ),
            takeUntil(this.cancelRequest))
        );
      }
    }

    if (this.observableBatch.length) {
      // Inicio el loading
      this.loading = true;
      this.showModal = true;
      // Hago todas las peticiones en paralelo
      forkJoin(this.observableBatch).subscribe((results: [string]) => {
        // this.info = results;
        for (let i = 0; i < results.length; i++) {
          // Recojo el body y compruebo que no esté vacio.
          let body = '';
          const bodyExp = results[i].match(/<body[^>]*>([^<]*(?:(?!<\/?body)<[^<]*)*)<\/body\s*>/i);
          if (bodyExp) {
            body = bodyExp[1].trim();
            const empty = (body.indexOf('<table border="1">\n</table>') !== -1 || body === '<br/>');
            if (body && !empty) {
              //
              results[i] = results[i].replace('<a href=', '<a target=\'_blank\' href=');
              const numberTabs = this.tabs.length.toString();
              this.tabs.push({
                id: numberTabs,
                command: () => {
                  this.changeActiveTab(numberTabs);
                },
                label: serviceLayers[i].title
              });
              this.info.push({ id: numberTabs, name: serviceLayers[i].name, contents: [results[i]], type: 'html' });
            }
          }

        }
        if (this.tabs.length) {
          this.activeTab = this.tabs[0];
        }
        // Paro el loading
        this.loading = false;
      },
        (error) => {
          this.loading = false;
          this.toastService.showError({ summary: 'Error', detail: 'Error al cargar identify' });
        });
    } else {
      this.showModal = true;
    }
  }

  private getVectorLayersInfo(vectorLayers: VsLayer[], pixel: [number, number]) {
    // Recorro las capas vectoriales involucradas
    this.map.forEachFeatureAtPixel(pixel, (feature: ol.Feature, layer) => {
      // Obtengo la capa padre para tener nombre etc
      const vsLayer = vectorLayers.filter((vslayer) => vslayer.olInstance === layer)[0];
      if (vsLayer) {
        let infoVsLayer = this.info.filter((infoLayer) => infoLayer.name === vsLayer.name)[0];
        // Cubro los casos en que se trate de un cluster
        const features = feature.get('features') ? feature.get('features') : [feature];
        for (const f of features) {
          const featureProperties = f.getProperties();
          const geometryname = f.getGeometryName();
          delete featureProperties[geometryname];
          if (Object.keys(featureProperties).length) {
            if (infoVsLayer) {
              infoVsLayer.contents.push(this.generateArray(featureProperties));
            } else {
              const numberTabs = this.tabs.length.toString();
              infoVsLayer = { id: numberTabs, name: vsLayer.name, contents: [this.generateArray(featureProperties)], type: 'features' };
              this.tabs.push({
                id: numberTabs,
                command: () => {
                  this.changeActiveTab(numberTabs);
                },
                label: vsLayer.title
              });
              this.info.push(infoVsLayer);
            }
          }
        }
      }
    });
  }

  /**
   * Método llamado al cambiar de pestaña para conocer la pestaña activa
   *
   * @private
   * @param {string} activeTab
   * @memberof IdentifyComponent
   */
  private changeActiveTab(activeTab: string) {
    this.activeTab = this.tabs.find((tab) => tab.id === activeTab);
  }

}
