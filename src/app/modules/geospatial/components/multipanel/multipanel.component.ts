import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs/operators';
import { ThemeBaseComponentClass } from '@theme/classes/theme-base-component.class';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gss-multipanel',
  templateUrl: './multipanel.component.html',
  styleUrls: ['./multipanel.component.scss']
})
export class MultipanelComponent extends ThemeBaseComponentClass implements OnInit {

  panelIcons: string[];
  panelTooltips: string[];
  panelNames: string[];
  constructor() { super(); }

  ngOnInit() {
    this.panelIcons = ['mi map', 'mi layers', 'fas fa-globe-europe', 'fas fa-atlas', 'fas fa-map-marker-alt', /* 'fas fa-globe-europe',*/ 'fa fa-print', 'fas fa-search'];
    this.panelNames = ['Mapa', 'Capas', 'Capas Base', 'Galería de Mapas', 'Ubicaciones Guardadas', /* 'Catálogo', */'Impresión', 'Buscador'];

    if (environment.app_name_enviroment === 'local') {
      this.panelIcons.push('fa fa-archive');
      this.panelNames.push('Ejemplos');
    }

    const literals = [
      'GLOBAL.MAP',
      'TOC.TITLE',
      'BASE_LAYERS.TITLE',
      'MAPS_GALLERY.TITLE',
      'USER_LOCATIONS.TITLE',
      // 'Catálogo',
      'PRINT.TITLE',
      'SEARCH.TITLE'
    /*'Ejemplos'*/];
    // Asignamos las etiquetas del lenguaje activo y nos subscribimos a los cambios de idioma que se hagan
    this.onComponentLiteralsChange.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.panelTooltips = [];
      literals.forEach(literal => this.panelTooltips.push(this.componentLiterals[literal]));
    });

    this.useLiterals(literals);
  }
}


