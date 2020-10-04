import { PublisherFeatureModel } from './publisher-feature.model';

export class PublisherLayerModel {
  features: PublisherFeatureModel[];
  types: { [k: string]: any; };
  name: string;
  title: string;
  crs: string;



  constructor() {

    this.types = {};
    this.features = [];
    this.name = null;
    this.title = null;
    this.crs = null;

  }
}

