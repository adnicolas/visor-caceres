import { Injector, NgModule } from '@angular/core';
import { ComponentsModule } from './components/components.module';
import { DirectivesModule } from './directives/directives.module';
import { PipesModule } from './pipes/pipes.modules';
import { InjectorService } from './services/injector.service';

/**
 * Módulo que exporta las funcionalidades que forman el core del visor
 *
 * @export
 * @class CotVisorModule
 */
@NgModule({
  imports: [
    DirectivesModule,
    PipesModule,
    ComponentsModule
  ],
  providers: [
    // { provide: ErrorHandler, useClass: FrontendErrorManagerService },
  ],
  declarations: [
  ],
  exports: [
    DirectivesModule,
    PipesModule,
    ComponentsModule
  ],
})

export class CotVisorModule {
  constructor(public injector: Injector) {
    InjectorService.injector = this.injector;
  }
}
