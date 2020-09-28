import { Injectable } from '@angular/core';
import { ParentService } from './parent.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesTreeService extends ParentService {

  public categoriesTree: any;

  constructor(private httpClient: HttpClient) {
    super();

    this.getCategories();
  }

  /**
   *  Obtiene las categorías de capas desde una url
   */
  public getCategories(): Promise<any> {
    return this.httpClient.get(`${environment.apis.visorAssets.baseUrl}${environment.apis.visorAssets.endpoints.categories}`)
      .pipe(tap((categoriesTree) => this.categoriesTree = categoriesTree))
      .toPromise();
  }
}
