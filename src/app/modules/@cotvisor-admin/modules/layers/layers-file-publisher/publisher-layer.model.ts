import { PublisherFeatureModel } from './publisher-feature.model';

export class PublisherLayerModel {
    features: PublisherFeatureModel[];
    types: { [k: string]: any; };
    title: string;
    crs: string;



    constructor() {

        this.types = {};
        this.features = [];
        this.title = null;
        this.crs = null;

    }
}

