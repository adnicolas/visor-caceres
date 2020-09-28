import { HttpClient, HttpClientJsonpModule, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Interceptor } from './interceptor';
import { VisorAdminInterceptor } from '@cotvisor-admin/services/visor-admin-interceptor.service';
import { InjectorService } from '@cotvisor/services/injector.service';
import { CustomReuseStrategy } from '@theme/custom-reuse-strategy';
import { ThemeInjectorService } from '@theme/services/theme-injector.service';
import { ThemeModule } from '@theme/theme.module';
import { FrontendErrorManagerService } from '@theme/services/frontend-error-manager.service';




// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, environment.language_json);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ThemeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  providers: [
    { provide: ErrorHandler, useClass: FrontendErrorManagerService },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    // Interceptor Global (sin uso por ahora)
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    // Al haber páginas declaradas como módulo Lazy Load hay que declarar el interceptor en el app.module
    // y en los distintos módulos si se quiere que se pueda cargar una url directamente.
    { provide: HTTP_INTERCEPTORS, useClass: VisorAdminInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public injector: Injector) {
    ThemeInjectorService.injector = this.injector;
    InjectorService.injector = this.injector;
  }
}
