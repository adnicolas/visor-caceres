import { Subject } from 'rxjs';
import { ConfigModuleService } from '@cotvisor/services/config-module.service';
import { InjectorService } from '@cotvisor/services/injector.service';
import { ParentClass } from './parent.class';
import { ErrorVisor } from '@cotvisor/classes/error-visor.class';
import { EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';

/**
 * Clase padre de los componentes donde se inyectan los servicios
 * comunes y se inicializan las propiedades necesarias,
 * como el servicio de carga de configuración o el de literales
 *
 * @export
 * @class ParentComponent
 * @extends {ParentClass}
 */
export class ParentComponent extends ParentClass {

  public moduleConfig: any = {};
  public unSubscribe: Subject<boolean> = new Subject<boolean>();
  protected configModuleService: ConfigModuleService;
  // Objeto con los literales disponibles para el componente
  protected componentLiterals: any;
  // Evento que se dispara cuando cambia el objeto de literales
  protected onComponentLiteralsChange: EventEmitter<any> = new EventEmitter();
  protected literalsKeys: string[];
  protected translateService: TranslateService;

  /**
   * Constructor de la clase. Inicializd:
   * moduleConfig: Objeto con la configuración del módulo
   * selector: cadena usada como selector en el decorador del módulo
   * @return {[type]} [description]
   */
  constructor() {
    // obtengo el objeto con la configuración
    super();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnDestroy() {
    this.unSubscribe.next(true);
    this.unSubscribe.unsubscribe();
  }

  /**
   * inyecto el servicio con el servicio de inyeccion,
   * no se inyecta por el constructor para evitar obligar a las subclases
   * a repetir la firma
   *
   *
   */
  protected getModuleConfigAsync(): Promise<any> {
    this.configModuleService = InjectorService.injector.get(ConfigModuleService);
    return new Promise((resolve, reject) => {
      this.configModuleService.getModuleConfig(this.constructor.name)
        .toPromise()
        .then(
          (moduleConfig) => {
            this.moduleConfig = moduleConfig;
            resolve(moduleConfig);
          }
        )
        .catch(
          error => {
            reject({});
            throw new ErrorVisor('getModuleConfigAsync', `No se ha podido obtener el archivo de configuracion de ${this.constructor.name}`, error.stack);

          }
        );

    });
  }

  protected useLiterals(literals: string[], interpolateParams?: {}) {
    this.translateService = InjectorService.injector.get(TranslateService);
    this.componentLiterals = {};
    this.literalsKeys = literals;
    this.translateService.stream(this.literalsKeys, interpolateParams)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (translate) => {
          this.componentLiterals = translate;
          this.onComponentLiteralsChange.emit(this.componentLiterals);
        }
      );
  }

}
