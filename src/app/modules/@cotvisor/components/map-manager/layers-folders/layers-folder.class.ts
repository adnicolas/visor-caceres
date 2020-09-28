import { VsLayer } from '@cotvisor/models/vs-layer';
import { LayerModel, UserMapFolderModel } from '@cotvisor-admin/models';
import { TypeConversion } from '@cotvisor/classes/utils/type-conversion.class';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import * as ol from 'openlayers';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsLayerWMTS } from '@cotvisor/models/vs-layer-wmts';


/**
 * Clase que representa las carpetas del albol que contienen capas
 *
 * @export
 * @class LayersFolderClass
 */

export class LayersFolderClass {

  // identificador de la carpeta
  public id: number;
  // nombre de la carpeta
  public name: string;
  // nodos hijos, puede tratarse de subcarpetas o de capas de la carpeta
  public childNodes: Array<LayersFolderClass | VsLayer>;
  // Referencia a la carpeta actual. Usado para crear nuevas carpetas e identificarlas aunque aún no tengan id
  public nodeId: string;
  // Referencia a la carpeta padre
  public parentNodeId: string;
  // Orden de la carpeta dentro de la padre
  public order: number;
  // capas en el modelo leído de BBDD que se deberá MANTENER SINCRONIZADO con las vsLayers para un posterior guardado
  public sourceUserLayers: LayerModel[];
  // profundidad del nodo
  public deepLevel: number;
  // si está abierta la carpeta
  public open: boolean;
  // la carpeta está en edicion
  public editable: boolean = false;
  // la carpeta está seleccionada
  public selected: boolean = false;

  constructor(title?: string) {
    this.id = null;
    this.name = title ? title : null;
    this.childNodes = [];
    this.sourceUserLayers = [];
    this.nodeId = null;
    this.parentNodeId = null;
    this.deepLevel = 0;
    this.open = false;
  }

  /**
   * toggle para editar la carpeta
   *
   * @memberof LayersFolderClass
   */
  public toogleEdit() {
    this.editable = !this.editable;
  }

  /**
   * Añade un nodo hijo al actual y lo añade al inicio del array de hijos
   * @param  {VsTreeLayerNode} node [description]
   * @return {[type]}               [description]
   */
  public addChildFolder(layersFolder: LayersFolderClass) {
    layersFolder.parentNodeId = this.nodeId;
    layersFolder.deepLevel = this.deepLevel + 1;
    this.childNodes.unshift(layersFolder);
    return layersFolder;
  }

  /**
   * Elimina una carpeta hija
   *
   * @param {LayersFolderClass} layersFolder
   * @memberof LayersFolderClass
   */
  public deleteChildFolder(layersFolder: LayersFolderClass) {

    const i = this.childNodes.findIndex(
      (e) => e === layersFolder,
    );
    if (i >= 0) {
      this.childNodes.splice(i, 1);
    }
  }

  /**
   *
   * Crea un nodo vacío y lo añade al nodo actual al inicio del array de nodos hijos
   * @param  {string}          id    [description]
   * @param  {string}          title [description]
   * @return {VsTreeLayerNode}       [description]
   */
  public createChildFolder(title: string) {
    const newFolder = new LayersFolderClass(title);
    newFolder.parentNodeId = this.nodeId;
    newFolder.deepLevel = this.deepLevel + 1;
    this.childNodes.unshift(newFolder);
    return newFolder;
  }

