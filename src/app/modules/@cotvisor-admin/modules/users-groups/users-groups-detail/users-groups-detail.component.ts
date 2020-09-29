import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { ToastService } from '@theme/services/toast.service';
import { UserGroupModel, UserModel } from '@cotvisor-admin/models';
import { RoleModel } from '@cotvisor-admin/models/role.model';
import { UserGroupsService } from '@cotvisor-admin/services/user-groups.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { GlobalAuthService, UsersService } from '@cotvisor-admin/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

const GROUPS_LIST_URL = '/grupos';

@Component({
  selector: 'cot-users-groups-detail',
  templateUrl: './users-groups-detail.component.html',
  styleUrls: ['./users-groups-detail.component.scss'],
})
export class UsersGroupsDetailComponent extends ParentComponent implements OnChanges, OnInit {

  @Input() public group: UserGroupModel;
  @Input() public addMode?: boolean = false;
  public groupForm: FormGroup;
  public isSameUser = false;
  public isPasswordChangeActive: boolean = false;
  public passwordVerification: string = '';
  public emailPattern = Utilities.EMAIL_REGEXP;
  public validGroupname = true;
  public validEmail = true;
  public userStateLabel: string;
  public userEnabled: boolean;
  public currentGroup: UserGroupModel;
  public userManager: boolean = false;
  public usersOptions: SelectItem[] = [];
  private users: UserModel[];

  // private originalGroupName: string;
  // private originalDescription: string;

  constructor(
    private userGroupsService: UserGroupsService,
    private usersService: UsersService,
    private toastService: ToastService,
    private confirmDialogService: ConfirmDialogService,
    private router: Router,
    private fb: FormBuilder,
    private globalAuthService: GlobalAuthService
  ) {
    super();
    this.useLiterals([
      'USER_GROUP.DELETE_GROUP_QUESTION',
      'USER_GROUP.DELETE_GROUP_SUCCESS',
      'USER_GROUP.DELETE_GROUP',
      'USER_GROUP.DISABLE',
      'USER_GROUP.ENABLE'
    ]);
  }

  ngOnInit() {
    if (!this.group.id) {
      this.addMode = true;
    }
    this.groupForm = this.toFormGroup(this.group);
    const selectedUsers: number[] = [];
    if (this.group.users && this.group.users.length > 0) {
      this.group.users.forEach(user => {
        selectedUsers.push(user.id);
      });
    }
    this.groupForm.get('users').setValue(selectedUsers);
    this.usersService.getAll();
    this.usersService.users$.pipe(takeUntil(this.unSubscribe)).subscribe((users) => {
      this.users = users;
      users.forEach(user => {
        this.usersOptions.push({
          label: user.userName,
          value: user.id,
        });
      });
    });
  }

  private toFormGroup(group: UserGroupModel) {
    // https://stackoverflow.com/questions/38138098/how-to-use-primeng-dropdown-in-angular2-model-driven-form
    return this.fb.group({
      users: [''],
      name: group.name,
      description: group.description
    });
  }

  /**
   * Al iniciar el componente establemos las opciones del modo adición de usuario
   *
   * @memberof UsersDetailComponent
   */
  public ngOnChanges(): void {
    if (!this.group) return;
    if (this.addMode) { this.isPasswordChangeActive = true; }
    // this.originalGroupName = this.group.name;
    // this.originalDescription = this.group.description;
  }

  public save() {
    this.addMode ? this.createGroup() : this.updateGroup();
  }


  /**
   * Llamada a servicio de guardar usuario
   *
   * @memberof UsersGroupsDetailComponent
   */
  private updateGroup() {
    const updatedUsers = this.users.filter(user => this.groupForm.controls.users.value.includes(user.id));

    this.userGroupsService.update({
      id: this.group.id,
      userOwner: this.group.userOwner,
      name: this.groupForm.controls.name.value,
      description: this.groupForm.controls.description.value,
      roles: this.group.roles,
      users: updatedUsers
    })
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (group) => {
          this.toastService.showSuccess({ detail: 'Grupo guardado correctamente', summary: 'Guardado' });
          this.groupForm.markAsPristine();
          this.router.navigateByUrl(GROUPS_LIST_URL);
        },

      );
  }

  /**
   * Crea el usuario con el metodo POST
   *
   * @memberof UsersGroupsDetailComponent
   */
  private createGroup() {

    const updatedUsers = this.users.filter(user => this.groupForm.controls.users.value.includes(user.id));
    const currentuser = this.globalAuthService.getCurrentUser();

    this.userGroupsService.create({
      userOwner: currentuser.id,
      name: this.groupForm.controls.name.value,
      description: this.groupForm.controls.description.value,
      roles: [],
      users: updatedUsers
    })
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (group) => {
          this.toastService.showSuccess({ detail: 'Grupo creado correctamente', summary: 'Creado' });
          this.groupForm.markAsPristine();
          this.router.navigateByUrl(GROUPS_LIST_URL);
        },

      );
  }

  /**
   * Llamada a servicio de eliminar usuario tras pedir confirmación al usuario
   *
   * @memberof UsersGroupsDetailComponent
   */
  public deleteGroup() {
    this.confirmDialogService.open({
      message: this.componentLiterals['USER_GROUP.DELETE_GROUP_QUESTION'],
      header: this.componentLiterals['USER_GROUP.DELETE_GROUP'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // eliminar capa
        this.userGroupsService.delete(this.group.id)
          .subscribe(
            _success => {
              this.toastService.showSuccess({ summary: this.componentLiterals['USER_GROUP.DELETE_GROUP_SUCCESS'], detail: '' });
              this.router.navigateByUrl(GROUPS_LIST_URL);
            });
      },
      reject: () => { }
    });
  }

  /**
   *
   *
   * @memberof UsersGroupsDetailComponent
   */
  public cancel() {
    alert('volvar atras');
  }

  /**
   * Función de comparación de roles
   *
   * @public
   * @param {RoleModel} a
   * @param {RoleModel} b
   * @returns
   * @memberof UsersGroupsDetailComponent
   */
  public compareRoleFn(a: RoleModel, b: RoleModel) {
    if (a.id === b.id) {
      return true;
    }
    return false;
  }
}
