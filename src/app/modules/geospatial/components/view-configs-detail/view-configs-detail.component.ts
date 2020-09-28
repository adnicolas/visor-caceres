import { Component, OnInit, Input } from '@angular/core';
import { ViewConfigModel } from '@cotvisor-admin/models/view-configs.model';
import { ViewConfigsService } from '@cotvisor-admin/services/view-configs.service';

@Component({
  selector: 'gss-view-configs-detail',
  templateUrl: './view-configs-detail.component.html',
  styleUrls: ['./view-configs-detail.component.scss']
})
export class ViewConfigsDetailComponent implements OnInit {
  @Input() viewID?: number;
  public viewConfig: ViewConfigModel;

  constructor(
    public viewConfigsService: ViewConfigsService
  ) { }

  ngOnInit() {
    // @ADR: Si hay viewID es una edición
    if (this.viewID) {
      this.viewConfigsService.get(this.viewID).subscribe((viewConfig) => {
        this.viewConfig = viewConfig;
      });
      // @ADR: Si no lo hay es un alta
    } else {
      this.viewConfig = new ViewConfigModel();
    }
  }

}
