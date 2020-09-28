import { Injectable } from '@angular/core';

import { ParentService } from './parent.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

/**
 * Servicio que devuelve las capas predefinidas.
 * Obtiene el json con las capas favoritas del endpoint configurado en config.constants.ts
 * @return {[type]} [description]
 */
@Injectable({
  providedIn: 'root'
})
export class PresetLayersService extends ParentService {

  public presetLayersSources: any;

  /**
   * Constructor. Carga las capas predefinidas en
   * @param  {Http}             privatehttp             [description]
   * @return {[type]}                                   [description]
   */

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * obtiene las url de las capas predefinidas
   * @return {[type]} [description]
   */

  public getPresetLayersSources(): Promise<any> {
    return this.http.get(`${environment.apis.visorAssets.baseUrl}${environment.apis.visorAssets.endpoints.preset_layers}`).toPromise();
  }

}
