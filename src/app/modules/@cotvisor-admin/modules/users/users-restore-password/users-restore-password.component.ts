import { Component, OnInit, Input } from '@angular/core';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { ToastService } from '@theme/services/toast.service';
import { UsersService, GlobalAuthService } from '@cotvisor-admin/services';
import { takeUntil } from 'rxjs/operators';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ErrorHttp } from '@theme/classes/error-http.class';

@Component({
  selector: 'cot-users-restore-password',
  templateUrl: './users-restore-password.component.html',
  styleUrls: ['./users-restore-password.component.scss']
})

export class UsersRestorePasswordComponent extends ParentComponent implements OnInit {

  public password: string;
  public passwordVerification: string;
  public email: string;
  public emailPattern = Utilities.EMAIL_REGEXP;
  @Input() public authentication: { token: string, userId: number };

  public mailSended: boolean = false;
  public restorePasswordProcessActive: boolean = false;
  constructor(
    private usersService: UsersService,
    private toast: ToastService,
    private gAuthentication: GlobalAuthService,
    private router: Router
  ) {
    super();
  }
  public ngOnInit(): void {
    this.useLiterals(['USERS.ERROR_EMAIL_NOT_FOUND', 'USERS.SUCESSFUL_PASSWORD_CHANGE']);
    if (!this.authentication || !this.authentication.token || !this.authentication.userId) {
      this.authentication = null;
    }
  }
  public saveNewPassword() {
    this.restorePasswordProcessActive = true;
    // Asignamos el token temporal
    this.gAuthentication.setToken(this.authentication.token);
    this.usersService.updatePassword(
      this.authentication.userId, this.password).pipe(takeUntil(this.unSubscribe)).subscribe(() => {
        this.restorePasswordProcessActive = false;
        // Redireccionar al login
        const loginUrl = environment.pages.login;
        this.router.navigateByUrl(loginUrl);
        // Quitamos el token
        this.gAuthentication.setToken(null);
        this.toast.showSuccess({ summary: this.componentLiterals['USERS.SUCESSFUL_PASSWORD_CHANGE'], detail: '' });
      });
  }

  public requestNewPassword() {
    this.restorePasswordProcessActive = true;
    this.usersService.restorePassword(this.email).pipe(takeUntil(this.unSubscribe)).subscribe(
      () => {
        this.mailSended = true;
        this.restorePasswordProcessActive = false;
      },
      (error: ErrorHttp) => {
        this.restorePasswordProcessActive = false;
        if (error.httpStatus === 404) {
          this.toast.clear();
          this.toast.showError({ summary: `Error ${error.httpStatus}`, detail: this.componentLiterals['USERS.ERROR_EMAIL_NOT_FOUND'] });
        } else {
          this.toast.showError({ summary: `Error ${error.httpStatus}`, detail: error.message });
        }
      });
  }

  public cancel() {
    const loginUrl = environment.pages.login;
    this.router.navigateByUrl(loginUrl);
  }

}
