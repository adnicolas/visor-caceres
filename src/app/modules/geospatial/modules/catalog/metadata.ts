import { KeywordGroup } from './keyword-group';
import { CRSDetails } from './crs-details';
export class Metadata {
    title: string;
    abstract: string = '';
    lineage: string;
    responsibleParty: string[];
    type: string[];
    isHarvested: string;
    displayOrder: string;
    docLocale: string;
    popularity: string;
    keyword: string[];
    credit: string;
    publishedForGroup: string;
    identifier: string;
    image: string[];
    tempExtentBegin: string;
    mdLanguage: string[];
    crsDetails: CRSDetails;
    // tslint:disable-next-line:variable-name
    maintenanceAndUpdateFrequency_text: string;
    format: string[];
    // tslint:disable-next-line:variable-name
    spatialRepresentationType_text: string;
    denominator: string;
    root: string;
    isTemplate: string;
    valid: string;
    tempExtentEnd: string;
    rating: string;
    source: string;
    status: string;
    updateFrequency: string;
    geoBox: string;
    owner: string;
    revisionDate: string;
    defaultAbstract: string = '';
    link: string[];
    defaultTitle: string;
    datasetLang: string;
    userinfo: string;
    topicCat: string;
    publicationDate: string;
    // tslint:disable-next-line:variable-name
    status_text: string;
    legalConstraints: string;
    creationDate: string;
    standardName: string;
    crs: string;
    parentId: string;
    keywordGroup: KeywordGroup[];
    _locale: string;
    'geonet:info': {
        [key: string]: string;
    };

    private arrayProperties = ['responsibleParty', 'type', 'keyword', 'mdLanguage', 'format', 'link', 'image'];
    public deserialize(input: any) {
        for (const arrayProperty of this.arrayProperties) {
            this.convertToArrayProperty(input, arrayProperty);
        }
        Object.assign(this, input);
        return this;
    }

    /**
     * Chequea si una propiedad es un array y si no lo convierte en uno
     *
     * @author Centro de Observación y Teledetección Espacial, S.L.U.
     * @private
     * @param {*} property
     * @memberof Metadata
     */
    private convertToArrayProperty(object, property) {
        if (object.hasOwnProperty(property) && !Array.isArray(object[property])) {
            object[property] = [object[property]];
        }
    }
}
