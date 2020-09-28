import { Component, OnInit } from '@angular/core';
import { UserGroupModel } from '@cotvisor-admin/models/user-group.model';
import { UserGroupsService } from '@cotvisor-admin/services';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cot-users-groups-loader-list',
  templateUrl: './users-groups-loader-list.component.html',
  styleUrls: ['./users-groups-loader-list.component.scss']
})
export class UsersGroupsLoaderListComponent extends ParentComponent implements OnInit {
  public usersGroups: UserGroupModel[] = [];
  public groupsCols = [
    { field: 'name', header: 'Grupo' },
    { field: 'description', header: 'Descripción', hideFilter: true }
  ];

  constructor(
    public userGroupsService: UserGroupsService

  ) {
    super();
  }

  ngOnInit() {
    this.userGroupsService.userGroups$.pipe(takeUntil(this.unSubscribe)).subscribe((usersGroups) => {
      this.usersGroups = usersGroups;
    });
    this.userGroupsService.getAll();
  }

  /*public gotoUserGroup(userGroup: UserGroupModel) {
    this.router.navigate([environment.pages.visor], { queryParams: { visor: viewConfig.id } }).then((_) => {
      // Si dynamicDialogRef no es nulo está cargado en una modal por lo que la cerramos
      if (this.dynamicDialogRef) this.dynamicDialogRef.close();
    });
  }*/
}
