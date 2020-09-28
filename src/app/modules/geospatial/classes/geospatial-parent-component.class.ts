import { Subject } from 'rxjs';


/**
 * Clase padre de los componentes donde se inyectan los servicios
 * comunes y se inicializan las propiedades necesarias
 *
 * @export
 * @class ParentComponent
 * @extends {ParentClass}
 */
export class GeospatialParentComponent {

  public unSubscribe: Subject<boolean> = new Subject<boolean>();

  /**
   * 
   */
  constructor() { }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnDestroy() {
    this.unSubscribe.next(true);
    this.unSubscribe.unsubscribe();
  }


}
