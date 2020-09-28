import { Injectable } from '@angular/core';
import * as ol from 'openlayers';
import proj4 from 'proj4';
import { BaseLayersService } from './base-layers.service';
import { ParentService } from './parent.service';
import { PresetLayersService } from './preset-layers.service';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsMapConfig } from '@cotvisor/models/VsMapConfig';
import { VsView } from '@cotvisor/models/vs-view';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';
import { TypeConversion } from '@cotvisor/classes/utils/type-conversion.class';
import { UserMapModel } from '@cotvisor-admin/models/user-map.model';

/**
 * Servicio de mapas
 *
 * Servicio que almacena los mapas que contiene la aplicacion y crea y destruye los mismos
 * Declara los observables a los que se pueden suscribir los componentes para gestionar la comunicacion
 * entre componentes y los mapas.
 *
 *
 * @return {[type]} [description]
 */
@Injectable({
  providedIn: 'root'
})
export class VsMapService extends ParentService {

  // indice del mapa activo en el array
  private activeMap: VsMap;

  // eventos observables
  private activeMapChangedSource = new BehaviorSubject<VsMap>(null);
  public activeMapChanged$: Observable<VsMap>;
  // Capa eliminada del mapa
  private layerDeletedSource = new Subject<VsLayer>();
  public layerDeleted$: Observable<VsLayer>;
  // capa añadida al mapa
  private layerAddedSource = new Subject<VsLayer>();
  public layerAdded$: Observable<VsLayer>;
  // borrado de geometrias de la Capa de búsqueda
  private searchLayerClearedSource = new Subject<any>();
  public searchLayerCleared$: Observable<any>;
  // array de mapas que contiene todos los mapas de la aplicacion.
  // En un visor simple sólo contendrá un elemento
  private updateMapSizeSource = new Subject<VsMap>();
  public updateMapSize$: Observable<any>;

  // array de mapas
  public maps: VsMap[];

  // configuracion por defecto para la creacion de mapas
  public defaultConfig: VsMapConfig;
  /**
   * Constructor - Establece los observables del servicio
   * @param  {PresetLayersService} privatepresetLayersService [description]
   * @param  {WMCService}          privatewmcService          [description]
   * @return {[type]}                                         [description]
   */
  constructor(
    private presetLayersService: PresetLayersService,
    private baseLayerService: BaseLayersService,
    // private userMapsService: UserMapsService
  ) {
    super();
    this.maps = [];

    // Observables
    // Cambio de mapa activo
    this.activeMapChanged$ = this.activeMapChangedSource.asObservable();
    // Se ha limpiado la capa de busquedas
    this.searchLayerCleared$ = this.searchLayerClearedSource.asObservable();
    // Adición de capa
    this.layerAdded$ = this.layerAddedSource.asObservable();
    // Eliminacion de capa
    this.layerDeleted$ = this.layerDeletedSource.asObservable();
    // Cambio de tammaño de mapa
    this.updateMapSize$ = this.updateMapSizeSource.asObservable();

    // Inicializo las distintas proyecciones soportadas por los mapas con Proj4
    ol.proj.setProj4(proj4);
    for (const projection of environment.all_app_projections) {
      proj4.defs(projection.code, projection.proj4_def);
    }


    // const view = new ol.View({
    //     center: [0, 0],
    //     zoom: 1
    // });

    this.defaultConfig = {
      map: {

        renderer: 'canvas',
        target: 'ol-map-div',
        view: new ol.View(
          {
            projection: environment.map_view.default_projection,
            center: [environment.map_view.map_center[0], environment.map_view.map_center[1]],
            minZoom: environment.map_view.view_constraints.min_zoom,
            zoom: environment.map_view.initial_zoom,
            extent: [
              environment.map_view.view_constraints.max_extent[0],
              environment.map_view.view_constraints.max_extent[1],
              environment.map_view.view_constraints.max_extent[2],
              environment.map_view.view_constraints.max_extent[3],
            ]

          }
        ),
        // view: new ol.View({
        //     center: [0, 0],
        //     zoom: 1
        // }),

        baselayer: new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        // isBaseLayer: true
        controls: [new ol.control.ScaleLine()],
      },
    };
  }


