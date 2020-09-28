import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ErrorTheme } from '@theme/classes/error-theme.class';
import { CdkDrag } from '@angular/cdk/drag-drop';
/**
 * Componente que muestra el contenido proyectado en una ventana attastrable y minimizable
 *
 * @param {displayPosition} displayPosition - Establece la posición inicial de la ventana (top-left,top-righet,bottom-left,bottom-right)
 * @param {xOffset} xOffset - Establece el desplazamiento horizontal de la ventana desde los límites (izquierda o derecha)
 * @param {yOffset} yOffset - Establece el desplazamiento vertical de la ventana desde los límites (superior o inferior)
 * @param {name} name - Nombre a mostrar en la ventana
 * @param {hidden} hidden - Oculta la ventana
 *
 * @export
 * @class WindowComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-window',
  templateUrl: './window.component.html',
  styleUrls: ['./window.component.scss']
})
export class WindowComponent implements OnInit, OnDestroy {

  @Input() xOffset: number = 0;
  @Input() yOffset: number = 0;
  @Input() displayPosition: string = 'top-left';
  @Input() windowContainer: HTMLElement;
  @Input() name: string = '';
  @Input() hidden: boolean = false;
  @Input() canBeClosed: boolean = false;
  @Input() canBeReset: boolean = true;

  @Output() closed = new EventEmitter<boolean>();

  @ViewChild(CdkDrag) container: CdkDrag;

  public minimized: boolean = false;
  public inlineStyle: any;

  constructor(public el: ElementRef) { }


  public ngOnInit() {
    if (!this.windowContainer) {
      this.windowContainer = document.body;
    }
    this.windowContainer.appendChild(this.container.element.nativeElement);

    switch (this.displayPosition) {
      case 'top-left':
        this.inlineStyle = {
          top: `${this.yOffset}px`,
          left: `${this.xOffset}px`
        };
        break;
      case 'top-right':
        this.inlineStyle = {
          top: `${this.yOffset}px`,
          right: `${this.xOffset}px`
        };
        break;
      case 'bottom-right':
        this.inlineStyle = {
          bottom: `${this.yOffset}px`,
          right: `${this.xOffset}px`
        };
        break;
      case 'bottom-left':
        this.inlineStyle = {
          bottom: `${this.yOffset}px`,
          left: `${this.xOffset}px`
        };
        break;
      default:
        throw new ErrorTheme('WindowComponent', `Display Position no válida ${this.displayPosition}`);
    }

  }

  public ngOnDestroy() {
    // Devuelvo el contenedor al componente para que se elimine
    this.el.nativeElement.appendChild(this.container.element.nativeElement);
  }

  toggleWindow() {
    this.minimized = !this.minimized;
  }

  resetPosition() {
    this.container.reset();
  }

  hideWindow() {
    this.hidden = true;
    this.closed.emit(true);
  }




}
