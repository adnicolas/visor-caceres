import { ValueLink } from './value-link';
export interface KeywordGroup {
    group: {
        [k: string]: ValueLink[];
    }[];
}
