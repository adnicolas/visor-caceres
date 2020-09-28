import { Component, Input, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserMapModel } from '@cotvisor-admin/models';
import { UserMapsService } from '@cotvisor-admin/services';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'cot-user-maps-favourites-list',
  templateUrl: './user-maps-favourites-list.component.html',
  styleUrls: ['./user-maps-favourites-list.component.scss'],
})
export class UserMapsFavouritesListComponent extends ParentComponent implements OnInit {

  @Input() public userId: number;
  public favoritesUserMaps: UserMapModel[] = [];
  public mapsCols = [
    { field: 'img', header: 'imagen', format: 'img' },
    { field: 'name', header: 'Nombre', format: 'text' },
    { field: 'description', header: 'Descripción', format: 'text' },
    { field: 'stampCreation', header: 'Creado', format: 'date' }
  ];

  constructor(public userMapsService: UserMapsService) {
    super();
  }

  public ngOnInit(): void {

    this.userMapsService.userMapFavourites$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (userMaps) => {
          this.favoritesUserMaps = userMaps;
        }
      );
    this.userMapsService.getFavouriteMaps(this.userId);
  }

  public showUserMap(userFavouriteMap: UserMapModel) {
    // this.navController.push("mapa", { id: userFavouriteMap.id, userMap: userFavouriteMap });

    // cargar mapa
    // this.navController.setRoot('visor', { config: `map=${userFavouriteMap.id}` });
  }

  public deleteFavouriteMap(userFavouriteMap: UserMapModel) {
    // const alert = this.alertController.create({
    //     title: this.getLiteral('delete_title'),
    //     message: this.getLiteral('delete_msg'),
    //     buttons: [
    //         {
    //             text: this.getLiteral('delete_no'),
    //             role: 'cancel',
    //             cssClass: '',
    //         },
    //         {
    //             text: this.getLiteral('delete_yes'),
    //             cssClass: '',
    //             handler: () => { this.userMapsService.deleteFavouriteMap(this.userId, userFavouriteMap.id); },
    //         },
    //     ],
    // });
    // alert.present();

  }

  deleteMap($event) {


  }

}
