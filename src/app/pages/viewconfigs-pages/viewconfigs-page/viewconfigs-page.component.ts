import { Component, OnInit } from '@angular/core';
import { ViewConfigsService } from '@cotvisor-admin/services/view-configs.service';

@Component({
  selector: 'gss-viewconfigs-page',
  templateUrl: './viewconfigs-page.component.html',
  styleUrls: ['./viewconfigs-page.component.scss']
})
export class ViewConfigsPageComponent implements OnInit {

  constructor(
    public viewConfigsService: ViewConfigsService
  ) { }

  ngOnInit() {
  }

}
