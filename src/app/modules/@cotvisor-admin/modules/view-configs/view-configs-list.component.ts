import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { ViewConfigModel, ToolsGroupModel } from '@cotvisor-admin/models';
import { ViewConfigsService } from '@cotvisor-admin/services/view-configs.service';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserMapModel } from '@cotvisor-admin/models';

@Component({
  selector: 'cot-view-configs-list',
  templateUrl: './view-configs-list.component.html',
  styleUrls: ['./view-configs-list.component.scss']
})
export class ViewConfigsListComponent extends ParentComponent implements OnInit {
  @Input() public userId: number;
  @Output() selectedView: EventEmitter<ViewConfigModel> = new EventEmitter();
  @Output() goWithUserMaps: EventEmitter<UserMapModel[]> = new EventEmitter();
  @Output() goToView: EventEmitter<number> = new EventEmitter();
  public viewConfigs: ViewConfigModel[] = [];
  public userMaps: UserMapModel[] = [];
  public toolsGroups: ToolsGroupModel[] = [];
  public viewConfigsCols = [
    { field: 'name', header: 'Nombre', format: 'text' },
    { field: 'description', header: 'Descripción', format: 'text' },
  ];

  constructor(
    public viewConfigsService: ViewConfigsService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    // private userMapsService: UserMapsService,
    // private toolsGroupsService: ToolsGroupsService
  ) {
    super();
    this.useLiterals(['VIEWMANAGER.DELETE_VIEW', 'VIEWMANAGER.DELETE_VIEW_QUESTION']);
  }

  public ngOnInit(): void {
    this.viewConfigsService.views$.pipe(takeUntil(this.unSubscribe)).subscribe((viewConfigs) => {
      this.viewConfigs = viewConfigs;
    });
    // @ADR: Por lo deducido de IDEEX esto sólo se ejecutará para usuarios con permisos de administrador y no existiría endpoint para búsqueda getForUser.
    // No obstante confirmar esto con David
    // this.viewConfigsService.getForUser(this.userId);
    this.viewConfigsService.getAll();
  }

  public gotoViewConfig(viewConfig: ViewConfigModel) {
    this.router.navigate([environment.pages.visor], { queryParams: { visor: viewConfig.id } });
  }

  public emitGoToViewConfig(viewConfig: ViewConfigModel) {
    this.goToView.emit(viewConfig.id);
  }

  public deleteViewConfig($event: { row: ViewConfigModel; deleteConfirm: () => void }) {
    this.confirmDialogService.open({
      message: this.componentLiterals['VIEWMANAGER.DELETE_VIEW_QUESTION'],
      header: this.componentLiterals['VIEWMANAGER.DELETE_VIEW'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.viewConfigsService
          .delete($event.row.id)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(() => $event.deleteConfirm());
      },
      reject: () => { },
    });
  }

  public emitSelectedViewConfig(viewConfigSelected: ViewConfigModel) {
    this.selectedView.emit(viewConfigSelected);
    // this.userMapsEmitter.emit(this.userMaps);
  }

}
