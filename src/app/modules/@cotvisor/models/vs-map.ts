import * as ol from 'openlayers';
import { BehaviorSubject, Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { VsLayerVector } from './vs-layer-vector';
import { environment } from 'src/environments/environment';
import { VsLayerWMS } from './vs-layer-wms';
import { VsLayer } from './vs-layer';
import { VsWMC } from './format/wmc/vs-wmc';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';


/**
 * Clase mapa que extiende el mapa de open layers
 * Contiene propiedades adicionales para la gestión del mapa del visor
 *
 * @param  {any}    options [description]
 * @return {[type]}         [description]
 */
export class VsMap extends ol.Map {

  public options: any;
  // Nombre que identifica el mapa. Se genera de forma secuencial al crear un nuevo mapa desde el servicio map.service
  public name: string;

  // título del mapa
  public title: string;

  // linea de escala del mapa
  public scaleLine: ol.control.ScaleLine;

  // Capas de usuario cargadas en el mapa
  public activeLayers: VsLayer[];

  // Capas base en el mapa
  public baseLayers: VsLayer[];

  public searchLayer: ol.layer.Vector;

  public vsWmcLoaded: VsWMC;

  private initialBbox: ol.Extent;

  public activeTool: AbstractParentToolSelectableComponent;

  // observables del mapa
  // Capa eliminada
  private _observableLayerDeletedSource = new Subject<VsLayer>();
  public observableLayerDeleted$: Observable<VsLayer>;
  // capa añadida al mapa
  private _observableLayerAddedSource = new Subject<any>();
  public observableLayerAdded$: Observable<VsLayer>;
  // Cambio visibilidad de capa
  private _observableLayerVisibilityChangeSource = new Subject<VsLayer>();
  public observableLayerVisibilityChange$: Observable<VsLayer>;
  // Cambio vista del mapa devuelve dos vistas, la anterior y la nueva
  private _observableMapViewChangeSource = new Subject<[ol.View, ol.View]>();
  public observableMapViewChange$: Observable<[ol.View, ol.View]>;
  // Finalizada la carga de capas base
  private _observableBaseLayersMapLoadedSource = new BehaviorSubject<boolean>(false);
  public observableBaseLayersMapLoaded$: Observable<boolean>;

  /**
   * Constructor de la clase, en él se inicializan las propiedades y se llama al constructor de mapa de Openlayers
   * @param  {any}    options [description]
   * @return {[type]}         [description]
   */
  constructor(options: any) {
    super(options);
    this.options = options;
    this.activeLayers = [];
    this.baseLayers = [];

    /* Construimos la capa de búsquedas*/
    // const fill = new ol.style.Fill({
    //   color: "rgba(255,255,255,0.4)",
    // });
    const stroke = new ol.style.Stroke({
      color: environment.colors.primary,
      width: 3,
    });
    const style = new ol.style.Style({
      image: new ol.style.Icon({
        anchor: [0.5, 1],
        opacity: 1,
        scale: 1,
        src: 'assets/icons/marker.png',
      }),
      // fill,
      stroke,
    });
    this.searchLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style,
    });
    this.searchLayer.setMap(this);
    this.observableLayerAdded$ = this._observableLayerAddedSource.asObservable();
    this.observableLayerDeleted$ = this._observableLayerDeletedSource.asObservable();
    this.observableLayerVisibilityChange$ = this._observableLayerVisibilityChangeSource.asObservable();
    this.observableMapViewChange$ = this._observableMapViewChangeSource.asObservable();
    this.observableBaseLayersMapLoaded$ = this._observableBaseLayersMapLoadedSource.asObservable();

    // Compruebo si las capas están en rango para la resolución actual
    this.getView().on('change:resolution', () => { this.checkActiveLayersInRange(); });
    this.on('change:view', (view) => {
      this.getView().on('change:resolution', () => { this.checkActiveLayersInRange(); });
    });

    // set initalBbox
    this.initialBbox = this.getView().calculateExtent(this.getSize());
    // this.setProjectionEPSGCode(environment.map_view.default_projection);
  }

  /**
   * Añade una capa VsLayer al mapa, al array de mapas activas o base y añade la
   * instancia de la capa OL al mapa
   *
   *   @param {VsLayer} vsLayer Capa a añadir. Debe tener la instacia de ol establecida
   *   @param {boolean} addToLayersTree Flag que indica si la capa debe añadirse al arbol de capas
   */
  public addVsLayer(vsLayer: VsLayer): void {

    // Si se trata de una capa de tipo VsLayerWMS, comprobamos la limitación de escala
    if (vsLayer instanceof VsLayerWMS
      && ((vsLayer.minScaleDenominator && vsLayer.minScaleDenominator !== 0)
        || (vsLayer.maxScaleDenominator && vsLayer.maxScaleDenominator !== Infinity))) {
      const inchesPrMeter = 39.3700787;
      const dpi = 96;
      const factor = (this.getView().getProjection().getMetersPerUnit() * inchesPrMeter * dpi);
      if (vsLayer.minScaleDenominator && vsLayer.minScaleDenominator !== 0) {
        const minResolution = vsLayer.minScaleDenominator / factor;
        vsLayer.setMinResolution(minResolution);
      }
      if (vsLayer.maxScaleDenominator && vsLayer.maxScaleDenominator !== Infinity) {
        const maxResolution = vsLayer.maxScaleDenominator / factor;
        vsLayer.setMaxResolution(maxResolution);
      }
    }

    this.addLayer(vsLayer.olInstance);

    if (vsLayer.isBaseLayer) {
      this.baseLayers.unshift(vsLayer);
      vsLayer.setZIndex(0);
    } else if (vsLayer.isTopLayer) {
      // Pongo la capa en lo más alto del visor
      vsLayer.setZIndex(2000);
    } else {
      this.activeLayers.unshift(vsLayer);
      this.checkLayerInRange(vsLayer);
      // Pongo la capa en el top del visor
      vsLayer.setZIndex(this.activeLayers.length + 1);
    }

    // escuchamos el evento de cambio de visibilidad  de la capa
    vsLayer.olInstance.on('change:visible', (event) => {
      this._observableLayerVisibilityChangeSource.next(vsLayer);
    });

    // notificamos la adicion de la capa
    this._observableLayerAddedSource.next(vsLayer);

  }

  /**
   * Obtiene el array de capas activas del mapa
   * @return {VsLayer[]} [description]
   */
  public getActiveLayers(): VsLayer[] {
    return this.activeLayers;
  }
  /**
   * Obtiene las capas visibles del mapa para eso obtiene las capas del array mas
   * las predefinidas del arbol de capas
   * @return {VsLayer[]} [description]
   */

  public getVisibleLayers(): VsLayer[] {
    let visibleLayers: VsLayer[];
    visibleLayers = [...this.activeLayers];
    return visibleLayers.filter((layer) => layer.getVisible());
  }

  /**
   * Obtiene el array de capas base del mapa
   * @return {VsLayer[]} [description]
   */
  public getBaseLayers(): VsLayer[] {
    return this.baseLayers;
  }

  /**
   * Obtiene una capa actuiva por su nombre
   *
   * @param {string} layerName
   * @returns {VsLayer}
   * @memberof VsMap
   */
  public getActiveLayer(layerName: string): VsLayer {

    const layer = this.activeLayers.find((vslayer) => vslayer.name === layerName);
    if (layer) return layer;
    else return null;


  }

  public baseLayersLoaded() {
    this._observableBaseLayersMapLoadedSource.next(true);
  }


  /**
   * Obtiene el índice de la capa base segun la configuración en environment
   *
   * El índice es el del array de capas base de la configuración actual
   *
   * @returns {number}
   *
   * @memberOf VsMap
   */
  public getCurrentBaseLayerIndex(): number {

    const baseLayers = this.getBaseLayers();
    let baseLayerIndex = null;

    for (let index = 0; index < baseLayers.length; index++) {
      if (baseLayers[index].getVisible()) baseLayerIndex = index;
    }

    return baseLayerIndex;
  }


  // /**
  //  * Obtiene el array de grupos de capas del mapa
  //  * @return {VsLayergroup[]} [description]
  //  */
  // public getLayerGroups(): VsLayergroup[] {
  //   return this.layerGroups;
  // }

  /**
   * Establece la capa de búsqueda del mapa y la pone en el top
   * @param {ol.layer.Vector} layer [description]
   */
  public setSearchLayer(layer: ol.layer.Vector): void {
    this.searchLayer = layer;
    this.searchLayer.setMap(this);
  }

  /**
   * Obtiene la capa de búsqueda del mapa
   * @return {ol.layer.Vector} [description]
   */
  public getSearchLayer(): ol.layer.Vector {
    return this.searchLayer;
  }

  /**
   * Elimina todas las features cargadas en la capa de búsquedas
   */
  public clearSearchLayer(): void {
    this.searchLayer.getSource().clear();
  }

  /**
   * Indica si el mapa tiene capas de usuario
   *
   * @return {[type]} [description]
   */
  public hasUserLayers(): boolean {

    return this.activeLayers.length > 0;
  }

  /**
   * Añade una feature a la capa de búsquedas
   * @param {ol.Feature} feature [description]
   */
  public addFeaturesToSearchLayer(features: ol.Feature[]): void {
    this.searchLayer.getSource().addFeatures(features);
  }

  /**
   * Elimina la capa del mapa elimiandola del array de capas activas y su instancia de OL cargada en el mapa
   * @param  {VsLayer} vsLayer Capa a eliminar
   * @return {[type]}          [description]
   */
  public removeVsLayer(vsLayer: VsLayer) {
    this._removeActiveLayer(vsLayer);
    this.removeLayer(vsLayer.olInstance);

    // notificamos el borrado de capa
    this._observableLayerDeletedSource.next(vsLayer);

  }

  /**
   * Elimina todas las capas de usuario del mapa
   * @return {[type]} [description]
   */
  public removeAllUserLayers() {
    // No podemos usar for (let variable of iterable) porque removeVsLayer va modificando
    // el iterable
    while (this.activeLayers.length > 0) {
      this.removeVsLayer(this.activeLayers[0]);
    }

  }

  /**
   * Devuelve una capa desde el mapa por su nombre
   * @param  {string}  name [description]
   * @return {VsLayer}      [description]
   */
  public getVsLayerByName(name: string): VsLayer {
    for (const layer of this.activeLayers) {
      if (layer.name === name) { return layer; }
    }
    return null;
  }

  /**
   * desactiva la herramienta actuiva si está establecida
   * @return {[type]} [description]
   */
  public deactivateCurrentTool() {
    if (this.activeTool) { this.activeTool.deactivateTool(); }
  }

  /**
   * Pone la herramienta recibida como activa desactivando previamente la actual
   * @param  {AbstractParentToolSelectableComponent} newActiveTool [description]
   * @return {[type]}                                              [description]
   */
  public activateTool(newActiveTool: AbstractParentToolSelectableComponent) {

    this.deactivateCurrentTool();
    this.activeTool = newActiveTool;

  }

  /**
   * Desactiva la herrameitna activa
   * @return {[type]} [description]
   */
  public deactivateTool() {
    this.activeTool = null;
  }

  /**
   * incremente o decrementa el zoom del mapa en el centro recibido y
   * en la cantidad zoom, puede ser negativo
   * @param  {[number, number]} coordinates   [description]
   * @param  {number}      zoom      [description]
   * @return {[type]}                [description]
   */
  public zoomMapTo(coordinates: [number, number], zoomFactor: number) {
    this.getView().animate({
      center: coordinates,
      duration: environment.map_view.animations.zoom_duration,
      zoom: +this.getView().getZoom() + zoomFactor,
    });
  }

  public getEPSGCode(): string {
    return this.getView().getProjection().getCode();
  }

  // TODO validar funcionamiento tras establecer epsg por defecto en enviroment, antes reproyectaba siempre desde 4326
  public setProjectionEPSGCode(epsgCode: string) {

    const actualView = this.getView();
    const actualProjCode = actualView.getProjection().getCode();
    if (actualProjCode === epsgCode) return;

    const actualZoom = actualView.getZoom();
    const actualCenter = ol.proj.transform(actualView.getCenter(), actualProjCode, epsgCode);
    const maxExtent = ol.proj.transformExtent(
      [
        environment.map_view.view_constraints.max_extent[0],
        environment.map_view.view_constraints.max_extent[1],
        environment.map_view.view_constraints.max_extent[2],
        environment.map_view.view_constraints.max_extent[3],
      ]
      , actualProjCode, epsgCode);

    const newView = new ol.View({
      center: actualCenter,
      extent: maxExtent,
      minZoom: environment.map_view.view_constraints.min_zoom,
      projection: epsgCode,
      zoom: actualZoom,
    });

    this.initialBbox = ol.proj.transformExtent(this.initialBbox, actualProjCode, epsgCode);
    this.setView(newView);
    this.reprojectAllLayersGeometries(actualProjCode, epsgCode);
    this._observableMapViewChangeSource.next([actualView, newView]);
  }

  public getInitialBbox(): ol.Extent {
    return this.initialBbox;
  }

  public setInitialBbox(extent: ol.Extent) {
    this.initialBbox = extent;
  }

  protected checkLayerInRange(layer: VsLayer) {
    const resolution = this.getView().getResolution();
    const maxResolution = layer.olInstance.getMaxResolution();
    const minResolution = layer.olInstance.getMinResolution();
    layer.inRange = ((resolution >= minResolution) && (resolution <= maxResolution));
  }

  protected checkActiveLayersInRange() {
    const resolution = this.getView().getResolution();
    for (const layer of this.activeLayers) {
      const maxResolution = layer.olInstance.getMaxResolution();
      const minResolution = layer.olInstance.getMinResolution();
      layer.inRange = ((resolution >= minResolution) && (resolution <= maxResolution));
    }
  }

  /**
   * Elimina la capa del array de capas activas
   * @param  {VsLayer} vsLayer Capa a eliminar
   * @return {boolean}         True o false si se eliminó la capa
   */
  private _removeActiveLayer(vsLayer: VsLayer) {

    const index: number = this.activeLayers.indexOf(vsLayer, 0);
    if (index !== -1) {
      // la propia capa tambien notifica el borrado. Es necesario para el mapa de usuario
      // que ha obtenido las vsLayers del mapa se entere del borrado sin tener que recargar todo el arbol
      vsLayer.notifyRemove();
      this.activeLayers.splice(index, 1);
    }
  }

  private reprojectAllLayersGeometries(epsgSource: string, epsgDestiny: string) {
    // Reproyección de todas las geometrias de capas vectoriales en el mapa y de sus resoluciones
    this.getLayers().forEach(
      (layer) => {
        if (layer instanceof ol.layer.Vector) {
          this.reprojectVectorLayerGeometries(layer, epsgSource, epsgDestiny);
        }
        this.reprojectLayersResolutions(layer, epsgSource, epsgDestiny);
      });
    // Cambio del valor de la proyección asignada a las capas vectoriales y su extent
    for (const layer of this.activeLayers) {
      if (layer instanceof VsLayerVector) {
        layer.projection = epsgDestiny;
        layer.extent = layer.olInstance.getSource().getExtent();
        layer.layerChange();
      }
    }
  }

  private reprojectVectorLayerGeometries(layer: ol.layer.Vector, epsgSource: string, epsgDestiny: string) {
    layer.getSource().getFeatures().forEach(
      (feature) => {
        const geometry = feature.getGeometry();
        if (geometry) {
          geometry.transform(epsgSource, epsgDestiny);
        }
      },
    );
  }

  private reprojectLayersResolutions(layer: ol.layer.Base, epsgSource: string, epsgDestiny: string) {
    const maxResolution = layer.getMaxResolution();
    const minResolution = layer.getMinResolution();
    if (maxResolution !== Infinity) {
      layer.setMaxResolution(
        Utilities.calculateSourceResolution(ol.proj.get(epsgDestiny),
          ol.proj.get(epsgSource), this.getView().getCenter(), maxResolution));
    }
    if (minResolution !== 0) {
      layer.setMinResolution(
        Utilities.calculateSourceResolution(ol.proj.get(epsgDestiny),
          ol.proj.get(epsgSource), this.getView().getCenter(), minResolution));
    }
  }
}
