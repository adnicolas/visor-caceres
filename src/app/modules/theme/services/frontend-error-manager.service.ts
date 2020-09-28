
import { Injectable, ErrorHandler, NgZone } from '@angular/core';
import { ToastService } from './toast.service';
import { ErrorBase } from '@theme/classes/error-base.class';
import { LoggerService } from './logger.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FrontendErrorManagerService implements ErrorHandler {


  constructor(
    private toast: ToastService,
    private logger: LoggerService,
    public zone: NgZone,
  ) {

  }

  handleError(error: ErrorBase) {

    let errorMessage: string;
    let errortitle: string;
    let showToast = true;


    switch (true) {
      case !navigator.onLine:
        showToast = true;
        errorMessage = 'No hay conexión. Por favor compruebe su conexión.';
        errortitle = 'Sin conexión';
        break;
      case (error instanceof TypeError):
        this.logger.error(error.message);
        this.logger.error(error.stack);
        errorMessage = error.message;
        errortitle = error.title ? error.title : 'Error ';
        showToast = !environment.production;
        break;
      case (error.name === 'ErrorHttp'):
        this.logger.error(error.message);
        this.logger.error(error.adicionalInfo);
        this.logger.error(error.stack);
        errorMessage = `${error.message}. Error ${error.httpStatus}`;
        errortitle = error.title ? error.title : 'Error ';
        break;
      default:
        showToast = true;
        errorMessage = error.message;
        errortitle = error.title ? error.title : 'Error ';
        break;
    }

    if (showToast) {
      try {
        this.zone.run(() => this.toast.showError({ summary: errortitle, detail: errorMessage }));
        if (error.callback) error.callback();

      } catch (error) {
        this.logger.error(error);
        this.logger.info('No se ha podido mostrar el siguiente mensaje de error en la aplicación:');
        this.logger.error('Se ha producido un error ' + errorMessage);
      }
    }
    if (error.ngDebugContext) this.logger.debug(`Error en el componente ${error.ngDebugContext.component.constructor.name}`, [error.ngDebugContext.component, error.ngDebugContext.componentRenderElement]);
    if (error.stack) this.logger.error(error.stack);


  }

}
