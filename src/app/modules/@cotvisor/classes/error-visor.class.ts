import { ErrorBase } from '@theme/classes/error-base.class';


/**
 * Clase para el lanzamiento de erroes del visor
 *
 * @export
 * @class CustomHttpErrorClass
 */
export class ErrorVisor extends ErrorBase {

  title: string;
  message: string;

  constructor(errorSource: string, message: string, stack?: any) {
    super(errorSource, message, 'ErrorVisor', stack);


  }
}



