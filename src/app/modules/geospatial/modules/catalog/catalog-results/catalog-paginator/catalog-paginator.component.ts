import { Component, OnInit, Input } from '@angular/core';
import { CatalogFilter } from '@geospatial/classes/catalog-filter';
import { GeospatialParentComponent } from '@geospatial/classes/geospatial-parent-component.class';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gss-catalog-paginator',
  templateUrl: './catalog-paginator.component.html',
  styleUrls: ['./catalog-paginator.component.scss']
})
export class CatalogPaginatorComponent extends GeospatialParentComponent implements OnInit {

  @Input() catalogFilter: CatalogFilter;
  totalRows: number;
  rows: number;
  first: number;


  constructor() {
    super();
  }

  ngOnInit() {
    this.catalogFilter.paginationChanges$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        filter => {
          this.totalRows = filter.pagination.totalResults;
          this.rows = filter.pagination.resultsPerPage;
          this.first = filter.pagination.first;
        }
      );

  }

  changePage($event) {
    this.catalogFilter.goto($event.page);
  }

}
