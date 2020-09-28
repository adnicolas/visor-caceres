import { CategoryElement } from './category-element';

export interface Dimension {
    '@name': string;
    '@label': string;
    category?: CategoryElement[] | CategoryElement;
}
