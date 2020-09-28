import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PaginationClass } from './pagination.class';
/**
 * Clase que define un filtro de forma genérica
 *
 * @export
 * @abstract
 * @class Filter
 */
export abstract class Filter {

    pristine = true; // Indica si el filtro no tiene cambios desde su creación
    pagination: PaginationClass;

    // Emite el filtro cuando se establece un nuevo filtro
    public filter$: Observable<Filter>;
    private filterSubject: BehaviorSubject<Filter>;
    // Emite el filtro cuando cambia la paginación
    public paginationChanges$: Observable<Filter>;
    private paginationChangesSubject: BehaviorSubject<Filter>;

    constructor() {
        this.filterSubject = new BehaviorSubject(this);
        this.paginationChangesSubject = new BehaviorSubject(this);
        this.filter$ = this.filterSubject.asObservable();
        this.paginationChanges$ = this.paginationChangesSubject.asObservable();
        this.pagination = new PaginationClass();
    }

    protected abstract generateFilterParameters();

    /**
     * Método a implementar por las clases para resetear el filtro
     *
     * @abstract
     * @memberof Filter
     */
    protected resetFilter() {
        this.pristine = true;
        this.pagination.first = 1;
        this.pagination.totalResults = 0;
        this.pagination.totalPages = 0;
    }

    /**
     * Establce el filtro
     *
     * @param {Filter} filter
     * @memberof Filter
     */
    public setFilter(filter: Filter) {
        this.pristine = false;
        Object.keys(filter).forEach(
            key => this[key] = filter[key]
        );
        this.emitFilter();
    }

    /**
     * Establece los datos de la respuesta de aplicar el filtro.
     * Se debe establecer desde el servicio
     *
     * @param {SearchResponseModel} paginarionResponse
     * @returns {*}
     * @memberof Filter
     */
    public setPagination(pagination: PaginationClass): any {
        this.pagination = pagination;
        this.paginationChangesSubject.next(this);
    }


    /**
     * Accede aplica al filtro la página indicada
     *
     * @param {number} page
     * @memberof Filter
     */
    public goto(page: number) {
        this.pagination.first = (page * this.pagination.resultsPerPage) + 1;
        this.emitFilter();
    }


    /**
     * Aplica al filtro la siguiente página
     *
     * @memberof Filter
     */
    public gotoNext() {
        this.goto(++this.pagination.totalPages);
    }

    /**
     * Aplica al filtro la página anterior
     *
     * @memberof Filter
     */
    public gotoPrev() {
        if (this.pagination.first - this.pagination.resultsPerPage > 1) {
            this.goto(--this.pagination.totalPages);
        }
    }

    /**
     *  Emite el filtro
     */
    private emitFilter() {
        this.filterSubject.next(this);
    }


}




