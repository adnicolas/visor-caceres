import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CatalogFilter } from '@geospatial/classes/catalog-filter';

/**
 * Servicio que contiene el filtro activo del catálogo
 *
 * @export
 * @class CatalogFilterService
 */
@Injectable()

export class CatalogFilterService {

  // Filtro
  private filter: CatalogFilter;
  // Subject del filtro de escenas
  // private filterSubject: BehaviorSubject<CatalogFilter>;
  // // Observable del filtro de escenas  notificará los cambios en el filtro
  // public filter$: Observable<CatalogFilter>;

  constructor() {
    this.filter = new CatalogFilter();
    // this.filterSubject = new BehaviorSubject<CatalogFilter>(this.filter);
    // this.filter$ = this.filterSubject.asObservable();
  }

  public getFilter(): Observable<CatalogFilter> {
    return this.filter.filter$ as Observable<CatalogFilter>;
  }


  public applyFilter(catalogFilter: CatalogFilter) {
    this.filter = catalogFilter;
    this.filter.pristine = false;
    // this.filterSubject.next(this.filter);
    this.filter.setFilter(catalogFilter);

  }

  public resetFilter() {
    this.filter.resetFilter();
  }


}
