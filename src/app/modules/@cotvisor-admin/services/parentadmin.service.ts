import { HttpClient } from '@angular/common/http';
import { ParentClass } from '@cotvisor/classes/parent/parent.class';
import { InjectorService } from '@cotvisor/services/injector.service';
import { environment } from 'src/environments/environment';
import { ThemeServicesErrorManager } from '@theme/classes/theme-services-error-manager.class';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

/**
 * Clase padre de los servicios de administracion, injecta los servicios necesarios
 * y proporciona el control de errores
 *
 * @export
 * @class ParentAdminService
 */
export class ParentAdminService extends ParentClass {
  public httpClient: HttpClient;
  // TODO sustituir alertcontroles
  // public alertController: AlertController;
  protected BACKENDURL: string;
  public servicesErrorManager = ThemeServicesErrorManager;
  public loading$: Observable<boolean>;
  protected loadingSubject: BehaviorSubject<boolean>;

  constructor(
  ) {
    super();
    if (InjectorService.injector) {
      this.httpClient = InjectorService.injector.get(HttpClient);
      // this.alertController = InjectorService.injector.get(AlertController);
    }
    this.BACKENDURL = environment.apis.geospatialAPI.baseUrl;
    this.loadingSubject = new BehaviorSubject(false);
    this.loading$ = this.loadingSubject.asObservable();

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
