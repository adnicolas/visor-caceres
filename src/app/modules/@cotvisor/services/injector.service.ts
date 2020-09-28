/**
 * https://stackoverflow.com/questions/33970645/how-to-extend-a-component-with-dependency-injection-in-angular-2/33973222#33973222
 */
import { Injector } from '@angular/core';

export class InjectorService {
  static injector: Injector;
}
