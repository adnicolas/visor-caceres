import { Component } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Router } from '@angular/router';
import { LayerModel } from '@cotvisor-admin/models';

@Component({
  selector: 'gss-layers-list',
  templateUrl: './layers-list.component.html',
  styleUrls: ['./layers-list.component.scss']
})
export class LayersListComponent extends ParentComponent {

  public selectedLayer: LayerModel;

  constructor(private router: Router) {
    super();
  }


  /**
   * Publica la capa seleccionada
   *
   * @memberOf LayersListComponent
   */
  // TODO Componente de publicaciónd e capa
  publishSelectedLayer() {
    alert('Publicar la capa, será necesario un componente que solicite informacion acerca de la publicación como grupos u otros datos');



  }

  setSelectedLayer(layer: LayerModel) {
    this.selectedLayer = layer;
  }

  goToLayer(layerId: number) {

    this.router.navigate(['/capas', layerId]);

  }

}
