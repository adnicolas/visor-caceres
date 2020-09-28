import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gss-map-panel',
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.scss']
})
export class MapPanelComponent implements OnInit {

  panelName = 'Mapa';
  constructor() { }

  ngOnInit() {
  }

}
