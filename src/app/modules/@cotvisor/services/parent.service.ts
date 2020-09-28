import { Injectable } from '@angular/core';
import { ConfigModuleService } from './config-module.service';
import { InjectorService } from './injector.service';

@Injectable({
  providedIn: 'root'
})
export class ParentService {


  constructor() {
    // obtengo el objeto con la configuración
    this.instanceID = 'SRV' + ParentService.id++;
  }
  public static id = 0;
  protected moduleConfig?: any = {};
  protected configModuleService: ConfigModuleService;
  protected instanceID; // identificador de la instancia generada

  public getServiceConfigAsync(): Promise<any> {
    this.configModuleService = InjectorService.injector.get(ConfigModuleService);
    return this.configModuleService.getModuleConfig(this.constructor.name).toPromise().then(
      (config) => this.moduleConfig = config);
  }

}
