import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private logger: NGXLogger) { }
  log(logText: string) { this.logger.log(logText); }
  info(logText: string) { this.logger.info(logText); }
  error(logText: string) { this.logger.error(logText); }
  warn(logText: string) { this.logger.warn(logText); }
  debug(logText: string, params: any[]) { this.logger.debug(logText, ...params); }

}
