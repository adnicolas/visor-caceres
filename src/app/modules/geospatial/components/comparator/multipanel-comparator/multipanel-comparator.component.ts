import { Component, OnInit } from '@angular/core';
import { ThemeBaseComponentClass } from '@theme/classes/theme-base-component.class';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'gss-multipanel-comparator',
  templateUrl: './multipanel-comparator.component.html',
  styleUrls: ['./multipanel-comparator.component.scss']
})
export class MultipanelComparatorComponent extends ThemeBaseComponentClass implements OnInit {
  public panelIcons: string[];
  public panelTooltips: string[];
  public panelNames: string[];
  constructor() { super(); }

  ngOnInit() {


    this.panelIcons = ['fas fa-layer-group', 'fas fa-globe-europe'];
    this.panelNames = ['Capas', 'Capas Base'];

    const literals = [
      'TOC.TITLE', 'BASE_LAYERS.TITLE'];
    // Asignamos las etiquetas del lenguaje activo y nos subscribimos a los cambios de idioma que se hagan
    this.onComponentLiteralsChange.pipe(takeWhile(() => this.alive)).subscribe(() => {
      this.panelTooltips = [];
      literals.forEach(literal => this.panelTooltips.push(this.componentLiterals[literal]));
    });

    this.useLiterals(literals);
  }

}
