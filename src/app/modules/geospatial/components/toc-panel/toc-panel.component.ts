import { Component, } from '@angular/core';
import { DynamicDialogService } from '@theme/services/dynamic-dialog.service';
import { LayersLoaderComponent } from '@geospatial/components/layers-loader/layers-loader.component';



/**
 * Componente que muestra las capas cargadas en el mapa
 *
 * @export
 * @class TocPanelComponent
 */
@Component({
  selector: 'gss-toc-panel',
  templateUrl: './toc-panel.component.html',
  styleUrls: ['./toc-panel.component.scss']
})
export class TocPanelComponent {

  public panelName = 'Capas';

  constructor(private dialogService: DynamicDialogService) {

  }

  /**
   * Abre el diálogo para añadir nuevas capas
   *
   * @memberof TocPanelComponent
   */
  public openAddLayerDialog(event) {

    // TODO permitir realizar animaciones con la clase responsiveDialog. En la versión 7.1.3 debería funcionar
    this.dialogService.open(LayersLoaderComponent, 'Añadir capas');
  }
}
