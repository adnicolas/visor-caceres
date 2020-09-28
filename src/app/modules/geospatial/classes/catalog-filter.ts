import { Filter } from './filter.class';
/**
 *  Clase que extiende la clase filter y define
 *  la clase para los filtros de escenas
 *
 * @export
 * @abstract
 * @class SceneFilter
 * @extends {Filter}
 */
export class CatalogFilter extends Filter {
    contentType: string; //    json 
    fast: string; // index
    sortBy: string; // relevance
    searchTerm: string;

    constructor() {
        super();
        this.resetFilter();
    }

    /**
     * Genera la cadena de parámetros necesaria con el filtro
     * o un objeto a pasar al servicio como filtro.
     * Deberá tener las geometrías como WKT
     *
     * @returns {string}
     *
     * @memberOf SceneFilter
     */
    generateFilterParameters(): any {
        // TODO genera la cadena u objeto para la consulta al servicio evaluando los parametros del filtro
        const filterParameters = {
            resultsPerPage: this.pagination.resultsPerPage,
        };
        return filterParameters;
    }

    /**
     * Inicializa los valores del filtro
     *
     * @abstract
     * @memberof Filter
     */
    public resetFilter() {
        super.resetFilter();
        this.contentType = 'json';
        this.fast = 'index';
        this.sortBy = 'Relevance';
        this.searchTerm = '';

    }

}




