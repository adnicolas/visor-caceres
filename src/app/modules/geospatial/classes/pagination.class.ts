import { environment } from 'src/environments/environment';

export class PaginationClass {
    /**
     * Registros totales
     * 
     * @type {number}
     * @memberOf PaginationClass
     */
    totalResults: number;
    // /**
    //  * pagina actual
    //  * 
    //  * @type {number}
    //  * @memberOf PaginationClass
    //  */
    // page: number;
    /**
     * Primer registro a mostrar
     * 
     * @type {number}
     * @memberOf PaginationClass
     */
    first: number;
    /**
     * Resultdos a mostrar en la página
     * 
     * @type {number}
     * @memberOf PaginationClass
     */
    resultsPerPage: number;
    /**
     * Páginas totales
     * 
     * @type {number}
     * @memberOf PaginationClass
     */
    totalPages: number;
    /**
     * Campo de orednación
     * 
     * @type {string}
     * @memberOf PaginationClass
     */
    sortField: string;
    /**
     * sentido de ordenacion 1 ascendente -1 descendente
     * 
     * @type {string}
     * @memberOf PaginationClass
     */
    sortDirection: number;

    constructor() {
        this.totalResults = 0;
        this.first = 1;
        this.resultsPerPage = environment.results_per_page;
        this.totalPages = 0;
        this.sortField = '';
        this.sortDirection = 1;

    }
}
