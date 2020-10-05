import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gss-search-panel',
  templateUrl: './search-panel.component.html',
  styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

  panelName = 'Buscador';

  constructor() { }

  ngOnInit() {
  }

}
