
import { TranslateService } from '@ngx-translate/core';
import { OnDestroy, EventEmitter } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ThemeInjectorService } from '@theme/services/theme-injector.service';

/**
 * Clase base para los componentes que necesitan servicio de literales del tema
 *
 * @export
 * @class ThemeBaseComponentClass
 * @implements {OnDestroy}
 */
export class ThemeBaseComponentClass implements OnDestroy {

  // Objeto con los literales disponibles para el componente
  protected componentLiterals: any;
  // Evento que se dispara cuando cambia el objeto de literales
  protected onComponentLiteralsChange: EventEmitter<any> = new EventEmitter();
  private literalsKeys: string[];
  private translateService: TranslateService;
  protected alive = true;

  constructor() {

    this.translateService = ThemeInjectorService.injector.get(TranslateService);
  }

  protected useLiterals(literals: string[]) {
    this.componentLiterals = {};
    this.literalsKeys = literals;
    this.translateService.stream(this.literalsKeys)
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        (translate) => {
          this.componentLiterals = translate;
          this.onComponentLiteralsChange.emit(this.componentLiterals);
        }
      );
  }

  ngOnDestroy(): void {
    this.alive = false;
  }


}
