import { Component, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { PanelsManagerService } from '@theme/services/panels-manager.service';
import { environment } from 'src/environments/environment';
import { ThemeService } from '@theme/services/theme.service';
import { takeWhile, take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { UserModel } from '@cotvisor-admin/models';
import { GlobalAuthService } from '@cotvisor-admin/services';
declare var require: any;
const VERSION = require('../../../../../../package.json').version;


/**
 * Componente cabecera que muestra un toolbar
 *
 * @export
 * @class HeaderComponent
 * @implements {OnDestroy}
 */
@Component({
  selector: 'the-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnDestroy {

  loading: boolean;
  title: string;

  visibleSidebar1 = false;
  version: string;
  alive = true;
  enviroment: string;
  currentUser: UserModel;
  userMenu: MenuItem[];
  menu: MenuItem[];
  languageMenu: MenuItem[];
  currentLanguage: string;
  currentFlag: any;

  constructor(private sidebarsManagerService: PanelsManagerService, private themeService: ThemeService, private router: Router, private activatedRoute: ActivatedRoute, private globalAuthService: GlobalAuthService) {
    this.title = environment.app_name;
    this.enviroment = environment.app_name_enviroment;
    this.menu = [
      { label: 'Visor de mapas', icon: 'fas fa-globe-americas', routerLink: ['/visor'] },
      { label: 'Comparador', icon: 'fas fa-th-large', routerLink: ['/comparador'] },
      { label: 'Salir', icon: 'pi pi-sign-out', routerLink: ['/login'], queryParams: { do: 'logout' } }
    ];

    this.languageMenu = [
      { label: 'Castellano', styleClass: 'flag-es', command: () => this.setLanguage('es') },
      { label: 'Inglés', styleClass: 'flag-en', command: () => this.setLanguage('en') },
    ];

    this.userMenu = [
      { label: 'Dashboard', icon: 'mi dashboard', routerLink: ['/dashboard'] },
      { label: 'Capas', icon: 'fas fa-layer-group', routerLink: ['/capas'] },
      { label: 'Mapas', icon: 'mi map', routerLink: ['/mapas'] },
      { label: 'Visores', icon: 'mi desktop-windows', routerLink: ['/visores'] },
      { label: 'Usuarios', icon: 'pi pi-user', routerLink: ['/usuarios'] },
      { label: 'Grupos', icon: 'pi pi-users', routerLink: ['/grupos'] }
    ];


    if (!environment.production) {
      this.version = `v.${VERSION}`;
    }
    // Suscripción a la notificación de navegación entre paginas
    this.themeService.navigatingBetweenPages$
      .pipe(takeWhile(() => this.alive))
      .subscribe(
        (loading) => {
          this.loading = loading;
          // Si se ha inciciado la carga salimos, modificamos el menu sólo cuando loading sea falso
          // que indica que la página ya ha cargado
          if (loading) return;

          // Gestionamos en el menu la url para que mantenga la del mapa cargado en el visor
          if (this.router.url.includes('/visor')) {
            this.activatedRoute.queryParams
              .pipe(take(1))
              .subscribe(
                queryParams => {
                  this.menu[0].queryParams = queryParams;
                  this.menu[0].disabled = true;
                  this.menu[0].label = 'Visor';
                });

          } else {
            this.menu[0].disabled = false;
            this.menu[0].label = 'Volver al mapa cargado';
          }

        }
      );

    this.globalAuthService.authState$
      .pipe(takeWhile(() => this.alive))
      .subscribe(user => this.currentUser = user);

    this.currentLanguage = this.themeService.getCurrentLanguage();
    this.currentFlag = `flag-${this.currentLanguage}`;

  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  openPanel(panelName: string) {
    this.sidebarsManagerService.openPanel(panelName);
  }

  gotoLogin() {
    this.router.navigateByUrl('/login');
  }

  gotoVisor() {

  }

  setLanguage(languageCode: string) {
    this.themeService.setLanguage(languageCode);
    this.currentLanguage = languageCode;
    this.currentFlag = `flag-${languageCode}`;
  }

}
