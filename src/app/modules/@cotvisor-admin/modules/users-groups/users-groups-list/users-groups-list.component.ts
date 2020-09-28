import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserGroupModel } from '@cotvisor-admin/models/user-group.model';
import { UserGroupsService } from '@cotvisor-admin/services/user-groups.service';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';

@Component({
  selector: 'cot-users-groups-list',
  templateUrl: './users-groups-list.component.html',
  styleUrls: ['./users-groups-list.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class UsersGroupsListComponent extends ParentComponent implements OnInit {
  @Input() public groupId: number;
  // @Output() deleteGroup: EventEmitter<UserGroupModel> = new EventEmitter();
  @Output() selectedGroup: EventEmitter<UserGroupModel> = new EventEmitter();
  @Output() goToGroup: EventEmitter<number> = new EventEmitter();

  public groups: UserGroupModel[];
  public groupsCols = [
    { field: 'name', header: 'Grupo' },
    { field: 'description', header: 'Descripción', hideFilter: true }
  ];

  constructor(
    public userGroupsService: UserGroupsService,
    private confirmDialogService: ConfirmDialogService
  ) {
    super();
    this.useLiterals([
      'USER_GROUP.DELETE_GROUP_QUESTION',
      'USER_GROUP.DELETE_GROUP']);
  }

  public ngOnInit(): void {
    this.userGroupsService.userGroups$.pipe(takeUntil(this.unSubscribe)).subscribe((groups) => {
      this.groups = groups;
    });
    this.userGroupsService.getAll();
  }

  /*public gotoUsersGroups(viewConfig: ViewConfigModel) {
    this.router.navigate([environment.pages.visor], { queryParams: { visor: viewConfig.id } });
  }*/

  public emitGoToGroup(group: UserGroupModel) {
    this.goToGroup.emit(group.id);
  }

  public emitSelectedGroup(groupSelected: UserGroupModel) {
    this.selectedGroup.emit(groupSelected);
  }

  public deleteGroup($event: { row: UserGroupModel, deleteConfirm: () => void }) {
    // this.deleteGroup.emit(group);
    this.confirmDialogService.open({
      message: this.componentLiterals['USER_GROUP.DELETE_GROUP_QUESTION'],
      header: this.componentLiterals['USER_GROUP.DELETE_GROUP'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userGroupsService.delete($event.row.id)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(() => $event.deleteConfirm());
      },
      reject: () => { }
    });
  }


}
