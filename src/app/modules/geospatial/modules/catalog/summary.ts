import { Dimension } from './dimension';
export interface Summary {
    '@count': string;
    '@type': string;
    dimension: Dimension[];
}
