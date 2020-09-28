import { FilterModes } from './filter.modes.enum';
export interface DatatableColParams {
    field: string;
    header: string;
    hideFilter?: boolean;
    format?: string;
    required?: boolean;
    filterMode?: FilterModes;
}
