import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'gss-layers-detail-page',
  templateUrl: './layers-detail-page.component.html',
  styleUrls: ['./layers-detail-page.component.scss']
})
export class LayersDetailPageComponent implements OnInit {

  layerId: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.layerId = params.get('id');
    });
  }

}
