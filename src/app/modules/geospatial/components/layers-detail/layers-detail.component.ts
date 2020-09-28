import { Component, OnInit, Input } from '@angular/core';
import { LayersService } from '@cotvisor-admin/services';
import { LayerModel } from '@cotvisor-admin/models';
/**
 * Muestra el detalle de una capa usanto el componente de detalle del visor
 * Necesita como parámetro el id de la capa a mostrar
 *
 * @export
 * @class LayersDetailComponent
 * @implements {OnInit}
 */

@Component({
  selector: 'gss-layers-detail',
  templateUrl: './layers-detail.component.html',
  styleUrls: ['./layers-detail.component.scss']
})
export class LayersDetailComponent implements OnInit {

  @Input() layerID: number;
  public layer: LayerModel;

  constructor(private layersService: LayersService) {
  }

  ngOnInit() {

    this.layersService.get(this.layerID).subscribe(

      layer => {
        this.layer = layer;
      }
    );


  }

}
