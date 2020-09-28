import { Component, OnInit } from '@angular/core';
import { ViewConfigModel } from '@cotvisor-admin/models/view-configs.model';
import { ViewConfigsService } from '@cotvisor-admin/services';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/api';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'cot-view-configs-loader-list',
  templateUrl: './view-configs-loader-list.component.html',
  styleUrls: ['./view-configs-loader-list.component.scss']
})
export class ViewConfigsLoaderListComponent extends ParentComponent implements OnInit {
  // @Input() public userId: number;
  public viewConfigs: ViewConfigModel[] = [];
  public mapsCols = [
    { field: 'name', header: 'Nombre', format: 'text' },
    { field: 'description', header: 'Descripción', format: 'text' },
  ];

  constructor(
    public viewConfigsService: ViewConfigsService,
    private router: Router,
    private dynamicDialogRef: DynamicDialogRef
  ) {
    super();
  }

  ngOnInit() {
    this.viewConfigsService.views$.pipe(takeUntil(this.unSubscribe)).subscribe((viewConfigs) => {
      this.viewConfigs = viewConfigs;
    });
    // this.viewConfigsService.getForUser(this.userId);
    this.viewConfigsService.getAll();
  }

  public gotoViewConfig(viewConfig: ViewConfigModel) {
    this.router.navigate([environment.pages.visor], { queryParams: { visor: viewConfig.id } }).then((_) => {
      // Si dynamicDialogRef no es nulo está cargado en una modal por lo que la cerramos
      if (this.dynamicDialogRef) this.dynamicDialogRef.close();
    });
  }

}
