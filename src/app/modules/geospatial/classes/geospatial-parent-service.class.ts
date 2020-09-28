import { HttpClient } from '@angular/common/http';

import { LoggerService } from '@theme/services/logger.service';
import { ThemeInjectorService } from '@theme/services/theme-injector.service';
import { ThemeServicesErrorManager } from '@theme/classes/theme-services-error-manager.class';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Clase padre de los servicios , injecta los servicios necesarios
 * y proporciona el control de errores
 *
 * @export
 * @class ParentService
 */
export class GeospatialParentService {

  public loading$: Observable<boolean>;

  protected httpClient: HttpClient;
  protected logger: LoggerService;
  protected servicesErrorManager: typeof ThemeServicesErrorManager;
  protected environment = environment;
  protected loadingSubject: BehaviorSubject<boolean>;

  constructor() {
    if (ThemeInjectorService.injector) {
      this.httpClient = ThemeInjectorService.injector.get(HttpClient);
      this.logger = ThemeInjectorService.injector.get(LoggerService);
    }
    this.loadingSubject = new BehaviorSubject(false);
    this.loading$ = this.loadingSubject.asObservable();
    this.servicesErrorManager = ThemeServicesErrorManager;
  }

  /**
   * Notifica el estado de carga del servicio
   *
   * @private
   * @param {boolean} loading
   *
   * @memberOf AoiService
   */
  protected notifyLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }
}
