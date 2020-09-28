import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gss-aoi-panel',
  templateUrl: './aoi-panel.component.html',
  styleUrls: ['./aoi-panel.component.scss']
})
export class AoiPanelComponent implements OnInit {
  panelName = 'Areas de Interés';

  constructor() { }

  ngOnInit() {
  }

}