  /**
   * Crea una nueva instancia VsMap y devuelve una promesa con el mapa.
   * Por defecto crea el mapa en un div ol-map-div'
   * Crea una nueva vista
   * Crea un nuevo objeto de la clase VsMap o VsMapUserMap si llega el parámetro userMap
   * Para VsMap
   *    Añade las capas recibidas en el configuracion o las establecidas por la configuracion por defecto
   *    Añade las capas predefinidas
   * Para VsMapUserMap
   *    Añade las capas del userMap al mapa
   *    Establece la vista desde los parámetros del userMap
   *
   * Añade el mapa al array de mapas del servicio
   * retorna la promesa con el mapa
   *
   * @param {*} [config]
   * @param {*} [userMap]
   * @returns {Promise<VsMap>}
   * @memberof VsMapService
   */
  public newMap(config?: any, userMap?: UserMapModel): Promise<VsMap> {
    let newMap: VsMap;

    if (typeof config === 'undefined') {
      config = this.defaultConfig;
    }
    // Creamos una mapa VsMap o VSMapUserMap
    if (userMap) {
      newMap = this.getNewVsMapUserMap(config, userMap);
    } else {
      newMap = this.getNewVsMap(config);
    }
    // obtenemos la linea de escala del mapa
    this.getScaleLineControl(newMap);

    // Actualiza el tamaño
    newMap.updateSize();

    // Nos subscribimos al cambio de tamaño del mapa para que lo notifique mediante updateMapSizeSource
    newMap.on('change:size', this.notifyResizeMap);

    // añade el nuevo mapa creado al servicio
    this.addMap(newMap);

    // return newMap;
    return Promise.resolve(newMap);
  }
  /**
   * Obtiene la escala de los controles de ol para estableceral como propiedad del VsMap
   *
   * @private
   * @param {VsMap} newMap
   * @memberof VsMapService
   */
  private getScaleLineControl(newMap: VsMap) {
    newMap.getControls().forEach((item, key) => {
      if (item instanceof ol.control.ScaleLine) {
        newMap.scaleLine = item;
      }
    });
  }

  /**
   * Obtiene el mapa activo
   * @return {VsMap} [description]
   */
  public getActiveMap(): VsMap {
    if (this.activeMap) {
      return this.activeMap;
    } else {
      console.error(this.constructor.name + ' - No hay mapas activos');
      return null;
    }
  }

  /**
   * Establece el mapa activo si llega mapa nulo establece el mapa nulo
   * @return {VsMap} Mapa activado
   */
  public setActiveMap(vsMap: VsMap): boolean {
    if (!vsMap) {
      this.activeMapChangedSource.next(null);
    } else {
      this.maps.forEach((map) => {
        if (map === vsMap) {
          this.activeMap = map;
          this.activeMapChangedSource.next(vsMap);
        }

      });
    }
    return true;
  }

  /**
   * obtiene  el array de mapas
   * @return {VsMap[]} array con todos los mapas creados
   */
  public getMaps(): VsMap[] {
    return this.maps;
  }

