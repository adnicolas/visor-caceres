import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gss-maps-detail-page',
  templateUrl: './maps-detail-page.component.html',
  styleUrls: ['./maps-detail-page.component.scss']
})
export class MapsDetailPageComponent implements OnInit {

  mapId: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.mapId = params.get('id');
    });
  }

}
