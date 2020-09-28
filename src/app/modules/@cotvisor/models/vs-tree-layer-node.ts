import { VsLayer } from './vs-layer';
export class VsTreeLayerNode {

  // identificador del nodo
  public id: string;
  // Título del nodo
  public title: string;
  // nodos Hijos, los nuevos nodos se deben insertar al inicio del array
  public childNodes: VsTreeLayerNode[];
  // Nodo Padre
  public parentNode: VsTreeLayerNode;
  // Capas del nodo, las nuevas capas se deben insertar al inicio del array
  public layers: VsLayer[];
  // profundidad del nodo
  public deepLevel: number;
  // nodo abierto ?
  private open: boolean;

  constructor(id: string, title: string) {
    this.title = title;
    this.id = id;
    this.childNodes = [];
    this.layers = [];
    this.parentNode = null;
    this.deepLevel = 0;
    this.open = false;
  }

  /**
   * Abre o cierra el estado del nodo
   * @return {[type]} [description]
   */
  public toggleNode() {
    this.open = !this.open;
  }

  /**
   * indica si el nodo está abierto o cerrado
   * @return {boolean} [description]
   */
  public isOpen(): boolean {
    return this.open;
  }

  /**
   * Añade un nodo hijo al actual y lo añade al inicio del array de hijos
   * @param  {VsTreeLayerNode} node [description]
   * @return {[type]}               [description]
   */
  public addChildNode(node: VsTreeLayerNode): VsTreeLayerNode {
    node.parentNode = this;
    node.deepLevel = this.deepLevel + 1;
    //  this.childNodes.push(node);
    this.childNodes.unshift(node);
    return node;
  }

  /**
   *
   * Crea un nodo vacío y lo añade al nodo actual al inicio del array de nodos hijos
   * @param  {string}          id    [description]
   * @param  {string}          title [description]
   * @return {VsTreeLayerNode}       [description]
   */
  public addChildEmptyNode(id: string, title: string): VsTreeLayerNode {
    const newNode = new VsTreeLayerNode(id, title);
    newNode.parentNode = this;
    newNode.deepLevel = this.deepLevel + 1;
    // this.childNodes.push(newNode);
    this.childNodes.unshift(newNode);
    return newNode;
  }

  /**
   * Añade una capa VsLayer al inicio del array de capas del nodo
   * @param  {VsLayer} vsLayer [description]
   * @return {[type]}          [description]
   */
  public addVsLayerToNode(vsLayer: VsLayer) {
    // this.layers.push(vsLayer)
    this.layers.unshift(vsLayer);
  }

}
