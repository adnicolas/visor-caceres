import { Component, OnDestroy } from '@angular/core';
import { CatalogService } from '@geospatial/modules/catalog/services/catalog.service';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { CatalogFilterService } from '@geospatial/modules/catalog/services/catalog-filter.service';
import { CatalogFilter } from '@geospatial/classes/catalog-filter';
import { GeospatialParentComponent } from '@geospatial/classes/geospatial-parent-component.class';

@Component({
  selector: 'gss-catalog-search',
  templateUrl: './catalog-search.component.html',
  styleUrls: ['./catalog-search.component.scss']
})
export class CatalogSearchComponent extends GeospatialParentComponent implements OnDestroy {


  public searchTerm: string;
  suggestions: string[];
  minSearchLength: number;
  private stopSuggestionsSearch: Subject<boolean> = new Subject<boolean>();
  private filter: CatalogFilter;



  constructor(private catalogFilterService: CatalogFilterService, private catalogService: CatalogService) {
    super();
    this.minSearchLength = environment.search_min_length_term;
    this.catalogFilterService.getFilter()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        filter => {
          this.filter = filter;
          if (filter.pristine) {
            this.search('');
          }
        }
      );
  }



  ngOnDestroy(): void {
    this.stopSuggestionsSearch.next(true);
    this.stopSuggestionsSearch.complete();
  }

  public onKeyUp() {

    if (this.searchTerm.length >= environment.search_min_length_term) {
      this.stopSuggestionsSearch.next(true);
      this.catalogService.getSuggestions(this.searchTerm)
        .pipe(debounceTime(500), takeUntil(this.stopSuggestionsSearch))
        .subscribe((suggestions) => {
          this.suggestions = suggestions;
        });
    }

  }

  search(searchTerm) {

    this.searchTerm = searchTerm;
    this.filter.searchTerm = this.searchTerm;
    this.catalogFilterService.applyFilter(this.filter);
  }

}
