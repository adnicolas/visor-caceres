import { Component, OnInit, Input, Renderer2, ElementRef, ViewChild } from '@angular/core';
import * as ol from 'openlayers';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';

/**
 * Componente que hace zoom a una ventana dibujada por el usuario
 *
 * @export
 * @class ToolWindowZoomComponent
 * @extends {AbstractParentToolSelectableComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'cot-tool-window-zoom',
  templateUrl: './tool-window-zoom.component.html',
  styleUrls: ['./tool-window-zoom.component.scss']
})

export class ToolWindowZoomComponent extends AbstractParentToolSelectableComponent implements OnInit {

  @ViewChild('mouseOverlay') public mouseOverlay: ElementRef;
  @Input() tooltip: string;
  public CROSS_HAIR_CURSOR = 'pointer-crosshair';
  private _mapElement: Element; // elemento contenedor del mapa
  private _tempCSSClasses: string;
  public helpTooltip: ol.Overlay;


  constructor(private renderer: Renderer2) {
    super();

  }


  public ngOnInit() {
    // Añado la interacción
    super.ngOnInit();
    this.map.getInteractions().extend([
      new ol.interaction.DragZoom({
        condition: (e) => {
          if (this.isActive) {
            return ol.events.condition.mouseOnly(e) || ol.events.condition.shiftKeyOnly(e);
          } else {
            return ol.events.condition.shiftKeyOnly(e);
          }
        },
        className: 'dragzoom',
        duration: this.zoomDuration,
      }),
    ]);

  }


  public afterChangeActiveMap() {
    // Creo el overlay que se va moviendo junto al ratón
    this.helpTooltip = new ol.Overlay({
      element: this.mouseOverlay.nativeElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
    });
    this.map.addOverlay(this.helpTooltip);
  }

  public beforeChangeActiveMap() {
  }

  /**
   * Asigna al overlay de ayuda la posición del cursor sobre el mapa.
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private showHelpMessage = (evt: ol.MapBrowserEvent) => {
    this.helpTooltip.setPosition(evt.coordinate);
  }

  public activateTool() {
    // Activamos la herramienta en el mapa
    this.mapService.getActiveMap().activateTool(this);

    // muestro overlay ayuda
    this.map.on('pointermove', this.showHelpMessage);

    // Cambio el cursor a crosshair
    this._mapElement = this.mapService.getActiveMap().getTargetElement();
    this._tempCSSClasses = this._mapElement.getAttribute('class');
    this.renderer.setAttribute(this._mapElement, 'class', this._tempCSSClasses + ' ' + this.CROSS_HAIR_CURSOR);
    // (this.map.getTargetElement() as HTMLElement).style.cursor = 'crosshair';
    this.isActive = true;
  }

  public deactivateTool() {
    // Desactivamos la herramienta en el mapa
    this.mapService.getActiveMap().deactivateTool();
    // Restauramos las clases inciales
    this.renderer.setAttribute(this._mapElement, 'class', this._tempCSSClasses);

    this.isActive = false;
  }

}
