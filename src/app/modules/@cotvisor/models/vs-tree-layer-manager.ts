import { VsLayer } from './vs-layer';
import { VsTreeLayerNode } from './vs-tree-layer-node';

export class VsTreeLayerManager {

  public rootNode: VsTreeLayerNode;
  public layersCounter: number = 0;

  constructor() {

    this.rootNode = new VsTreeLayerNode('root', 'Capas');
    /*let layers = new VsTreeLayerNode("Layers", "Layers")
    let nodo25000 = new VsTreeLayerNode("1_25000", "Mapa Topográfico 1:25.000")
    layers.addChildNode(nodo25000);
    this.rootNode.addChildNode(layers);*/

  }

  /**
   * Añade un nodo a la rama formada por el array de títulos de nodo
   * @param  {VsTreeLayerNode} node   [description]
   * @param  {string[]}        branch [description]
   * @return {[type]}                 [description]
   */
  public addVsLayerToBranch(vsLayer: VsLayer, branchTitles: string[]) {

    // creamos una copia local del array para no destruir la recibida por referencia
    // que pertence a una capa
    let localBranchTitles = branchTitles.slice(0);

    let destinyNode: VsTreeLayerNode = this.searchBranchByTitles(localBranchTitles);

    // si existe el nodo insertamos la capa
    if (destinyNode) {
      destinyNode.addVsLayerToNode(vsLayer);
      // incrementamos el número de capas en el arbol
      this.layersCounter++;
    } else {
      // si no existe creamos el nodo
      localBranchTitles = branchTitles.slice(0);
      destinyNode = this.createBranchByTitles(localBranchTitles);
      destinyNode.addVsLayerToNode(vsLayer);
      // incrementamos el número de capas en el arbol
      this.layersCounter++;
    }

  }

  public createBranchByTitles(branchTitles: string[], inNode?: VsTreeLayerNode): VsTreeLayerNode {

    const localBranchTitles = branchTitles.slice(0);
    let lastNode: VsTreeLayerNode;

    // buscámos el último nodo que existe del la rama recibida para crear de forma inversa
    do {
      lastNode = this.searchBranchByTitles(localBranchTitles);
      if (!lastNode) { localBranchTitles.pop(); }
    } while (!lastNode && localBranchTitles.length > 0);

    // lastNode aquí es el último nodo creado
    // buscamos la diferencia entre la rama a crear y el primero encontrado
    // indice del titulo del último nodo creado
    let lastBranchCreatedIndex = localBranchTitles.length;

    // array con los títulos de los nodos a crear a partir del nodo lastNode
    let branchTitlesToCreate: string[] = [];

    // si no se ha encontrado ningun nodo creado
    // nos encontramos en el caso de que es necesario crear toda la rama por lo que
    // inicializamos el array de la rama a crear para crearla completo y el ultimo nodo
    // al nodo raiz para crear ahí la rama
    if (!lastNode && localBranchTitles.length === 0) {
      branchTitlesToCreate = branchTitles.slice(0);
      lastNode = this.rootNode;
    } else {
      // si no hay que crear la rrama completa añadimos a los titulos a crear
      // los titulos restantes de branchTitles
      for (lastBranchCreatedIndex; lastBranchCreatedIndex <= branchTitles.length - 1; lastBranchCreatedIndex++) {
        branchTitlesToCreate.push(branchTitles[lastBranchCreatedIndex]);
      }
    }

    // creamos los nodos pendientes y retornamos el último
    for (const newBranchTitle of branchTitlesToCreate) {
      lastNode = lastNode.addChildEmptyNode(newBranchTitle, newBranchTitle);
    }

    return lastNode;

  }

