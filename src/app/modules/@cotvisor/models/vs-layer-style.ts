import { VsLayerStyleLegend } from './vs-layer-style-legend';

export class VsLayerStyle {

  public name: string;
  public title: string;
  public abstract: string;
  public legendURL?: VsLayerStyleLegend[];

  public id?: number;

  constructor() {
    this.name = '';
    this.title = '';
    this.abstract = '';
    this.legendURL = [];
  }

}