  /**
   * Obtener un mapa por su Target
   * @param  {string} target [description]
   * @return {VsMap}     [description]
   */
  public getMapById(target: string): VsMap {
    let map: VsMap = null;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.maps.length; i++) {
      if (this.maps[i].getTarget() === target) {
        map = this.maps[i];
        break;
      }
    }
    return map;
  }

  /**
   * Añade un mapa al array de mapas del servicio
   * @param {VsMap} map   Mapa a añadir
   *
   */
  public addMap(map: VsMap): void {
    map.name = 'Mapa ' + this._getLastMapID() + 1;
    this.maps.push(map);
    this.setActiveMap(map);
  }

  /**
   * Elimina el mapa del servicio
   * @todo Pendiente de implementar
   * @param  {VsMap} vsMap Mapa a elminar
   * @return {[type]}          [description]
   */
  public removeMap(vsMap: VsMap) {

    let deleted: boolean = false;
    // Quitamos la subscripción al cambio de tamaño
    vsMap.un('change:size', this.notifyResizeMap);
    // comprobamos si el mapa a eliminar es el activo
    // en cuyo caso establecemos como activo el último creado
    // const actualActiveMap = this.getActiveMap();
    // if (actualActiveMap === vsMap) {
    //     this.setActiveMap(null);
    // }

    // eliminamos el mapa
    for (let i = this.maps.length - 1; i >= 0; --i) {
      if (this.maps[i] === vsMap) {
        this.maps.splice(i, 1);
        deleted = true;
        // establecemos el último mapa como activo
        if (this.maps.length) {
          this.setActiveMap(this.maps[this.maps.length - 1]);

        } else {
          this.setActiveMap(null);

        }

        break;
      }
    }
    return deleted;
  }

  /**
   * Elimina las features de la capa de búsquedas y notifica el evento a los
   * componentes suscritos
   * @param  {VsLayer} vslayer Capa a elminar
   * @return {[type]}          [description]
   */
  public clearSearchLayer() {
    this.getActiveMap().clearSearchLayer();
    // Notificamos el borrado
    this.searchLayerClearedSource.next();
  }

  /**
   * Añade las features a la capa de búsquedas del mapa activo
   * @param  {ol.Feature} feature [description]
   * @return {[type]}             [description]
   */
  public addFeaturesToSearchLayer(features: ol.Feature[]) {
    this.getActiveMap().addFeaturesToSearchLayer(features);
  }

  /**
   * Elimina la capa del mapa activo y notifica el evento a los
   *  componentes suscritos
   * @param  {VsLayer} vslayer Capa a elminar
   * @return {[type]}          [description]
   */
  public removeVsLayer(vslayer: VsLayer) {
    this.getActiveMap().removeVsLayer(vslayer);
    // Notificamos el borrado
    this.layerDeletedSource.next(vslayer);
  }

  /**
   * Añade una capa al mapa activo y notifica a los suscritos
   * @param  {VsLayer} layer Capa a añadir
   * @return {[type]}        [description]
   */
  public addVsLayer(vslayer: VsLayer) {
    this.getActiveMap().addVsLayer(vslayer);
    // TODO si el mapa ya emite el dato de capa añadida este observable del servicio deberia emitir tambien el mapa al que se ha añadido la capa
    this.layerAddedSource.next(vslayer);
  }

  /**
   * Añade una capa vsLayer desde un servidor WMS
   * @param  {string}  url     URl del servidor
   * @param  {VsLayer} vsLayer VsLayer a cargar. Puede llegar con la instancia de
   * Ol creada o sin ella en cuyo caso se crea
   * @return {[type]}          [description]
   */
  public addWMSLayer(url: string, vsLayer: VsLayerWMS) {

    // comprobamos si es un servidor sin capas tileadas leyendo desde
    // configuracion los servidores a los que no se pueden pedir capas tileadas
    let layerTiled = true;
    for (const NO_TILED_SERVERS_DOMAINS of environment.no_tiled_servers_domains) {
      if (url.indexOf(NO_TILED_SERVERS_DOMAINS) > 0) {
        layerTiled = false;
        break;
      }
    }

    // si el objeto VsLayer aun no tiene la instancia de OL la creamos
    if (typeof vsLayer.olInstance === 'undefined') {
      vsLayer.olInstance = new ol.layer.Tile({
        visible: true,
        source: new ol.source.TileWMS(({
          url,
          params: {
            LAYERS: vsLayer.name,
            TILED: layerTiled,
          },
          projection: environment.map_view.default_projection,
        })),
      });
    }

    // En la carga establecemos el estilo activo que por defecto es el de indice 0
    // Si la capa no tiene estilos disponibles no tiene efecto
    vsLayer.setStyle(vsLayer.getActiveStyle());

    // Pongo la capa en el top del visor
    vsLayer.setZIndex(this.getActiveMap().getActiveLayers().length);

    this.addVsLayer(vsLayer);

  }

  public getVectorStyles() {
    return {
      general: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(186, 27, 48, 0.2)',
        }),
        stroke: new ol.style.Stroke({
          color: '#ba283b',
          width: 3,
        }),
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: 'rgba(186, 27, 48, 1)',
          }),
        }),
      }),
      text: new ol.style.Style({
        text: new ol.style.Text({
          font: '12px helvetica,sans-serif',
          fill: new ol.style.Fill({
            color: 'rgb(186, 27, 48)',
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      }),
    };
  }

  // ************************** MÉTODOS PRIVADOS ********************************

  /**
   * Obtiene capas predefinidas desde un JSON y las añade al mapa
   * NO CARGA ESTAS CAPAS EN EL ARBOL DE CAPAS predefinidas que son las de WMC
   * @param  {VsMap}  map [description]
   * @return {[type]}     [description]
   */
  private addPresetLayersToMap(map: VsMap) {

    this.presetLayersService.getPresetLayersSources().then(
      (presetLayersSources: Array<any>) => {
        presetLayersSources.forEach((layerSource) => {
          const vsLayer = new VsLayerWMS({
            name: layerSource.name,
            title: layerSource.title,
            projection: this.activeMap.getView().getProjection().getCode(),
            service: { url: layerSource.url, description: '', title: '', type: 'WMS' },
          });
          vsLayer.nodePath = ['Precargadas'];
          vsLayer.setVisible(layerSource.active === 'true');

          map.addVsLayer(vsLayer);
          // notificamos la capa añadida
          this.layerAddedSource.next(vsLayer);
        });
      });

  }


  /**
   *  Añade las capas base al mapa
   *
   * PAra mapa VsMap añade las capas base de configuración
   *
   * Para VsMapUserMap
   *
   * @private
   * @param {(VsMapUserMap|VsMap)} map
   *
   * @memberOf VsMapService
   */
  private addBaseLayerToMap(map: VsMapUserMap | VsMap) {
    this.baseLayerService.getBaseLayers().then((vsLayers) => {
      for (const vsLayer of vsLayers) {
        map.addVsLayer(vsLayer);
      }
      map.baseLayersLoaded();

      // Para el mapa de usaurio establece como activa ala capa base de la capa de usuario
      if (map instanceof VsMapUserMap) {

        if (map.userMapSource.baseLayerId) {
          for (const bl of map.getBaseLayers()) {
            if (bl.id === map.userMapSource.baseLayerId) {
              bl.setVisible(true);
            } else {
              bl.setVisible(false);
            }
          }
        } else {
          // Si el mapa tiene una capa base que no está ya cargada, se asigna la primera capa base definida
          map.getBaseLayers().forEach(
            (bl, idx) => {
              if (idx === 0) {
                bl.setVisible(true);
                map.userMapSource.baseLayerId = bl.id;
              } else {
                bl.setVisible(false);
              }
            });
        }
      }
    });
  }

  /**
   * Genera las VsLayers en el mapa a partir de las capas incluídas en el UserMapModel del VsMapUserMap
   *
   * @private
   * @param {VsMapUserMap} vsMap
   * @memberof VsMapService
   */
  private addUserLayersToMap(vsMap: VsMapUserMap) {

    vsMap.userMapSource.folders.forEach((folder) => {
      folder.layers.forEach((layer) => {
        const vsLayer = TypeConversion.createVsLayerFromLayerModel(layer);

        if (!vsLayer) {
          throw new Error(`Capa ${layer.name} de  ${layer.service.url}. Capa de tipo ${layer.service.type} no soportada `);
        }

        vsMap.addVsLayer(vsLayer);
        // notificamos la capa añadida
        this.layerAddedSource.next(vsLayer);
      });
    });
  }

  // /**
  //  * lee y añade al mapa el WMC indicado en la configuracion de la aplicación
  //  *
  //  * @param  {VsMap}  map [description]
  //  * @return {[type]}     [description]
  //  */
  // private addWMCPresetToMap(map: VsMap) {
  //     if (this.CONFIG.ENDPOINTS.PRESET_WMC) {
  //         this.wmcService.readWMC(this.CONFIG.ENDPOINTS.PRESET_WMC).then(
  //             (wmcText) => {
  //                 this.wmcService.parseWMCText(wmcText).then(
  //                     (wmcObject) => {
  //                         const vsWMC = this.wmcService.mapWMCtoVsWMC(wmcObject);
  //                         this.wmcService.setVsWMCtoMap(vsWMC, map);
  //                     },
  //                 );
  //             },
  //         );
  //     }
  // }

  /**
   * Obtiene el último id de array de mapas
   * @return {[type]} [description]
   */
  private _getLastMapID() {
    return this.maps.length;
  }

  /**
   * Construye el mapa (VsMapUserMap) a partir del UserMapModel recibido
   *
   * @private
   * @param {*} config
   * @param {string} target
   * @param {VsView} view
   * @param {*} userMap
   * @returns
   * @memberof VsMapService
   *
   */
  private getNewVsMapUserMap(config: any, userMap: UserMapModel): VsMapUserMap {

    // Establecemos la vista del mapa a partir del userMap
    const newVsMapUserMap = this.createVsmapFromUserMap(userMap, config);

    // añade la capa base de configuracion por defecto
    this.addLayersFromUserMap(newVsMapUserMap);
    return newVsMapUserMap;
  }

  /**
   * Construye un nuevo vsMap con las opciones recibidas
   * Añade las capas base desde config
   * Añade capas como predefinidas
   * Carga el contexto inicial del mapa desde WMC
   *
   *
   * @private
   * @param {*} config
   * @param {string} target
   * @returns {VsMap}
   * @memberof VsMapService
   */
  private getNewVsMap(config: any): VsMap {

    const newMap = this.createVsMap(config);
    // añade la capa base de configuracion por defecto
    this.addBaseLayerToMap(newMap);
    // Consulta y añade capas como predefinidas
    this.addPresetLayersToMap(newMap);
    // Carga el contexto inicial del mapa desde WMC
    // this.addWMCPresetToMap(newMap);
    return newMap;
  }

  /**
   * Añade las capas del mapa de usaurio al vsUserMap
   *
   * @private
   * @param {VsMapUserMap} vsMapUserMap
   * @param {*} config
   * @memberof VsMapService
   */
  private addLayersFromUserMap(vsMapUserMap: VsMapUserMap) {
    // TODO ¿ eliminar la carga de capas base en mapas de usaurio ?
    this.addBaseLayerToMap(vsMapUserMap);
    this.addUserLayersToMap(vsMapUserMap);
  }

  /**
   * Instancia un nuevo objeto VsUserMap a partir del objeto de mapa de usuario recibido
   *
   * @private
   * @param {UserMapModel} userMap
   * @param {*} config
   * @returns {VsMapUserMap}
   * @memberof VsMapService
   */
  private createVsmapFromUserMap(userMap: UserMapModel, config: VsMapConfig): VsMapUserMap {

    /* TODO el extent de la vista solo permite definirlo en la inicialización,
    si cambiamos la proyección seguramente habría que cambiar el extent creando una nueva vista */
    // @ts-ignore


    let maxExtent: ol.Extent = [
      environment.map_view.view_constraints.max_extent[0],
      environment.map_view.view_constraints.max_extent[1],
      environment.map_view.view_constraints.max_extent[2],
      environment.map_view.view_constraints.max_extent[3]];
    if (environment.map_view.default_projection !== userMap.projection) {
      // parseFloat(maxExtent[0].toFixed(3))
      maxExtent = ol.proj.transformExtent(maxExtent, userMap.projection, environment.map_view.default_projection);
    }

    const mapView = new VsView({
      projection: userMap.projection,
      center: environment.map_view.map_center,
      extent: maxExtent,
      zoom: environment.map_view.initial_zoom,
      minZoom: environment.map_view.view_constraints.min_zoom,
    });
    // Asigno la máxima zona que se va a ver en el mapa
    // mapView.getProjection().setExtent(maxExtent);
    const newVsMapUserMap = new VsMapUserMap({
      layers: [],
      controls: config.map.controls,
      target: config.map.target,
      view: mapView,
    }, userMap);
    // Establecemos el bbox del mapa del usuario al nuevo mapa
    newVsMapUserMap.setInitialBbox([userMap.bboxMinX, userMap.bboxMinY, userMap.bboxMaxX, userMap.bboxMaxY] as ol.Extent);
    // escuchamos el primer cambio de tamaño del mapa para establecer la vista
    newVsMapUserMap.once('change:size', () => {
      mapView.fit(newVsMapUserMap.getInitialBbox(), { size: newVsMapUserMap.getSize() });
    });
    return newVsMapUserMap;
  }

  /**
   * Crea un nuevo vsMap a partir de los datos de configuracion recibidos
   *
   * @private
   * @param {*} config
   * @returns
   * @memberof VsMapService
   */
  private createVsMap(config: VsMapConfig) {
    // config.map.view = new ol.View({
    //     center: [0, 0],
    //     zoom: 1
    // });
    // @TODO comprobar
    const view = config.map.view;
    const newMap = new VsMap({
      layers: [],
      controls: config.map.controls,
      target: config.map.target,
      view
    });

    return newMap;
  }

  private notifyResizeMap = (event) => {
    this.updateMapSizeSource.next(event.target);
  }
}
