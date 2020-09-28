import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { VsLayerOptions } from './vs-layer-options';

/**
 * Clase padre de las capas del visor. Clase abstracta, sólo se puden instanciar las clases hijas
 * @export
 * @abstract
 * @class VsLayer
 */
export abstract class VsLayer {
  // Nombre de la capa
  public name: string;
  // Título de la capa
  public title: string;
  // Proyección de la capa
  public projection: string;
  // Tipo de capa
  public sourceType: string;
  // Comprobar si es capa base. Por defecto es falso
  public isBaseLayer: boolean = false;
  // Comprobar si es una capa puesta por encima de todas sin mostrarse en la toc. Por defecto es falso
  public isTopLayer: boolean = false;
  // Si la capa es consultable. Por defecto está a true
  public queryable: boolean = true;
  // Instancia de OL de la capa
  public olInstance: any;
  // Imagen/representación del mapa en data64
  public img: string;
  // Extent de la capa
  public extent: ol.Extent;
  // estado de visivilidad de la capa
  private visible: boolean;
  // orden de la capa
  public zIndex: number;
  // Opacidad de la capa en porcentaje, establece la opacidad en la instancia
  // De 0 a 100 se establece a traves del setter
  public opacity: number;
  // Orden de la capa dentro de una carpeta, teniendo en cuenta las subcarpetas
  public order: number;
  // Nivel profundidad de la capa en el árbol de capas
  public level: number = 0;
  // Subcapas que contiene la capa
  public subLayers: VsLayer[] = [];
  // NodePath
  public nodePath: string[] = [];

  // State
  public loading: boolean = false;
  public errorLoading: boolean = false;
  public inRange: boolean = false;
  public id?: number;
  // Contador de teselas/imágenes cargadas
  private loadingCounter: number = 0;

  private _observableDeletedSource = new Subject<VsLayer>();
  private _observableVisibleSource = new BehaviorSubject<boolean>(false);
  private _observableOpacitySource = new BehaviorSubject<number>(100);
  private _observableChangedSource = new Subject();
  public deleted$: Observable<VsLayer>;
  public visible$: Observable<boolean>;
  public opacity$: Observable<number>;
  public changed$: Observable<any>;

  /**
   * Creates an instance of VsLayer.
   * @param {VsLayerOptions} options
   * @memberof VsLayer
   */
  constructor(options: VsLayerOptions) {

    // Inicializa el objeto segun la configuracion recibida

    this.name = options.name;
    this.title = options.title;
    this.id = options.id;
    this.projection = options.projection;
    this.opacity = 100;
    this.visible = true;

    // Recoge los parámetros opcionales propios de una capa genérica
    if (options.hasOwnProperty('opt_options')) {
      this.isBaseLayer = options.opt_options.hasOwnProperty('isBaseLayer') ? options.opt_options.isBaseLayer : false;
      this.isTopLayer = options.opt_options.hasOwnProperty('isTopLayer') ? options.opt_options.isTopLayer : false;
      this.img = options.opt_options.hasOwnProperty('img') ? options.opt_options.img : null;
      this.olInstance = options.opt_options.hasOwnProperty('olInstance') ? options.opt_options.olInstance : null;
      this.extent = options.opt_options.hasOwnProperty('extent') ? options.opt_options.extent : null;
      this.queryable = options.opt_options.hasOwnProperty('queryable') ? options.opt_options.queryable : true;
      this.order = options.opt_options.hasOwnProperty('order') ? options.opt_options.order : 0;
      this.opacity = options.opt_options.hasOwnProperty('opacity') ? options.opt_options.opacity : 100;
      this.visible = options.opt_options.hasOwnProperty('visible') ? options.opt_options.visible : true;
    }
    this.deleted$ = this._observableDeletedSource.asObservable();
    this.visible$ = this._observableVisibleSource.asObservable();
    this.opacity$ = this._observableOpacitySource.asObservable();
    this.changed$ = this._observableChangedSource.asObservable();
    this._observableVisibleSource.next(this.visible);
    this._observableOpacitySource.next(this.opacity);

  }

  /**
   * Asigna el valor de la opacidad de la capa
   *
   * @param {number} opacity
   * @memberof VsLayer
   */
  public setOpacity(opacity: number): void {
    // Convertimos la opacidad a un valor entre 0 y 1 permitido por openlayers
    this.opacity = opacity;
    this.olInstance.setOpacity(this.opacity / 100);
    this._observableOpacitySource.next(opacity);
  }

  /**
   * Devuelve el valor de la opacidad de la capa
   *
   * @param {number} opacity
   * @memberof VsLayer
   */
  public getOpacity(): number {
    return this.opacity;
  }

  /**
   * Asigna el valor del zIndex
   * @param {number} zIndex
   * @memberof VsLayer
   */
  public setZIndex(zIndex: number): void {
    this.zIndex = zIndex;
    this.olInstance.setZIndex(zIndex);
  }

  /**
   * Asigna el valor de la visibilidad de la capa
   *
   * @param {boolean} visible
   * @memberof VsLayer
   */
  public setVisible(visible: boolean): void {
    this.visible = visible;
    if (this.loading && !visible) {
      this.loading = false;
    }
    this.olInstance.setVisible(this.visible);
    this._observableVisibleSource.next(visible);

  }

  /**
   * Refresca la capa
   *
   * @memberof VsLayer
   */
  public refresh() {
    // Quito el error en el refresco
    this.errorLoading = false;
    this.olInstance.getSource().refresh();

  }

  /**
   * Devuelve el valor de la visibilidad de la capa
   *
   * @memberof VsLayer
   */
  public notifyRemove() {
    this._observableDeletedSource.next(this);
  }

  /**
   * Emite el evento que informa de que la capa ha cambiado
   *
   *
   * @memberOf VsLayer
   */
  public layerChange() {
    this._observableChangedSource.next();
  }

  public getVisible(): boolean {
    return this.visible;
  }

  /**
   *  Añade un elemento al array de subcapas
   * @param  {VsLayer} vsLayer subcapa a añadir
   * @return {[type]}          [description]
   */
  public addSubLayer(vsLayer: VsLayer) {
    this.subLayers.push(vsLayer);
  }

  /**
   * Añade una tesela/imagen al contador para saber las que quedan por cargar
   *
   * @private
   * @memberof VsLayerWMS
   */
  protected addLoading() {
    if (this.loadingCounter === 0) {
      this.loading = true;
    }
    ++this.loadingCounter;
  }

  protected addLoadedError() {
    this.errorLoading = true;
    this.addLoaded();
  }

  /**
   * Quita una imagen/tesela del contador de las que quedan por cargar
   *
   * @private
   * @memberof VsLayerWMS
   */
  protected addLoaded() {
    setTimeout(() => {
      --this.loadingCounter;
      if (this.loadingCounter <= 0) {
        this.loadingCounter = 0;
        this.loading = false;
      }
    }, 50);
  }

}
