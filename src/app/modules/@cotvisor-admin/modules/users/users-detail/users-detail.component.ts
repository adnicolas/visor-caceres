import { Component, Input, ViewChild, OnChanges } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Permissions } from '@cotvisor-admin/classes/permissions.enum';
import { ToastService } from '@theme/services/toast.service';
import { UserModel } from '@cotvisor-admin/models/user.model';
import { RoleModel } from '@cotvisor-admin/models/role.model';
import { UsersService } from '@cotvisor-admin/services/users.service';
import { GlobalAuthService } from '@cotvisor-admin/services/global-auth.service';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { Router } from '@angular/router';
import { UserGroupModel } from '@cotvisor-admin/models';


const USERS_LIST_URL = 'usuarios';

@Component({
  selector: 'cot-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss'],
})
export class UsersDetailComponent extends ParentComponent implements OnChanges {

  @Input() public user: UserModel;
  // en modo add no se mueestra el botón eliminar usuario, ni el boton para mostrar y ocultar el cambio de contraseña
  @Input() public addMode?: boolean = false;
  @ViewChild('userForm') public userForm: NgForm;
  public isSameUser = false;
  // public availableRoles: RoleModel[];
  public isPasswordChangeActive: boolean = false;
  public passwordVerification: string = '';
  public emailPattern = Utilities.EMAIL_REGEXP;
  public validUsername = true;
  public validEmail = true;
  public userStateLabel: string;

  public userEnabled: boolean;
  public currentUser: UserModel;

  public userManager: boolean = false;

  private originalUserName: string;
  private originalEmail: string;

