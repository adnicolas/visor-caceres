import { ErrorBase } from './error-base.class';

/**
 * Clase para el lanzamiento de erroes en peticiones http desde el back
 *
 * @export
 * @class ErrorHttp
 * @extends {Error}
 */
export class ErrorHttp extends ErrorBase {
    operation: string;
    httpStatus: number;
    adicionalInfo: string;

    constructor(title: string, message: string, status: number, operation: string, stack?: any) {
        super(title, message, 'ErrorHttp', stack);
        this.httpStatus = status;
        this.operation = operation;
        this.adicionalInfo = message;
        // @ts-ignore
        switch (status) {
            case 0:
                this.title = 'Servicio no disponible';
                this.message = 'No se ha podido acceder al servicio para ' + this.operation;
                break;
            case 403:
                this.title = 'Prohibido';
                this.message = 'No dispone de acceso a ' + this.operation;
                break;
            case 401:
                this.title = 'Sin permisos';
                this.message = 'No dispone permisos para ' + this.operation;
                break;
            case 200:
                // La petición ha sido respondida correctamente pero hay un error en el contenido devuelto
                this.title = `Error en la respuesta recibida ${title}`;
                this.message = message;
                break;
            default:
                this.title = 'Error en la operación';
                this.message = 'Se ha producido un error, no ha sido posible ' + this.operation;
                break;
        }
    }

}
