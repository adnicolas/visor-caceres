import { Component, OnInit } from '@angular/core';
import { CatalogService } from '@geospatial/modules/catalog/services/catalog.service';
import { takeUntil } from 'rxjs/operators';
import { CatalogResult } from '@geospatial/modules/catalog/catalog-result';
import { GeospatialParentComponent } from '@geospatial/classes/geospatial-parent-component.class';
import { CatalogFilterService } from '@geospatial/modules/catalog/services/catalog-filter.service';
import { CatalogFilter } from '@geospatial/classes/catalog-filter';

@Component({
  selector: 'gss-catalog-results',
  templateUrl: './catalog-results.component.html',
  styleUrls: ['./catalog-results.component.scss']
})
export class CatalogResultsComponent extends GeospatialParentComponent implements OnInit {

  searchResults: CatalogResult;
  currentCatalogFilter: CatalogFilter;

  constructor(public catalogService: CatalogService, private catalogFilterService: CatalogFilterService) {
    super();
  }

  ngOnInit() {
    this.catalogService.searchResults$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(searchResults => {
        this.setResults(searchResults);
      }
      );
    this.catalogFilterService.getFilter()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(currentFilter => {
        this.currentCatalogFilter = currentFilter;
      }
      );
  }




  setResults(results: CatalogResult) {
    if (!results) return;

    this.searchResults = results;

  }


  getNewResultsPage($event: any) {
    alert('buscar');

  }

}
