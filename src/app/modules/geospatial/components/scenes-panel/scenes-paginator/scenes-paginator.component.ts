import { Component, OnInit } from '@angular/core';
import { ScenesFilterService } from '@geospatial/components/scenes-panel/services/scenes-filter.service';

@Component({
  selector: 'gss-scenes-paginator',
  templateUrl: './scenes-paginator.component.html',
  styleUrls: ['./scenes-paginator.component.scss']
})
export class ScenesPaginatorComponent implements OnInit {

  constructor(scenesFilterService: ScenesFilterService) { }

  ngOnInit() {
  }

}