  constructor(
    private usersService: UsersService,
    private toastService: ToastService,
    private globalAuthService: GlobalAuthService,
    private confirmDialogService: ConfirmDialogService,
    private router: Router

  ) {
    super();

    this.globalAuthService.authState$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (user) => {
          this.currentUser = user;

          this.userManager = this.globalAuthService.loggedUserHasPermission(Permissions.USERMANAGER);

          if (this.userManager) {
            /*this.rolesService.getAll();
            this.rolesService.roles$.pipe(takeUntil(this.unSubscribe)).subscribe((roles) => {
              this.availableRoles = roles;
            });*/
            /*this.rolesService.getAll()
              .toPromise()
              .then(
                (roles) => this.availableRoles = roles,
              );*/
          }
        },
      );
    this.useLiterals([
      'USER.DELETE_USER_QUESTION',
      'USER.DELETE_USER_SUCCESS',
      'USER.DELETE_USER',
      'USER.DISABLE',
      'USER.ENABLE'
    ]);

  }

  /**
   * Al iniciar el componente establemos las opciones del modo adición de usuario
   *
   * @memberof UsersDetailComponent
   */
  public ngOnChanges(): void {
    // en modo nuevo usuario no se ocultan las contraseñas
    if (!this.user) return;
    if (this.addMode) { this.isPasswordChangeActive = true; }
    this.userEnabled = !this.user.disabled;
    this.originalUserName = this.user.userName;
    this.originalEmail = this.user.email;
    if (this.user.id === this.currentUser.id) {
      this.isSameUser = true;
    }
    this.updateStateLabel();
  }

  /**
   * Cambia el rol del modelo de usuario
   *
   * @param {*} ev
   * @memberof UsersDetailComponent
   */
  /*public rolChange(ev) {
    this.user.roles = this.availableRoles;  // [ev];
  }*/

  public togglePasswordChange() {
    this.isPasswordChangeActive = !this.isPasswordChangeActive;
    if (!this.isPasswordChangeActive) {
      this.user.password = null;
      this.passwordVerification = null;
    }
  }

  public save() {
    this.addMode ? this.createUser() : this.updateUser();
  }

  public changeUserState() {
    this.user.disabled = !this.userEnabled;
  }

  /**
   * Llamada a servicio de guardar usuario
   *
   * @memberof UsersDetailComponent
   */
  private updateUser() {

    this.usersService.update(this.user)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (user) => {
          this.toastService.showSuccess({ detail: 'Usuario guardado correctamente', summary: 'Guardado' });
          this.userForm.form.markAsPristine();
        },

      );
  }

  /**
   * Crea el usuario con el metodo POST
   *
   * @memberof UsersDetailComponent
   */
  private createUser() {

    this.usersService.create(this.user)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (user) => {
          this.toastService.showSuccess({ detail: 'Usuario creado correctamente', summary: 'Guardado' });
          this.user = user;
          this.userForm.form.markAsPristine();
          this.router.navigateByUrl(USERS_LIST_URL);
          // alert('volver atras');
        }
      );
  }

  /**
   * Llamada a servicio de eliminar usuario tras pedir confirmación al usuario
   *
   * @memberof UsersDetailComponent
   */
  public deleteUser() {
    this.confirmDialogService.open({
      message: this.componentLiterals['USER.DELETE_USER_QUESTION'],
      header: this.componentLiterals['USER.DELETE_USER'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // eliminar capa
        this.usersService.delete(this.user.id)
          .subscribe(
            _success => {
              this.toastService.showSuccess({ summary: this.componentLiterals['USER.DELETE_USER_SUCCESS'], detail: '' });
              this.router.navigateByUrl(USERS_LIST_URL);
            });
      },
      reject: () => { }
    });



  }

  /**
   * Llamada a servicio de darse de baja al usuario tras pedir confirmación al usuario
   *
   * @memberof UsersDetailComponent
   */
  public unregisterUser() {

    alert('baja de usaurio');

    // const alert = this.alertController.create({
    //     title: 'Darse de baja',
    //     message: '¿Está seguro de que desee darse de baja?',
    //     buttons: [
    //         {
    //             text: this.getLiteral('delete_no'),
    //             role: 'cancel',
    //             cssClass: '',
    //             handler: () => {
    //                 this.toastService.presentAutocloseToast('Cancelado');
    //             },
    //         },
    //         {
    //             text: this.getLiteral('delete_yes'),
    //             cssClass: '',
    //             handler: () => {
    //                 this.user.disabled = true; // disable user
    //                 this.usersService.update(this.user) // save userState
    //                     .pipe(takeUntil(this.unSubscribe))
    //                     .subscribe(
    //                         () => {
    //                             this.toastService.presentAutocloseToast('Usuario dado de baja');
    //                             this.navController.setRoot('visor', { config: `default` });
    //                         },
    //                         (error) => this.toastService.presentAutocloseToast(
    //                             `Error ${error.status} al ${error.operation} `),
    //                     );
    //                 this.globalAuthService.logOut(); // log out
    //             },
    //         },
    //     ],
    // });
    // alert.present();

  }

  /**
   *
   *
   * @memberof UsersDetailComponent
   */
  public checkUserName(event: Event) {
    this.user.userName = this.user.userName.trim();
    if (this.user.userName.length > 0 && this.user.userName !== this.originalUserName) {
      this.usersService.checkUserName(this.user.userName)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(
          (result) => this.validUsername = result.valid,
          (error) => this.toastService.showError({ summary: `${error.status}`, detail: `Error ${error.status} al ${error.operation} ` })
        );
    }
  }

  /**
   *
   *
   * @memberof UsersDetailComponent
   */
  public checkEmail(event: Event) {
    this.user.email = this.user.email.trim();
    if (this.user.email.length > 0 && this.user.email !== this.originalEmail) {
      this.usersService.checkEmail(this.user.email)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(
          (result) => this.validEmail = result.valid,
          (error) => this.toastService.showError({ summary: `${error.status}`, detail: `Error ${error.status} al ${error.operation} ` })
        );
    }
  }

  /**
   *
   *
   * @memberof UsersDetailComponent
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
   * @memberof UsersDetailComponent
   */
  public compareRoleFn(a: RoleModel, b: RoleModel) {
    if (a.id === b.id) {
      return true;
    }
    return false;
  }

  markFormAsDirty() {
    this.userForm.form.markAsDirty();
  }

  onRolesChanged(roles: RoleModel[]) {
    this.markFormAsDirty();
    this.user.roles = roles;
  }

  onGroupsChanged(groups: UserGroupModel[]) {
    this.markFormAsDirty();
    this.user.groups = groups;
  }

  updateStateLabel() {
    if (this.user.disabled) this.userStateLabel = this.componentLiterals['USER.DISABLE'];
    else this.userStateLabel = this.componentLiterals['USER.ENABLE'];
  }

}
