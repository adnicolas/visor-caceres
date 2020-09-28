import { AbstractParentToolComponent } from './abstract-parent-tool.component';
/**
 * Clase abstrata para los botones que son seleccionables.
 *
 * Contiene los métodos abstractos activateTool y deactivateTool que deben
 * implementar el comportamiento para activar y desactivar la herramienta
 *
 * @export
 * @abstract
 * @class AbstractParentToolSelectableComponent
 * @extends {AbstractParentToolComponent}
 */
export abstract class AbstractParentToolSelectableComponent extends AbstractParentToolComponent {

  // indica si la tools está activa
  public isActive: boolean = false;
  /**
   * Activa o desactiva la herramienta
   * @return {[type]} [description]
   */
  public toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) { this.activateTool(); } else { this.deactivateTool(); }
  }

  /**
   * Desactiva la herramienta en el mapa
   *
   * @abstract
   * @memberof AbstractParentToolSelectableComponent
   */
  public abstract activateTool(): void;

  /**
   *
   * Activa la herramienta en el mapa
   * @abstract
   * @memberof AbstractParentToolSelectableComponent
   */
  public abstract deactivateTool(): void;

}
