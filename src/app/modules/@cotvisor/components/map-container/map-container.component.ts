import { Component, Input, HostBinding, ElementRef, ViewChild } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsMapService } from '@cotvisor/services/vs-map.service';

@Component({
  selector: 'cot-map-container',
  styleUrls: ['map-container.component.scss'],
  templateUrl: './map-container.component.html',
})
export class MapContainerComponent extends ParentComponent {

  @HostBinding('class') public class = 'map-container';

  @Input() public map: VsMap;
  @Input() public target: string;
  @Input() public activateControl: boolean = false;

  @ViewChild('mapContainer') private mapContainer: ElementRef;

  public activeMapToggle: boolean;

  constructor(private vsMapService: VsMapService) {
    super();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  public ngOnInit() {
    // set map target
    // Establece el id al elemento de la clase ol-map-div
    // const htmlTargetElement: HTMLElement = this.elementRef.nativeElement;
    // const mapDivTarget = htmlTargetElement.getElementsByClassName('ol-map-div')[0];
    this.vsMapService.activeMapChanged$.subscribe((activeVsMap) => {
      this.updateMapControl(activeVsMap);
    });
    this.map.setTarget(this.mapContainer.nativeElement);
  }

  /**
   * Establece el mapa como activo, si estaba activo y se marca para desactivar se vuelve a poner
   * el toggle como activo pues no se puede desactivar mas que activando otro
   */
  public activateMap(): void {
    if (this.activeMapToggle) {
      this.vsMapService.setActiveMap(this.map);
    }
  }

  public onResize($event) {
    this.map.updateSize();
  }

  /**
   * callback del evento de cambio de mapa activo
   * @param  {[type]} activeMap [description]
   * @return {[type]}           [description]
   */
  private updateMapControl(activeMap: VsMap) {
    this.activeMapToggle = (this.map === activeMap);
  }

}
