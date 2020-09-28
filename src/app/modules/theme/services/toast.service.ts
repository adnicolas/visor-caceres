import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ToastMessageInterface } from '@theme/classes/toast-message.interface';
import { LoggerService } from './logger.service';
import { environment } from 'src/environments/environment';

/**
 * Servicio de mensajes toast
 * Para su correcto funcoinamiento el layout usado en la página debe tener al menos un toast insertado:
 *
 * <p-toast></p-toast>
 *
 * @export
 * @class ToastService
 */
// TODO es necesario en root?
@Injectable({
  providedIn: 'root'
})
// tslint:disable:no-string-literal
export class ToastService {

  constructor(private messageService: MessageService, private logger: LoggerService) { }

  showError(message: ToastMessageInterface) {
    message['severity'] = 'error';
    if (environment.toast.mantainErrorToast) message['life'] = 60000;
    else message['life'] = environment.toast.duration;
    this.messageService.add(message);
    this.logger.error(`${message.summary} -  ${message.detail}`);
  }

  showSuccess(message: ToastMessageInterface) {
    message['severity'] = 'success';
    message['life'] = environment.toast.duration;
    this.messageService.add(message);
    this.logger.log(`${message.summary} -  ${message.detail}`);
  }

  showInfo(message: ToastMessageInterface) {
    message['severity'] = 'info';
    message['life'] = environment.toast.duration;
    this.messageService.add(message);
    this.logger.info(`${message.summary} -  ${message.detail}`);
  }

  showWarning(message: ToastMessageInterface) {

    message['severity'] = 'warn';
    message['life'] = environment.toast.duration;
    this.messageService.add(message);
    this.logger.warn(`${message.summary} -  ${message.detail}`);
  }


  clear() {
    this.messageService.clear();
  }
}
