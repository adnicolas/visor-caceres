import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { takeWhile } from 'rxjs/internal/operators/takeWhile';
import { environment } from 'src/environments/environment';
import { GlobalAuthService } from '@cotvisor-admin/services';

/**
 * Página de login que podrá recibir dos parámetros por get:
 *
 * return: Página a la que volver tras el login correcto
 * do: Accion a realizar por la página.
 * - Valores: logout
 *
 *
 * @export
 * @class LoginPageComponent
 * @implements {OnDestroy}
 */
@Component({
  selector: 'gss-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnDestroy {
  alive = true;
  returnPage = '';
  redirecting = false;

  ngOnDestroy(): void {
    this.alive = false;
  }

  constructor(private activatedRoute: ActivatedRoute, private globalAuthService: GlobalAuthService, private router: Router) {

    this.activatedRoute.queryParamMap
      .pipe(takeWhile(_ => this.alive))
      .subscribe(
        (params: ParamMap) => {
          const returnPageParam = params.get('return');
          const doParam = params.get('do');
          // Si no llega página de retorno retornamos al visor
          if (returnPageParam) this.returnPage = returnPageParam;
          else this.returnPage = environment.pages.visor;

          this.globalAuthService.authState$
            .pipe(takeWhile(_ => this.alive))
            .subscribe((userLogged) => {
              // Si tenemos usuario y ni hay parametro do redireccionamos a la pagina de retorno
              if (userLogged && !doParam) {
                this.redirecting = true;
                this.router.navigateByUrl(this.returnPage);
              } else if (!userLogged && doParam) {
                // Tras el deslogado retornamos al login son parámetros
                this.router.navigateByUrl(environment.pages.login);
              }
            });

          if (doParam === 'logout') this.globalAuthService.logOut();

        }
      );

  }
}
