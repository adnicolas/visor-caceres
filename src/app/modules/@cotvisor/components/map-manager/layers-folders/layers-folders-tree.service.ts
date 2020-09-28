import { Injectable } from '@angular/core';
import { ParentService } from '@cotvisor/services/parent.service';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { LayersFolderClass } from './layers-folder.class';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { ToastService } from '@theme/services/toast.service';
import { UserMapFolderModel, LayerModel } from '@cotvisor-admin/models';
import { takeUntil } from 'rxjs/operators';


// FIXME añadir nuevo atributo para mantern la estructura parent_node y node_id.
// no podemos depender de id que solo se tiene tras grabar la carpeta
@Injectable()
export class LayersFoldersTreeService extends ParentService {

  // Carpeta Raiz que forma el árbol de carpetas
  private rootFolder: BehaviorSubject<LayersFolderClass> = new BehaviorSubject<LayersFolderClass>(null);
  // Carpeta del árbol seleccionada
  public selectedFolder: LayersFolderClass;

  private vsMapUserMap: VsMapUserMap;

  private unSubscribe: Subject<boolean> = new Subject<boolean>();

  private totalLayers: VsLayer[];

  private nextNodeId: number;

  constructor(private vsMapService: VsMapService, private toastService: ToastService) {
    super();
    this.vsMapService.activeMapChanged$.subscribe((vsMap: VsMapUserMap) => {
      if (vsMap) {
        this.vsMapUserMap = vsMap;
        this.initLayersFoldersTree();
      }
    });

  }

  public getRootFolder(): Observable<LayersFolderClass> {
    return this.rootFolder.asObservable();
  }

  //   /**
  //    *
  //    *
  //    * @param {VsLayer} vsLayer
  //    * @param {LayersFolderClass} layersFolder
  //    * @memberof LayersFoldersTreeClass
  //    */
  //   public deleteVsLayerFromFolder(vsLayer: VsLayer, layersFolder: LayersFolderClass) {
  //     layersFolder.deleteVsLayer(vsLayer);
  //   }

  /**
   * Actualiza el nombre de la carpeta de mapa de usuario al del modelo del visor
   *
   * @param {LayersFolderClass} folder
   * @memberof LayersFoldersTreeService
   */
  public changeUserFolderName(folder: LayersFolderClass) {
    this.getUserMapFolderByNodeId(folder.nodeId).name = folder.name;
  }

  /**
   * Crea una nueva carpeta hija de la carpeta seleccionada del árbol
   *
   * @param {string} name
   * @memberof VsTreeFolderManager
   */
  public createFolder(name: string): LayersFolderClass {
    this.selectedFolder.open = true;
    const newFolder = this.selectedFolder.createChildFolder(name);
    // Asignamos el siguiente nodeID
    newFolder.nodeId = '' + this.nextNodeId;
    this.nextNodeId++;
    newFolder.toogleEdit();
    // Añadimos la nueva carpeta al modelo de mapa de usuario
    const userMapFolder = new UserMapFolderModel();
    userMapFolder.id = null;
    userMapFolder.name = name;
    userMapFolder.nodeId = newFolder.nodeId;
    userMapFolder.parentNodeId = newFolder.parentNodeId;
    userMapFolder.layers = newFolder.sourceUserLayers;
    userMapFolder.userMapId = this.vsMapUserMap.userMapSource.id;
    this.vsMapUserMap.userMapSource.folders.push(userMapFolder);
    // Actualizamos el orden del modelo
    this.orderFolder(this.selectedFolder);
    return newFolder;
  }

  /**
   * Elimina una carpeta del arbol accediendo a su padre y eliminándola de las hijas
   * @param  {VsTreeLayerNode} vsNode [description]
   * @return {[type]}                 [description]
   */
  public deleteFolder() {
    if (this.selectedFolder.deepLevel === 0) {
      this.toastService.showInfo({ summary: 'La carpeta raíz no se puede eliminar', detail: 'Carpeta Raíz' });
    } else {
      // Eliminamos la carpeta y todos sus hijos recursivamente del árbol
      this.deleteRecursiveFolder(this.selectedFolder, this.getParentFolder(this.selectedFolder));
      this.setSelectedFolder(this.rootFolder.value);
    }
  }

