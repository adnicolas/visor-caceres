import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CatalogFilter } from '@geospatial/classes/catalog-filter';
import { GeospatialParentService } from '@geospatial/classes/geospatial-parent-service.class';
import { PaginationClass } from '@geospatial/classes/pagination.class';
import { CatalogResult } from '@geospatial/modules/catalog/catalog-result';
import { CatalogFilterService } from './catalog-filter.service';

@Injectable()
export class CatalogService extends GeospatialParentService {

  searchResults$: Observable<CatalogResult>;
  private searchResultsSubject: BehaviorSubject<CatalogResult>;
  public filter: CatalogFilter;
  private BASEURL = environment.apis.geonetworkAPI.baseUrl;

  constructor(private httpclient: HttpClient, private catalogFilterService: CatalogFilterService) {
    super();
    this.searchResultsSubject = new BehaviorSubject(null);
    this.searchResults$ = this.searchResultsSubject.asObservable();
    this.catalogFilterService.getFilter()
      .subscribe(catalogFilter => {
        this.filter = catalogFilter;
        if (!catalogFilter.pristine) this.searchAny(catalogFilter);
      }

      );

  }


  /**
   * Busca el termino sobre cualquier elemento del catálogo
   *
   * @param {any} searchTerm
   *
   * @memberOf CatalogService
   */
  searchAny(catalogFilter: CatalogFilter) {

    const op = 'buscar sobre cualquier elemento del catálogo';
    // TODO usar clase filtro
    this.notifyLoading(true);
    const params = `any=${catalogFilter.searchTerm}&_content_type=${catalogFilter.contentType}` +
      `&fast=${catalogFilter.fast}&from=${catalogFilter.pagination.first}` +
      `&to=${catalogFilter.pagination.first + catalogFilter.pagination.resultsPerPage - 1}&sortBy=${catalogFilter.sortBy}`;
    /*     const filterPams = {
          any: catalogFilter.searchTerm,
          _content_type: catalogFilter.contentType,
          fast: catalogFilter.fast,
          from: catalogFilter.pagination.first,
          to: catalogFilter.pagination.first + catalogFilter.pagination.resultsPerPage - 1,
          sortBy: catalogFilter.sortBy
        }; */

    // this.httpProxyService.get<CatalogResult>(`http://catalogo.igme.es/geonetwork/srv/spa/q?_content_type=json&fast=index&from=1&to=20&sortBy=relevance`, { params: { any: catalogFilter.searchTerm } })
    this.httpclient.get<CatalogResult>(`${this.BASEURL}${environment.apis.geonetworkAPI.endpoints.query}?${params}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject)),
        map((res: CatalogResult) => new CatalogResult().deserialize(res))
      )
      .subscribe((searchResults: CatalogResult) => {
        this.setFilterPaginationResponse(searchResults);
        this.searchResultsSubject.next(searchResults);
        this.notifyLoading(false);
      });

  }
  setFilterPaginationResponse(searchResults: CatalogResult) {
    const pagination = new PaginationClass();
    // this.catalogSearchPage.first = parseInt(results['@from'], 10);
    // this.catalogSearchPage.rows = parseInt(results['@to'], 10) - this.catalogSearchPage.first;
    // this.catalogSearchPage.totalRows = parseInt(results.summary['@count'], 10);
    // this.catalogSearchPage.pageCount =
    pagination.first = parseInt(searchResults['@from'], 10);
    pagination.totalResults = parseInt(searchResults.summary['@count'], 10);
    pagination.totalPages = Math.trunc(pagination.totalResults / this.environment.results_per_page) + 1;

    this.filter.setPagination(pagination);
  }


  /**
   * Obtiene sugerencias de búsqueda
   *
   * @returns {Observable<string[]>}
   *
   * @memberOf CatalogService
   */
  getSuggestions(searchTerm: string): Observable<string[]> {

    const op = 'obtener sugerencias';

    return this.httpclient.get<[string, string[]]>(`${this.BASEURL}${environment.apis.geonetworkAPI.endpoints.suggest}?field=anylight&sortBy=STARTSWITHFIRST&q=${searchTerm}`)
      .map(suggest => suggest[1])
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op, this.loadingSubject))
      );


  }

}
