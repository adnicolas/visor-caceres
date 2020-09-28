import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators/catchError';
import { Subject } from 'rxjs/Subject';
import { CategoryModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';

@Injectable(
  { providedIn: 'root' }
)
export class CategoriesService extends ParentAdminService {

  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // Subject de categories
  public categoriesSubject = new Subject<CategoryModel[]>();
  // Observable de categories que notificará los cambios en la lista de categories
  public categories$ = this.categoriesSubject.asObservable();

  // lista local del servicio que guarda los categories recuperados
  private categories: CategoryModel[] = [];

  constructor() {
    super();
  }

  /**
   * Obtiene todos los categories
   *
   * @returns {Observable<categoryModel[]>}
   * @memberof categoriesService
   */
  public getAll() {

    const op = 'Obtener todos los categories';

    this.httpClient.get<CategoryModel[]>(this.BACKENDURL + environment.apis.visorAssets.endpoints.categories)
      .subscribe(
        (categories) => {
          this.categories = categories;
          this.categoriesSubject.next(this.categories);
        },
        (error) => this.servicesErrorManager.handleError(error, op)
      );
  }

  /**
   * Obtiene un layer por su id
   *
   * @param {number} categoryId
   * @returns {Observable<categoryModel>}
   * @memberof categorysService
   */

  public get(categoryId: number): Observable<CategoryModel> {
    // TODO obtener respuesta del modelo de category

    const op = 'Obtener category con id ' + categoryId;

    return this.httpClient.get<CategoryModel>(`${this.BACKENDURL}${environment.apis.visorAssets.endpoints.categories}/${categoryId}`, this.httpOptions)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }


  /**
   * Guarda los datos del Category
   *
   * @param {CategoryModel} Category
   * @returns {Observable<CategoryModel>}
   * @memberof CategoriesService
   */
  public save(category: CategoryModel) {

    const op = 'Salvar Category';

    return this.httpClient.post<CategoryModel>(
      // `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.categories}`, category, this.httpOptions)
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints}/categories`, category, this.httpOptions)
      .pipe(
        tap((newCategory) => {
          this.categories = [...this.categories, newCategory]; // better not to mutate
          this.categoriesSubject.next(this.categories);
        },
        ),
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Actualiza los datos del Category
   *
   * @param {CategoryModel} Category
   * @returns {Observable<CategoryModel>}
   * @memberof CategoriesService
   */
  public update(category: CategoryModel) {

    const op = 'Actualizar Category';

    return this.httpClient.put<CategoryModel>(
      // `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.categories}`, category, this.httpOptions)
      `${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints}/categories`, category, this.httpOptions)
      .pipe(
        tap((newCategory) => {
          this.updateCategories(newCategory);
          this.categoriesSubject.next(this.categories);
        },
        ),
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Elimina el category
   *
   * @param {number} categoryId
   * @returns {Promise<void>}
   * @memberof categoriesService
   */
  public delete(categoryId: number) {

    const op = 'Eliminar category ' + categoryId;

    // return this.httpClient.delete(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.categories}/${categoryId}`)
    return this.httpClient.delete(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints}/categories/${categoryId}`)

      .pipe(
        tap(() => {
          // encontrar categoryId en el array y eliminarlo recursivamente
          this.removeCategoryRecursive(categoryId);
          this.categoriesSubject.next(this.categories);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      );
  }

  /**
   * Modifica el category en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {categoryModel} newCategory
   * @memberof categorieservice
   */
  private updateCategories(newCategory: CategoryModel) {

    // busamos la posición del category por ID
    const categoryPos = this.categories.map((category) => category.id).indexOf(newCategory.id);
    // reemplazamos en el array el category
    this.categories.splice(categoryPos, 1, newCategory);
  }

  private removeCategoryRecursive(categoryId: number) {
    const categories = this.categories.filter((category) => category.parentId === categoryId);
    for (const category of categories) {
      this.removeCategoryRecursive(category.id);
    }
    const categoryPos = this.categories.map((category) => category.id).indexOf(categoryId);
    // quitar del array
    this.categories.splice(categoryPos, 1);
  }


}
