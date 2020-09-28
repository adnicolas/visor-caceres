import { HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { ErrorHttp } from './error-http.class';

/**
 * Clase que implementa el método estático handleError para que pueda ser usado por 
 * cualquier módulo que necesite lanzar errores en los servicios. El objetivo es tener 
 * centralizado el control del errores con una clase proporcionadad por el tema
 * 
 * @export
 * @class ServicesErrorManager
 */
export class ThemeServicesErrorManager {

    constructor() { }

    /**
     * Manejo de errores en peticiones http, continúa la ejecución devolviendo una notificación de error al observable
     * 
     * @static
     * @param {HttpErrorResponse} error 
     * @param {string} operation 
     * @param {BehaviorSubject<boolean>} [loadingSubject]  Permite pasar opcionalmente un BehaviorSubject usado por los servicios para notificar 
     * cuando están cargando
     * @returns 
     * 
     * @memberOf ServicesErrorManager
     */
    static handleError(error: HttpErrorResponse, operation: string, loadingSubject?: BehaviorSubject<boolean>) {


        if (loadingSubject) loadingSubject.next(false);

        if (error.error instanceof ErrorEvent) {
            // Error en la parte del cliente Manejar adecuadamente
        } else {
            let message;
            error.error ? message = error.error : message = error.message;
        }
        const errorHttp = new ErrorHttp(error.name, error.message + error.error, error.status, operation);
        // retorna un observable con los datos del error para ser tratado en la subscrición
        return throwError(errorHttp);
    }

}