  /**
   * Se marca como seleccionada la carpeta pasada por parámetro
   *
   * @param {LayersFolderClass} newSelectedFolder
   * @memberof LayersFoldersTreeService
   */
  public setSelectedFolder(newSelectedFolder: LayersFolderClass) {
    if (this.selectedFolder) { this.selectedFolder.selected = false; }
    this.selectedFolder = newSelectedFolder;
    this.selectedFolder.selected = true;
  }

  /**
   * Se selecciona la carpeta root
   *
   * @memberof LayersFoldersTreeService
   */
  public selectRootFolder() {
    this.setSelectedFolder(this.rootFolder.value);
  }

  /**
   * destruye el árbol de carpetas de forma recursiva
   *
   * @param {LayersFolderClass} [folder]
   * @memberof LayersFoldersTreeClass
   */
  public destroyFoldersTree(folder?: LayersFolderClass) {

    const subFolderTree = folder ? folder : this.rootFolder.value;

    subFolderTree.childNodes.forEach(
      (childFolder) => {
        if (childFolder instanceof LayersFolderClass) {
          this.destroyFoldersTree(childFolder);
        }
      },
    );
  }

  /**
   * Obtiene la carpeta a partir del id proporcionado
   *
   * @param {number} nodeId
   * @param {LayersFolderClass} [folder]
   * @memberof LayersFoldersTreeService
   */
  public getFolderByNodeId(nodeId: string, fromFolder?: LayersFolderClass): LayersFolderClass {
    fromFolder = fromFolder || this.rootFolder.value;
    if (fromFolder.nodeId === nodeId) {
      return fromFolder;
    } else if (fromFolder.childNodes != null) {
      let folder = null;
      for (let i = 0; folder == null && i < fromFolder.childNodes.length; i++) {
        folder = this.getFolderByNodeId(nodeId, fromFolder.childNodes[i] as LayersFolderClass);
      }
      return folder;
    }
    return null;
  }

  /**
   * Obtiene la carpeta del modelo usermap a partir del id proporcionado
   *
   * @param {string} nodeId
   * @returns {UserMapFolderModel}
   * @memberof LayersFoldersTreeService
   */
  public getUserMapFolderByNodeId(nodeId: string): UserMapFolderModel {
    for (const folder of this.vsMapUserMap.userMapSource.folders) {
      if (folder.nodeId === nodeId) {
        return folder;
      }
    }
  }

  /**
   * Mueve el nodo (carpeta/capa) con id nodeId desde la carpeta fromParentNodeId a la carpeta toParentNodeId
   * en el orden seleccionado
   * @param {number} nodeId
   * @param {number} fromParentNodeId
   * @param {number} toParentNodeId
   * @param {number} order
   * @memberof LayersFoldersTreeService
   */
  public moveNode(nodeId: (string), fromParentNodeId: string, toParentNodeId: string, type: string, order: number) {
    let fromParentFolder: LayersFolderClass;
    let toParentFolder: LayersFolderClass;

    if (fromParentNodeId !== toParentNodeId) {
      fromParentFolder = this.getFolderByNodeId(fromParentNodeId);
      toParentFolder = this.getFolderByNodeId(toParentNodeId);
    } else {
      fromParentFolder = toParentFolder = this.getFolderByNodeId(fromParentNodeId);
    }

    // Hago los cambios en el modelo del visor y del mapa de usuario
    if (fromParentFolder && toParentFolder) {
      // Elimino el nodo que queremos mover de la carpeta origen
      for (let i = 0; i < fromParentFolder.childNodes.length; i++) {
        // FIX cuidado con el nombre que no es algo único. Hay que buscar alguna combinación que de resultado
        if ((type === 'folder' && (fromParentFolder.childNodes[i] as LayersFolderClass).nodeId === nodeId) ||
          (type === 'layer' && (fromParentFolder.childNodes[i] as VsLayer).name === nodeId)) {
          const node: LayersFolderClass | VsLayer = fromParentFolder.childNodes.splice(i, 1)[0];
          // Si la ha encontrado, muevo la carpeta/capa a la carpeta destino
          if (node) {
            toParentFolder.childNodes.splice(order, 0, node);
            if (type === 'folder') {
              // Asigno el nuevo deeplevel y cambio el parentnode
              (node as LayersFolderClass).deepLevel = toParentFolder.deepLevel + 1;
              (node as LayersFolderClass).parentNodeId = toParentFolder.nodeId;
            }

          }
          // Hago los cambios en el modelo del mapa de usuario
          if (type === 'layer') {
            if (fromParentNodeId !== toParentNodeId) {
              let index;
              fromParentFolder.sourceUserLayers.some((layer, x) => {
                return layer.name === nodeId ? (index = x, true) : false;
              });
              if (!isNaN(index)) {
                const layerModel: LayerModel = fromParentFolder.sourceUserLayers.splice(index, 1)[0];
                // Si la ha encontrado, muevo la capa a la carpeta destino
                if (layerModel) {
                  // Aquí da igual el orden dentro del array, porque solo hay capas y no tiene en cuenta las carpetas
                  toParentFolder.sourceUserLayers.push(layerModel);
                }
              }
            }

          } else {
            const userMapFolder = this.getUserMapFolderByNodeId(nodeId);
            if (userMapFolder) {
              userMapFolder.parentNodeId = toParentNodeId;
            }
          }
          if (fromParentNodeId !== toParentNodeId) {
            // Ordeno de nuevo la carpeta origen
            this.orderFolder(fromParentFolder);
            // Ordeno de nuevo la carpeta destino
            this.orderFolder(toParentFolder);
          } else {      // Ordeno de nuevo la carpeta origen
            this.orderFolder(fromParentFolder);
          }
          break;
        }
      }
    }

    // Actualizo el zindex de las capas
    this.updateLayersZindex();
  }

