import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'gss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  alive = true;
  contentStyleClass: string;
  loading: boolean;

  constructor(translate: TranslateService, private router: Router) {

    translate.setDefaultLang('es'); // idioma por defecto fallback
    translate.use('es'); // Idioma a usar
    this.router.events
      .subscribe(
        (event) => {
          // Asigna clase para usar en el contenedor del layout
          if (event instanceof NavigationEnd) {
            this.contentStyleClass = event.urlAfterRedirects.substr(1, event.urlAfterRedirects.length);
          }
        });

  }

}
