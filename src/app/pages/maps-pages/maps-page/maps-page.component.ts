import { Component, OnInit } from '@angular/core';
import { UserMapsService } from '@cotvisor-admin/services';

@Component({
  selector: 'gss-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.scss']
})
export class MapsPageComponent implements OnInit {
  mapsFav: number;

  constructor(public userMapsService: UserMapsService) { }

  ngOnInit() {

    this.userMapsService.userMapsFavouritesCount$.subscribe(
      maps => {
        this.mapsFav = maps;
      }
    );

  }

}
