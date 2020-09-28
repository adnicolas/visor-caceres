import { Filter } from './filter.class';
import { environment } from 'src/environments/environment';
/**
 *  Clase que extiende la clase filter y define
 *  la clase para los filtros de escenas
 *
 * @export
 * @abstract
 * @class SceneFilter
 * @extends {Filter}
 */
export class SceneFilter extends Filter {

    public startDate?: Date;  // dd/mm/yyyy
    public endDate?: Date; // dd/mm/yyyy
    public sunElevation?: number;
    public cloudCover?: number;
    public areasFilter?: ol.Feature[];

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
            startDate: this.startDate.getTime() / 1000,
            endDate: this.endDate.getTime() / 1000,
            sunElevation: this.sunElevation,
            cloudCover: this.cloudCover,
            resultsPerPage: this.pagination.resultsPerPage,
            first: this.pagination.first
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
        // TODO Aclarar la forma de inicializar el filtro
        super.resetFilter();
        this.startDate = environment.default_scene_filter.startDate;
        this.endDate = environment.default_scene_filter.endDate;
        this.sunElevation = environment.default_scene_filter.sunElevation;
        this.cloudCover = environment.default_scene_filter.cloudCover;
        this.areasFilter = [];
    }

}