  /**
   * Comprueba si existe la rama a traves de la rama de títulos
   * @param  {string[]} branchTitles array con la ruta de títulos
   * @return {boolean}               Retorna true si la rama existe
   */
  public existBranchByTitles(branchTitles: string[], inNode?: VsTreeLayerNode): boolean {

    let encontrado: boolean = false;
    // si no se recibe el parametro del nodo a partir del cual buscar,
    // se incicializa al root
    if (!inNode) { inNode = this.rootNode; }

    // vamos buscando los niveles de títulos de nodo recibidos
    for (const branchLevel of branchTitles) {
      // buscamos el titulo en los nodos del nivel actual
      for (const node of inNode.childNodes) {
        if (node.title === branchLevel) {
          if (branchTitles.length === 1) {
            encontrado = true;
            return encontrado;
          } else {
            branchTitles.shift();
            encontrado = this.existBranchByTitles(branchTitles, node);
          }
        }
      }
      // Si no se ha encontrado en el nivel, terminamos la búsqueda

    }
    return encontrado;
  }

  /**
   * * Busca el nodo de la ramma a traves de sus títulos y devuelve el nodo
   * @param  {string[]}        branchTitles array de títulos de niveles
   * @param  {VsTreeLayerNode} inNode       node de entrada en el que buscar (opcional)
   * @return {VsTreeLayerNode}              nodo de la rama buscada o undefined si no lo encuentra
   */
  public searchBranchByTitles(branchTitles: string[], inNode?: VsTreeLayerNode): VsTreeLayerNode {

    let nodoEncontrado: VsTreeLayerNode;
    const localBranchTitles = branchTitles.slice(0);

    // si no se recibe el parametro del nodo a poartir del cual buscar,
    // se incicializa al root
    if (!inNode) { inNode = this.rootNode; }

    // vamos buscando los niveles de títulos de nodo recibidos
    for (const branchLevel of localBranchTitles) {
      // buscamos el titulo en los nodos del nivel actual
      for (const node of inNode.childNodes) {
        if (node.title === branchLevel) {
          if (localBranchTitles.length === 1) {
            //  encontrado=true;
            return node;
          } else {
            localBranchTitles.shift();
            nodoEncontrado = this.searchBranchByTitles(localBranchTitles, node);
          }
        }
      }
      // Si no se ha encontrado en el nivel, terminamos la búsqueda

    }
    return nodoEncontrado;
  }

  /**
   * Elimina el nodo del arbol
   * @param  {VsTreeLayerNode} vsNode [description]
   * @return {[type]}                 [description]
   */
  public deleteVsLayerNode(vsLayerToDelete: VsLayer, inNode?: VsTreeLayerNode): boolean {

    // si no se recibe el parametro del nodo a poartir del cual buscar,
    // se incicializa al root
    if (!inNode) { inNode = this.rootNode; }
    let flagVsLayerDeleted: boolean = false;

    // vamos buscando los niveles de títulos de nodo recibidos
    // buscamos el titulo en los nodos del nivel actual
    for (const node of inNode.childNodes) {
      for (const nodeVslayer of node.layers) {
        if (nodeVslayer === vsLayerToDelete) {
          // si hemos encontrado la capa la eliminamos del array
          node.layers.splice(node.layers.indexOf(nodeVslayer), 1);
          flagVsLayerDeleted = true;
          this.layersCounter--;
          return flagVsLayerDeleted;
        }
      }
      if (!flagVsLayerDeleted) { flagVsLayerDeleted = this.deleteVsLayerNode(vsLayerToDelete, node); }
    }
    return flagVsLayerDeleted;
  }

  /**
   * Extrae del árbol todas las capas que contiene a un array
   * @param  {VsTreeLayerNode} inNode [description]
   * @return {VsLayer[]}              [description]
   */

  public extractVsLayersFromTree(inNode?: VsTreeLayerNode): VsLayer[] {

    // si no se recibe el parametro del nodo a partir del cual buscar,
    // se incicializa al root
    if (!inNode) { inNode = this.rootNode; }
    let vsLayerArray: VsLayer[] = [];

    // por cada nodo agregamos las capas que contiene y procesamos los nodos hijos

    // procesamos capas
    for (const vslayer of inNode.layers) { vsLayerArray.push(vslayer); }

    // si hay hijos hacemos la llamada recursiva
    if (inNode.childNodes.length > 0) {
      for (const childNode of inNode.childNodes) {
        const localVsLayerArray = this.extractVsLayersFromTree(childNode);
        vsLayerArray = vsLayerArray.concat(localVsLayerArray);
      }
    }

    return vsLayerArray;
  }

}
