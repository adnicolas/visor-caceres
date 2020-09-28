import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';

export class LayerToDraw {

  public vsLayer: VsLayerVector;
  public selectedToDraw: boolean;
  public nameEditing: boolean;
  public layerTypeClass: string;

  constructor(vsLayer: VsLayerVector, selectToDraw: boolean) {
    this.vsLayer = vsLayer;
    this.selectedToDraw = selectToDraw;
    this.nameEditing = false;
    this.layerTypeClass = '';
  }

}
