import { Component, OnInit, Input } from '@angular/core';
import { UserGroupModel } from '@cotvisor-admin/models';
import { UserGroupsService } from '@cotvisor-admin/services/user-groups.service';
@Component({
  selector: 'gss-users-groups-detail',
  templateUrl: './users-groups-detail.component.html',
  styleUrls: ['./users-groups-detail.component.scss']
})
export class UsersGroupsDetailComponent /*extends ParentComponent*/ implements OnInit {

  @Input() groupID?: number;
  // public addMode: boolean = false;
  public group: UserGroupModel;
  // public groupError: boolean;
  // public groupErrorMessage: string = null;

  constructor(private userGroupsService: UserGroupsService) {
    // super();
  }

  /*ngOnInit(): void {
    if (this.groupId === 'new') {
      this.addMode = true;
      this.group = new UserGroupModel();
    } else {
      this.userGroupsService.get(this.groupId as number);
      this.userGroupsService.userGroup$
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(
          group => this.group = group,
          error => {
            this.groupError = true;
            this.groupErrorMessage = error.message;
          });
    }
  }*/

  ngOnInit() {
    // TODO @ADR: Revisar este flujo para garantizar que sólo la cadena new permite el acceso
    if (this.groupID) {
      this.userGroupsService.get(this.groupID).subscribe((userGroup) => {
        this.group = userGroup;
      });
    } else {
      this.group = new UserGroupModel();
    }
  }
}
