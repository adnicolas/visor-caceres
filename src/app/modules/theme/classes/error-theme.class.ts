import { ErrorBase } from './error-base.class';


/**
 * Clase para el lanzamiento de erroes del tema
 *
 * @export
 * @class CustomHttpErrorClass
 */
export class ErrorTheme extends ErrorBase {

    constructor(errorSource: string, message: string) {
        super(errorSource, message, 'ErrorTheme');
    }
}