  /**
   * Actualiza el zindex de las capas del árbol de acuerdo a la posición que ocupan
   * @private
   * @memberof LayersFoldersTreeService
   */
  private updateLayersZindex() {
    if (this.rootFolder.value) {
      this.totalLayers = this.getAllLayersFromTree(this.rootFolder.value);
      for (let i = 0; i < this.totalLayers.length; i++) {
        this.totalLayers[i].setZIndex(this.totalLayers.length - i);
      }
    }
  }

  /**
   * Encuentra la carpeta padre de la carpeta pasada como parámetro
   *
   * @private
   * @param {LayersFolderClass} folder
   * @param {LayersFolderClass} [fromFolder]
   * @returns {LayersFolderClass}
   * @memberof LayersFoldersTreeService
   */
  private getParentFolder(folder: LayersFolderClass, fromFolder?: LayersFolderClass): LayersFolderClass {

    let parentFolder: LayersFolderClass;

    if (!fromFolder) { fromFolder = this.rootFolder.value; }
    let i = 0;
    while (i < fromFolder.childNodes.length && !parentFolder) {
      if (fromFolder.childNodes[i] instanceof LayersFolderClass) {
        if (folder === fromFolder.childNodes[i]) {
          parentFolder = fromFolder;
          break;
        } else {
          parentFolder = this.getParentFolder(folder, fromFolder.childNodes[i] as LayersFolderClass);
        }
      }

      i++;
    }

    return parentFolder;
  }

  /**
   * Asigna las propiedades de orden a los hijos de la carpeta de acuerdo a su posición en el array de hijos
   *
   * @private
   * @param {LayersFolderClass} folder
   * @param {UserMapFolderModel} userMapFolder
   * @memberof LayersFoldersTreeService
   */
  private orderFolder(folder: LayersFolderClass) {
    // Reordeno los hijos del modelo del visor y del mapa de usuario
    for (let i = 0; i < folder.childNodes.length; i++) {
      folder.childNodes[i].order = i + 1;
      let node;
      if (folder.childNodes[i] instanceof LayersFolderClass) {
        node = this.getUserMapFolderByNodeId((folder.childNodes[i] as LayersFolderClass).nodeId);
      } else {
        node = folder.sourceUserLayers.find((layer) => layer.name === (folder.childNodes[i] as VsLayer).name);
      }
      if (node) {
        node.order = i + 1;
      }
    }
    // console.log(this.vsMapUserMap.userMapSource);
  }

