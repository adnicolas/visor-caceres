import { Component, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';

@Component({
  selector: 'gss-user-locations-panel',
  templateUrl: 'user-locations-panel.component.html',
  styleUrls: ['user-locations-panel.component.scss']
})
export class UserLocationsPanelComponent extends ParentComponent implements OnInit {
  public panelName = 'Ubicaciones Guardadas';
  public showAll: boolean = false; // opcion para mostrar todas las features

  constructor() {
    super();
  }

  public ngOnInit() {

  }

  public toggleShowAll() {
    this.showAll = !this.showAll;
  }

  /**
   * habilita la herramienta para añadir nuevas userLocations
   *
   * @memberof TocPanelComponent
   */
  public activateUserLocationTool(event) {

  }
}
