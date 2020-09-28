import { Component, OnInit } from '@angular/core';
import { AoiService } from '@geospatial/components/aoi-panel/services/aoi.service';
import { Observable } from 'rxjs';
import { GeospatialParentComponent } from '@geospatial/classes/geospatial-parent-component.class';
import { AOIModel } from '@geospatial/classes/aoi.model';
/**
 * Componente que mostrará el listado de AOIs del usuario.
 * Utiliza un Data
 *
 * @export
 * @class AoisListComponent
 * @extends {GeospatialParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'gss-aois-list',
  templateUrl: './aois-list.component.html',
  styleUrls: ['./aois-list.component.scss']
})
export class AoisListComponent extends GeospatialParentComponent implements OnInit {

  aoiList: Observable<AOIModel[]>;
  loading$: Observable<boolean>;
  sortOptions: { label: string; value: string; }[];
  sortKey: string;
  sortField: string;

  sortOrder: number;


  constructor(private aoiService: AoiService) {
    super();
  }

  ngOnInit() {
    this.aoiList = this.aoiService.getAll();
    this.loading$ = this.aoiService.loading$;

    this.sortOptions = [
      { label: 'ID', value: 'id' },
      { label: 'Nombre desc', value: '!name' },
      { label: 'Nombre asc', value: 'name' }
    ];

  }

  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }



}
