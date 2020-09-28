import { Injectable } from '@angular/core';
import { ErrorTheme } from '@theme/classes/error-theme.class';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const COLORS = ['primaryFg', 'primaryBg', 'secondaryBg', 'secondaryFg', 'tertiaryBg', 'tertiaryFg'];
/**
 * Servicio del tema, gestiona colores y otras configuraciones necesarias
 *
 * @export
 * @class ThemeService
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private navigatingBetweenPagesSubject: BehaviorSubject<boolean>;
  navigatingBetweenPages$: Observable<boolean>;
  private panelOpenSubject: BehaviorSubject<boolean>;
  panelOpen$: Observable<boolean>;

  constructor(private router: Router, private translateService: TranslateService) {
    this.navigatingBetweenPagesSubject = new BehaviorSubject(false);
    this.navigatingBetweenPages$ = this.navigatingBetweenPagesSubject.asObservable();
    this.panelOpenSubject = new BehaviorSubject(false);
    this.panelOpen$ = this.panelOpenSubject.asObservable();

    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationStart) {
          // Show loading indicator
          this.navigatingBetweenPagesSubject.next(true);
        }

        if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
          this.navigatingBetweenPagesSubject.next(false);

        }
      });
  }


  /**
   *  Notifica la apertura o cierre del panel
   *
   * @param {boolean} open
   *
   * @memberOf ThemeService
   */
  notifyPanelOpen(open: boolean) {

    this.panelOpenSubject.next(open);

  }


  /**
   * Obtiene una variable css establecida en root
   *
   * @param color
   */
  // FIXME no está funcionando
  getCssVar(varName: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(`--${varName}`);

  }

  /**
   * Obtiene un color del tema
   *
   * @param color
   */
  getThemeColor(color: string) {
    if (COLORS.indexOf(color) >= 0) {
      getComputedStyle(document.documentElement).getPropertyValue(`--${color}`);
    } else throw new ErrorTheme('ThemeService', `Error al obtener el color --${color}, no está definido`);

  }

  /**
   * Establece un color del tema
   *
   * @param color
   */
  setThemeColor(color: string, colorValue: string) {
    if (COLORS.indexOf(color) >= 0) {
      document.documentElement.style.setProperty(`--${color}`, colorValue);
    } else throw new ErrorTheme('ThemeService', `Error al establecer el color --${color}, no está definido`);

  }

  /**
   * Establece  el idioma de la aplicación
   *
   * @param color
   */
  setLanguage(language: string) {
    this.translateService.use(language);

  }


  /**
   * Retorna el idioma actual
   *
   * @returns {string}
   *
   * @memberOf ThemeService
   */
  getCurrentLanguage(): string {
    return this.translateService.currentLang;

  }



}