  /**
   * Añade una capa VsLayer al inicio del array de capas del nodo
   *
   * @param  {VsLayer} vsLayer [description]
   * @return {[type]}          [description]
   */
  public addVsLayer(vsLayer: VsLayer, addToSourceMap?: boolean) {

    let layerModel: LayerModel;
    // si no se recibe el parametro para añadir la capa al sourcemap, se añade
    // normalmente solo se recibirá como falso en la construccion inicial del arbol de carpetas desde el sourceMap
    if (addToSourceMap === undefined) {
      addToSourceMap = true;
    }
    // Recojo el layerModel para añadirlo al listado de capas de la carpeta. Además, se usa para sincronizar los eventos
    if (addToSourceMap) {
      layerModel = TypeConversion.createLayerModelFromVsLayer(vsLayer);
      this.sourceUserLayers.push(layerModel);
    } else {
      layerModel = this.sourceUserLayers.find((sourceUserLayer) => sourceUserLayer.name === vsLayer.name);
    }
    // Para las capas vectoriales, nos suscribimos a cada cambio producido
    let layerVectorUpdatedSuscription;
    // wms/wmts
    let layerStyleSuscription;
    let layerFormatSuscription;
    let layerLanguageSuscription;
    if (vsLayer instanceof VsLayerVector) {
      layerVectorUpdatedSuscription = vsLayer.changed$.subscribe(
        () => {
          layerModel.projection = vsLayer.projection;
          // bbox en la proyección de la capa
          layerModel.bboxMaxX = vsLayer.extent ? vsLayer.extent[2] : null;
          layerModel.bboxMaxY = vsLayer.extent ? vsLayer.extent[3] : null;
          layerModel.bboxMinX = vsLayer.extent ? vsLayer.extent[0] : null;
          layerModel.bboxMinY = vsLayer.extent ? vsLayer.extent[1] : null;
          // Actualizo el kml
          const content = new ol.format.KML().writeFeatures(vsLayer.olInstance.getSource().getFeatures(),
            { dataProjection: 'EPSG:4326', featureProjection: vsLayer.projection });
          layerModel.userContent = content;
        },
      );
    } else if (vsLayer instanceof VsLayerWMS) {
      layerStyleSuscription = vsLayer.activeStyle$.subscribe(
        (style) => layerModel.selectedStyle = style.name,
      );
      layerFormatSuscription = vsLayer.activeFormat$.subscribe(
        (format) => layerModel.selectedFormat = format,
      );
      layerLanguageSuscription = vsLayer.activeLanguage$.subscribe(
        (language) => layerModel.selectedLanguage = language,
      );
    } else if (vsLayer instanceof VsLayerWMTS) {
      // estilos
      // layerStyleSuscription = vsLayer.activeStyle$.subscribe(
      //   (style) => layerModel.selectedStyle = style.name,
      // );
    }
    // Nos subscribimos a los eventos de la capa
    const layerVisibleSuscription = vsLayer.visible$.subscribe(
      (visible) => {
        layerModel.visible = visible;
      }
    );
    const layerOpacitySuscription = vsLayer.opacity$.subscribe(
      (opacity) => layerModel.opacity = opacity,
    );
    const layerdeletedSuscription = vsLayer.deleted$.subscribe(
      (deletedVsLayer) => {
        this.deleteVsLayer(deletedVsLayer);
        layerOpacitySuscription.unsubscribe();
        layerVisibleSuscription.unsubscribe();
        layerdeletedSuscription.unsubscribe();
        if (layerStyleSuscription) {
          layerStyleSuscription.unsubscribe();
        }
        if (layerFormatSuscription) {
          layerFormatSuscription.unsubscribe();
        }
        if (layerLanguageSuscription) {
          layerLanguageSuscription.unsubscribe();
        }

        if (layerVectorUpdatedSuscription) {
          layerVectorUpdatedSuscription.unsubscribe();
        }
      },
    );

    this.childNodes.unshift(vsLayer);

  }

  /**
   * Elimina una vsLayers del Array
   *
   * @param {VsLayer} vsLayer
   * @memberof LayersFolderClass
   */
  public deleteVsLayer(vsLayer: VsLayer) {
    let i = this.childNodes.findIndex(
      (e) => e === vsLayer,
    );
    if (i >= 0) { this.childNodes.splice(i, 1); }

    // eliminar layer del userMapSource
    // FIXME puede provocar errores en el caso de capas de distinto tipo con el mismo nombre??
    if (vsLayer instanceof VsLayerWMS) {
      i = this.sourceUserLayers.findIndex(
        (e) => (e.name === vsLayer.name && e.service.url === vsLayer.service.url),
      );
    } else {
      i = this.sourceUserLayers.findIndex(
        (e) => (e.name === vsLayer.name),
      );
    }
    if (i >= 0) { this.sourceUserLayers.splice(i, 1); }

  }

  /**
   * Mapea un usermapFolder al layerFolder
   *
   * @param {UserMapFolderModel} userMapFolder
   * @memberof LayersFolderClass
   */
  public mapUserMapFolder(userMapFolder: UserMapFolderModel) {
    this.id = userMapFolder.id;
    this.name = userMapFolder.name;
    this.nodeId = userMapFolder.nodeId;
    this.parentNodeId = userMapFolder.parentNodeId;
    this.sourceUserLayers = userMapFolder.layers;
  }

}