  /**
   * Añade una nueva VsLayer al arbol de carpetas
   * Por defecto se incluirá en la carpeta seleccionada del árbol
   *
   * @private
   * @param {VsLayer} vsLayer
   * @memberof LayersFoldersTreeComponent
   */
  private addVsLayerToLayersFoldersTree(vsLayer: VsLayer) {
    this.addVsLayerToFolder(vsLayer, this.selectedFolder);
    // Actualizamos el orden del modelo
    this.orderFolder(this.selectedFolder);
  }
  /**
   * Añade una capa a la carpeta indicada y se suscribe al evento de borrado para eliminarla cuando se
   * elimine del mapa
   *
   * @param {VsLayer} vsLayer
   * @param {LayersFolderClass} LayersFolderClass
   * @memberof VsTreeFolderManager
   */
  private addVsLayerToFolder(vsLayer: VsLayer, layersFolder: LayersFolderClass) {
    layersFolder.addVsLayer(vsLayer);
  }

  /**
   * Inicializa el arbol de capas y sus subscriciones cada vez que cambia el mapa activo
   *
   * @private
   * @memberof LayersFoldersTreeClass
   */
  private initLayersFoldersTree() {
    // Si ya estaba inicializada la carpeta raiz, destruimos recursivamente las anteriores carpetas y sus susbcripciones
    if (this.rootFolder.value) {
      this.destroyFoldersTree();
    }
    this.buildFoldersTree();
    this.selectedFolder = this.rootFolder.value;
    this.selectedFolder.open = true;
    // Elimino la anterior subscribción del anterior mapa si la hubiese
    this.unSubscribe.next(true);
    // SUSCRIBIRSE AL MAPA PARA OBTENER LAS CAPAS EXTERNAS QUE SE AÑADAN tras la carga inicial
    this.vsMapUserMap.observableLayerAdded$.pipe(takeUntil(this.unSubscribe)).subscribe(
      (vsLayer: VsLayer) => {
        // No tenemos en cuenta las que son del tipo top layer. Estas capas son de búsquedas, mediciones...
        if (!vsLayer.isTopLayer && !vsLayer.isBaseLayer) {
          this.addVsLayerToLayersFoldersTree(vsLayer);
        }
      },
    );
  }

  /**
   * Construye el árbol de carpetas de usuario con sus capas
   *
   * @private
   * @memberof LayersFoldersTreeComponent
   */
  private buildFoldersTree() {
    const rootfolder = this.buildRootFolder();
    if (rootfolder) {
      this.totalLayers = [];
      this.nextNodeId = 2;
      this.buildChildFolders(rootfolder);
      this.rootFolder.next(rootfolder);
      // Actualizo las capas al estado del árbol
      this.updateLayersZindex();
    }
  }

  /**
   * Contruye la carpeta root para el componente desde las carpetas de usuario del mapa.
   * Será quella cuyo padre es nulo
   *
   * @private
   * @returns {UserMapFolderModel}
   * @memberof LayersFoldersTreeComponent
   */
  private buildRootFolder(): LayersFolderClass {

    let found: LayersFolderClass = null;

    this.vsMapUserMap.userMapSource.folders.forEach((sourcefolder) => {
      if (sourcefolder.parentNodeId == null) {
        const rootLayersFolder = new LayersFolderClass();
        rootLayersFolder.id = sourcefolder.id;
        rootLayersFolder.name = sourcefolder.name;
        rootLayersFolder.nodeId = sourcefolder.nodeId;
        rootLayersFolder.parentNodeId = sourcefolder.parentNodeId;
        rootLayersFolder.order = sourcefolder.order;
        rootLayersFolder.sourceUserLayers = sourcefolder.layers;
        // Obtiene las capas vslayers referenciadas en el array sourceUserLayers (si no es nulo) desde el mapa activo
        if (rootLayersFolder.sourceUserLayers) {
          this.getVsLayersFromMap(rootLayersFolder.sourceUserLayers).forEach(
            // en este punto no se añaden las capas al sourceUserLayers
            // ya que estamos creando las vsLayers a partir de estas
            (vsLayer) => rootLayersFolder.addVsLayer(vsLayer, false),
          );
        }
        found = rootLayersFolder;
      }

    });
    return found;

  }

