import { Component, Output, EventEmitter } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserModel } from '@cotvisor-admin/models/user.model';
import { UsersService } from '@cotvisor-admin/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';

@Component({
  selector: 'cot-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class UsersListComponent extends ParentComponent {
  // @Output() deleteUser: EventEmitter<UserModel> = new EventEmitter();
  @Output() selectedUser: EventEmitter<UserModel> = new EventEmitter();
  @Output() goToUser: EventEmitter<UserModel> = new EventEmitter();

  public users: UserModel[];
  public usersCols = [
    { field: 'userName', header: 'Usuario' },
    { field: 'email', header: 'Email' },
    // { field: 'disabled', header: 'Des', format: 'switch', hideFilter: true }
  ];


  constructor(
    public usersService: UsersService,
    private confirmDialogService: ConfirmDialogService
  ) {
    super();
    this.useLiterals(['USER.DELETE_USER_QUESTION', 'USER.DELETE_USER']);
    this.usersService.users$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (users) => {
          this.users = users;
        }
      );
    this.usersService.getAll();
  }

  public emitGoToUser(user: UserModel) {
    // clonamos el usuario para no modificar el original si los cambios no se guardan
    // const userCloned = Utilities.objectClone(user) as UserModel;
    // this.goToUser.emit(userCloned);
    this.goToUser.emit(user);
  }

  public emitSelectedUser(user: UserModel) {
    this.selectedUser.emit(user);
  }

  public deleteUser($event: { row: UserModel, deleteConfirm: () => void }) {
    // this.deleteUser.emit(user);
    this.confirmDialogService.open({
      message: this.componentLiterals['USER.DELETE_USER_QUESTION'],
      header: this.componentLiterals['USER.DELETE_USER'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.usersService.delete($event.row.id)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(() => $event.deleteConfirm());
      },
      reject: () => { }
    });
  }


}
