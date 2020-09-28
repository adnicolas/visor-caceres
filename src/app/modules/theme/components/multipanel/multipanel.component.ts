import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { PanelsManagerService } from '@theme/services/panels-manager.service';
import { NgTemplateOutlet } from '@angular/common';
import { ThemeService } from '@theme/services/theme.service';
import { PanelItem } from '@theme/classes/panel-item.class';
import { Router } from '@angular/router';
/**
 * Componente que muestra varios botones de paneles dentro de un toolbar
 *
 * @export
 * @class MultipanelComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-multipanel',
  templateUrl: './multipanel.component.html',
  styleUrls: ['./multipanel.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MultipanelComponent implements OnInit {

  @Input() panelsNames: string[] = [];
  @Input() panelsTooltips: string[] = [];
  @Input() panelsIcons: string[] = [];

  /**
   * Define el estilo del panel que
   *
   * @type {string}
   * @memberOf MultipanelComponent
   */
  @Input() styleClass?: string;
  @ViewChild('toolbar') toolbar: NgTemplateOutlet;

  togglesStyleClass: string;

  public panelsInitialized: PanelItem[] = [];

  constructor(private panelsManagerService: PanelsManagerService, private themeService: ThemeService, private router: Router) {

  }
  /**
   * Construye el array de paneles inicializados
   *
   * @memberof MultipanelComponent
   */
  ngOnInit() {
    // Es necesario usar el async /await para que no de problemas de ExpressionChangeAfter...
    const pageUrl = this.router.url;
    this.panelsManagerService.registeredPanels$.subscribe(async (panels) => {
      this.panelsInitialized = await panels.filter(panel => panel.pageUrl === pageUrl && this.panelsNames.some(el => el === panel.name));
      for (const panel of this.panelsInitialized) {
        this.initializePanel(panel);
      }
      this.reorderPanelsInitialized();
    });
    if (this.styleClass === 'inverse') this.togglesStyleClass = 'ui-button-primary-inverse';
    else this.togglesStyleClass = 'ui-button-primary';
  }

  /**
   * Cierra todos los paneles del multipanel excepto el recibido
   *
   * @param {string} exceptPanel
   * @memberof MultipanelComponent
   */
  closeOtherPanels(exceptPanel: PanelItem) {

    this.panelsInitialized.forEach(
      (panel) => {
        if (panel !== exceptPanel) panel.visible = false;
      });
    // Notifica a traves del servicio del tema si hay algún panel abierto
    this.themeService.notifyPanelOpen(exceptPanel.visible);

  }


  /**
   * Inicializa un panel a los valores por defecto
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @private
   * @param {PanelItem} panel
   * @memberof MultipanelComponent
   */
  private initializePanel(panel: PanelItem) {
    panel.styleClass = 'multipanel-panel';
    panel.showCloseIcon = false;
  }

  /**
   * Reordena el array de paneles inicializados al orden en que llegan la lista de nombres al componente
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @private
   * @memberof MultipanelComponent
   */
  private reorderPanelsInitialized() {
    this.panelsInitialized.sort((a, b) => {
      return this.panelsNames.indexOf(a.name) - this.panelsNames.indexOf(b.name);
    });
  }


}