  /**
   * Construye las carpetas hijas de una carpeta del componetne
   *
   * @private
   * @param {LayersFolderClass} folder
   * @returns {LayersFolderClass[]}
   * @memberof LayersFoldersTreeComponent
   */
  private buildChildFolders(folder: LayersFolderClass) {

    const childFolders: LayersFolderClass[] = [];
    this.vsMapUserMap.userMapSource.folders.forEach((sourcefolder) => {
      if (sourcefolder.parentNodeId === folder.nodeId) {
        const childFolder = new LayersFolderClass(sourcefolder.name);
        this.nextNodeId = this.nextNodeId <= parseInt(sourcefolder.nodeId, 10)
          ? parseInt(sourcefolder.nodeId, 10) + 1 : this.nextNodeId;
        childFolder.id = sourcefolder.id;
        childFolder.nodeId = sourcefolder.nodeId;
        childFolder.order = sourcefolder.order;
        childFolder.sourceUserLayers = sourcefolder.layers;
        childFolder.parentNodeId = folder.nodeId;
        childFolder.deepLevel = folder.deepLevel + 1;
        childFolder.open = false;
        // Obtiene las capas vslayers referenciadas en el array sourceUserLayers (si no es nulo) desde el mapa activo
        this.getVsLayersFromMap(childFolder.sourceUserLayers).forEach(
          // en este punto no se añaden las capas al sourceUserLayers ya que estamos
          // creando las vsLayers a partir de estas
          (vsLayer) => {
            childFolder.addVsLayer(vsLayer, false);
          },
        );
        childFolders.push(childFolder);
      }

    });

    // llamada recursiva para construir los hijas
    childFolders.forEach((childFolder) =>
      this.buildChildFolders(childFolder),
    );
    // En este caso, ...folder.childNodes son las capas construidas antes y ...childFolders son las subcarpetas
    folder.childNodes = [...folder.childNodes, ...childFolders];
    // Tras tener los nodos hijos definitivos, los ordenamos
    folder.childNodes.sort((a, b) => {
      return a.order - b.order;
    });
  }

  /**
   * Devuelve todas las capas que tenga el árbol de capas
   *
   * @private
   * @param {LayersFolderClass} rootFolder
   * @memberof LayersFoldersTreeService
   */
  private getAllLayersFromTree(rootFolder: LayersFolderClass) {
    let vsLayers = [];
    rootFolder.childNodes.forEach((node) => {
      if (node instanceof LayersFolderClass) {
        vsLayers = [...vsLayers, ...this.getAllLayersFromTree(node)];
      } else {
        vsLayers.push(node);
      }
    });
    return vsLayers;
  }

  /**
   * Obtiene las capas referenciadas en el array layers de LayersFolderClass del
   * mapa activo por su nombre
   *
   * @private
   * @param {*} rootLayersFolder
   * @returns {VsLayer[]}
   * @memberof LayersFoldersTreeComponent
   */
  private getVsLayersFromMap(sourceUserLayers): VsLayer[] {

    const vsLayers = [];
    sourceUserLayers.forEach(((sourceUserLayer) => {
      const vsLayerSearched = this.vsMapUserMap.getVsLayerByName(sourceUserLayer.name);
      if (vsLayerSearched) {
        vsLayers.push(vsLayerSearched);
      }
    }));
    vsLayers.reverse();

    return vsLayers;
  }

  /**
   * Elimina una carpeta y todas sus subcarpetas y capas de forma recursiva
   *
   * @param {LayersFolderClass} layersFolder
   * @memberof LayersFolderClass
   */
  private deleteRecursiveFolder(layersFolder: LayersFolderClass, parentLayersFolder: LayersFolderClass) {
    let index;
    let i = layersFolder.childNodes.length;
    // Eliminamos los nodos hijos. Es necesario recorrerlo de forma inversa porque estamos eliminando nodos del array
    while (i--) {
      if (layersFolder.childNodes[i] instanceof LayersFolderClass) {
        this.deleteRecursiveFolder(layersFolder.childNodes[i] as LayersFolderClass, layersFolder);
      } else {
        this.vsMapService.removeVsLayer(layersFolder.childNodes[i] as VsLayer);
      }
    }
    // Eliminamos la carpeta contenida en el padre
    parentLayersFolder.deleteChildFolder(layersFolder);
    // Eliminamos la carpeta de la lista de carpetas del mapa de usuario
    index = this.vsMapUserMap.userMapSource.folders.findIndex((folder) =>
      folder.nodeId === layersFolder.nodeId);
    if (index >= 0) {
      this.vsMapUserMap.userMapSource.folders.splice(index, 1);
    }
  }
}
