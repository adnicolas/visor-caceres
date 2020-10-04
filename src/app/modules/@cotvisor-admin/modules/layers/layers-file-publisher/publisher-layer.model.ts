import { PublisherFeatureModel } from './publisher-feature.model';

export class PublisherLayerModel {
  features: PublisherFeatureModel[];
  types: { [k: string]: any; };
  title: string;
  name: string;
  crs: string;



  constructor() {

    this.types = {};
    this.features = [];
    this.title = null;
    this.name = null;
    this.crs = null;

  }
}

