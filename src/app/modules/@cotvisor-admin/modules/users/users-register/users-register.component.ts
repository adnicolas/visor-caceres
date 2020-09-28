import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { ErrorHttp } from '@theme/classes/error-http.class';
import { ToastService } from '@theme/services/toast.service';
import { environment } from 'src/environments/environment';
import { UserModel } from '@cotvisor-admin/models';
import { GlobalAuthService, UsersService } from '@cotvisor-admin/services';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { RoleModel } from '@cotvisor-admin/models/role.model';

@Component({
  selector: 'cot-users-register',
  templateUrl: './users-register.component.html',
  styleUrls: ['./users-register.component.scss']
})
export class UsersRegisterComponent extends ParentComponent implements OnInit {

  public user: UserModel;
  public validUsername = true;
  public validEmail = true;
  public emailPattern = Utilities.EMAIL_REGEXP;
  public passwordVerification: string;

  public signUpProcessActive = false;
  public roleType: RoleModel;
  public roles: RoleModel[];
  constructor(
    private usersService: UsersService,
    private globalAuthService: GlobalAuthService,
    private toast: ToastService,
    private router: Router

  ) {
    super();
    this.user = new UserModel();
    // this.roleType = '';
    /*this.rolesService.getAll();
    this.rolesService.roles$.pipe(takeUntil(this.unSubscribe)).subscribe((roles) => {
      this.roles = roles;
    });*/
  }

  ngOnInit() {
    this.useLiterals(['USERS.ERROR_PASS', 'USERS.SUCESSFUL_REGISTER']);
  }

  public checkUserName(event: Event) {
    this.user.userName = this.user.userName.trim();
    if (this.user.userName.length > 0) {
      this.usersService.checkUserName(this.user.userName).pipe(takeUntil(this.unSubscribe)).subscribe(
        (result) => this.validUsername = result.valid,
        (error) => this.toast.showError({ detail: `Error ${error.status} al ${error.operation} `, summary: 'Comprobar nombre de usuario' }),
      );
    } else {
      this.validUsername = true;
    }
  }

  public checkEmail(event: Event) {
    this.user.email = this.user.email.trim();
    if (this.user.email.length > 0) {
      this.usersService.checkEmail(this.user.email).pipe(takeUntil(this.unSubscribe)).subscribe(
        (result) => this.validEmail = result.valid,
        (error) => this.toast.showError({ detail: `Error ${error.status} al ${error.operation} `, summary: 'Comprobar email de usuario' }),
      );
    } else {
      this.validEmail = true;
    }
  }

  public createUser(): void {
    this.signUpProcessActive = true;
    this.usersService.create(this.user).toPromise().then((user: UserModel) => {
      this.signUpProcessActive = false;
      this.globalAuthService.logIn(this.user.email, this.user.password)
        .then(() => {
          const visorUrl = environment.pages.visor;
          this.router.navigateByUrl(visorUrl);
          this.toast.showSuccess({ summary: this.componentLiterals['USERS.SUCESSFUL_REGISTER'], detail: '' });
        })
        .catch(
          (error) => {
            if (error instanceof ErrorHttp) {
              if (error.httpStatus === 401) {
                this.toast.clear();
                this.toast.showError({ summary: `Error ${error.httpStatus}`, detail: this.componentLiterals['USERS.ERROR_PASS'] });
              } else {
                this.toast.showError({ summary: `Error ${error.httpStatus}`, detail: error.message });
              }
            }
          },
        );

    }).catch((error) => {
      this.signUpProcessActive = false;
      this.toast.showError({ summary: `Error ${error.httpStatus}`, detail: error.message });
    });

  }

  public cancel() {
    const loginUrl = environment.pages.login;
    this.router.navigateByUrl(loginUrl);
  }

}
