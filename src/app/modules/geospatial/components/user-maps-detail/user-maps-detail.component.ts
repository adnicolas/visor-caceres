import { Component, OnInit, Input } from '@angular/core';
import { UserMapsService } from '@cotvisor-admin/services';
import { UserMapModel } from '@cotvisor-admin/models';

/**
 * Muestra el detalle de una capa usanto el componente de detalle del visor
 * Necesita como parámetro el id de la capa a mostrar
 *
 * @export
 * @class UserMapsDetailComponent
 * @implements {OnInit}
 */

@Component({
  selector: 'gss-user-maps-detail',
  templateUrl: './user-maps-detail.component.html',
  styleUrls: ['./user-maps-detail.component.scss']
})
export class UserMapsDetailComponent implements OnInit {

  @Input() mapID: number;
  public userMap: UserMapModel;

  constructor(private userMapsService: UserMapsService) {
  }

  ngOnInit() {

    this.userMapsService.get(this.mapID).subscribe(
      userMap => {
        this.userMap = userMap;
      }
    );


  }

}
