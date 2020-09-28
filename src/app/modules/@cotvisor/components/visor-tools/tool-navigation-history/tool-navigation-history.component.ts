import { Component, OnInit, Input } from '@angular/core';
import { AbstractParentToolComponent } from '@cotvisor/classes/parent/abstract-parent-tool.component';

@Component({
  selector: 'cot-tool-navigation-history',
  templateUrl: './tool-navigation-history.component.html',
})
export class ToolNavigationHistoryComponent extends AbstractParentToolComponent implements OnInit {
  @Input() tooltipNext: string;
  @Input() tooltipPrev: string;

  public viewHistory: any[] = [];
  public index: number = -1;
  public maxSize: number = 50;
  public shouldSave: boolean = true;
  public zoomDuration: number = 500;
  public ignoreMove: boolean = false;

  constructor() {
    super();

  }

  public ngOnInit() {
    super.ngOnInit();
    // Guardo la posición inicial.
    this.saveView();
    // Compruebo cada vez que se actualiza el tamaño del mapa que lanza posteriormente el evento de moveend, y lo recojo para no tenerlo en cuenta
    this.mapService.updateMapSize$.subscribe((map) => {
      if (this.map === map) {
        this.ignoreMove = true;
      }
    });
    // Cada vez que se produce un movimiento en el mapa, guardo la vista, a no ser que se deba ignorar el movimiento por una actualización del tamaño del mapa
    this.map.on('moveend', (event) => {
      if (!this.ignoreMove) {
        this.saveView();
      }
      this.ignoreMove = false;
    });
  }

  public afterChangeActiveMap() { }
  public beforeChangeActiveMap() { }

  public nextView() {
    if (this.index < this.viewHistory.length - 1) {
      this.index += 1;
      // Desactivo el guardado de la vista antes de cargar la siguiente
      this.shouldSave = false;
      // Cargo la vista siguiente
      this.map.getView().animate(this.viewHistory[this.index]);
    }
  }

  public previousView() {
    if (this.index > 0) {
      this.index -= 1;
      // Desactivo el guardado de la vista antes de cargar la anterior
      this.shouldSave = false;
      // Cargo la vista anterior

      this.map.getView().animate(this.viewHistory[this.index]);
    }
  }

  public saveView() {
    // Si vengo de un movimiento del mapa hecho por el usuario
    if (this.shouldSave) {
      const view = this.map.getView();
      // Cargo los datos de la vista actual
      const viewStatus = {
        center: view.getCenter(),
        resolution: view.getResolution(),
        rotation: view.getRotation(),
        duration: this.zoomDuration,
      };
      this.viewHistory.splice(this.index + 1, this.viewHistory.length - this.index - 1);
      // Compruebo si se ha llegado al final y elimino el primer index de ser así
      if (this.viewHistory.length === this.maxSize) {
        this.viewHistory.splice(0, 1);
      } else {
        this.index += 1;
      }
      // Añado la vista actual al array de históricos
      this.viewHistory.push(viewStatus);
    } else { // Si el evento proviene de pasar a vista siguiente o anterior
      // Reactivo el guardado de la vista para la siguiente interacción del usuario
      this.shouldSave = true;
    }
  }
}
