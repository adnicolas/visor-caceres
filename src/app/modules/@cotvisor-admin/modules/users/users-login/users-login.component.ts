import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserModel } from '@cotvisor-admin/models/user.model';
import { GlobalAuthService } from '@cotvisor-admin/services/global-auth.service';
import { ToastService } from '@theme/services/toast.service';
import { ErrorHttp } from '@theme/classes/error-http.class';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
/**
 *
 * @export
 * @class LoginComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'cot-users-login',
  templateUrl: './users-login.component.html',
  styleUrls: ['./users-login.component.scss'],
})
export class UsersLoginComponent extends ParentComponent implements OnDestroy, OnInit {
  public userEmail: string;
  public password: string;
  public userLogged: UserModel;
  protected signInProcessActive: boolean;
  private authSubscription: Subscription;

  constructor(
    private globalAuthService: GlobalAuthService,
    private toastService: ToastService,
    private router: Router) {
    super();
    this.userLogged = this.globalAuthService.getCurrentUser();
    this.authSubscription = this.globalAuthService.authState$.subscribe(
      (user) => (
        this.userLogged = user

      ),
    );
  }

  public ngOnInit() {
    this.useLiterals(['USERS.ERROR_PASS']);
  }
  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.authSubscription.unsubscribe();
  }

  /**
   * Login estandar por usuario y contraseña
   *
   * @memberof LoginComponent
   */
  public signIn(): void {

    this.signInProcessActive = true;
    this.globalAuthService.logIn(this.userEmail, this.password)
      .then(() => this.signInProcessActive = false)
      .catch(
        (error: ErrorHttp) => {
          this.signInProcessActive = false;
          if (error.httpStatus === 401) {
            this.toastService.clear();
            this.toastService.showError({ summary: `Error ${error.httpStatus}`, detail: this.componentLiterals['USERS.ERROR_PASS'] });
          } else {
            this.toastService.showError({ summary: `Error ${error.httpStatus}`, detail: error.message });
          }
        },
      );
  }



  public signOut(): void {
    this.userEmail = '';
    this.password = '';
    this.globalAuthService.logOut();
  }

  public goToRegister() {
    const registerUrl = environment.pages.register;
    this.router.navigateByUrl(registerUrl);
  }

  public goToRestorePassword() {
    const restorePasswordUrl = environment.pages.restorePassword;
    this.router.navigateByUrl(restorePasswordUrl);
  }
}
