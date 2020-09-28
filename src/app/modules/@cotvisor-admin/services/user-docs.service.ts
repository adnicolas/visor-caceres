import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { UserDocModel } from '@cotvisor-admin/models';
import { ParentAdminService } from './parentadmin.service';
import { environment } from 'src/environments/environment';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';

@Injectable()
export class UserDocsService extends ParentAdminService {


  // lista local del servicio que guarda los userDocs recuperados
  private userDocs: UserDocModel[] = [];
  // Subjects de userDocs
  private userDocsSubject = new Subject<UserDocModel[]>();
  // Observables que notificarán los cambios en la lista de userDocs
  public userDocs$ = this.userDocsSubject.asObservable();
  // count subjects
  public userDocsCountSubject = new Subject<number>();
  // count observables
  public userDocsCount$ = this.userDocsCountSubject.asObservable();

  constructor() {
    super();
  }

  /**
   * Obtiene todos los userDocs de todos los usuarios
   *
   * @returns {Observable<UserDocModel[]>}
   * @memberof userDocsService
   */
  public getAll() {

    const op = 'Obtener todos los userDocs';

    this.httpClient.get<UserDocModel[]>(environment.apis.geospatialAPI.baseUrl + environment.apis.geospatialAPI.endpoints.userDocs)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .subscribe(
        (userDocs) => {
          this.userDocs = userDocs;
          this.userDocsSubject.next(this.userDocs);
          this.userDocsCountSubject.next(this.userDocs.length);
        },
      );
  }

  public downloadDoc(id) {
    // mouse event so it works on FF & IE
    const evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // get link
    const link = Utilities.getLocation(`${environment.apis.visorAssets.baseUrl}${environment.apis.geospatialAPI.endpoints.userDocs}/file/${id}`);
    link.target = '_blank';
    // download
    link.dispatchEvent(evt);
  }

  /**
   * Obtiene todos los userDocs de un usuario
   *
   * @memberof userDocsService
   */
  public getForUser(userId: number) {

    const op = 'Obtener todos los userDocs de un usuario';

    this.httpClient.get<UserDocModel[]>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.userDocs}?userid=${userId}`)
      .pipe(
        catchError((error) => this.servicesErrorManager.handleError(error, op)),
      )
      .subscribe(
        (userDocs) => {
          this.userDocs = userDocs;
          this.userDocsSubject.next(this.userDocs);
          this.userDocsCountSubject.next(this.userDocs.length);
        },
      );
  }



  /**
   * subir userDoc
   *
   * @param {FormData} formData
   * @returns {Observable<userDocModel>}
   * @memberof userDocsService
   */
  public upload(formData) {

    const op = 'subir userDoc';

    return this.httpClient.post<UserDocModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.userDocs}`,
      formData).pipe(
        tap((userDoc) => {
          // this.updateuserDocs(response);
          this.userDocs.push(userDoc);
          this.userDocsSubject.next(this.userDocs);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Actualiza los datos del userDoc
   *
   * @param {userDocModel} userDoc
   * @returns {Observable<userDocModel>}
   * @memberof userDocsService
   */
  public update(userDoc: UserDocModel): Observable<UserDocModel> {

    const op = 'update userDocs';

    return this.httpClient.put<UserDocModel>(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.userDocs}`, userDoc)
      .pipe(
        tap((newUserDoc) => {
          this.updateUserDocs(newUserDoc);
          this.userDocsSubject.next(this.userDocs);
        }),
        catchError((error) => this.servicesErrorManager.handleError(error, op),
        ),
      );
  }

  /**
   * Modifica el map en el array por su id eliminando el anterior e insertando el nuevo en su posición
   *
   * @private
   * @param {userDocModel} newuserDoc
   * @memberof userDocService
   */
  private updateUserDocs(newuserDoc: UserDocModel) {
    // busamos la posición del userDoc por ID
    const userDocPos = this.userDocs.map((userDoc) => userDoc.id).indexOf(newuserDoc.id);
    // reemplazamos en el array el userDoc
    this.userDocs.splice(userDocPos, 1, newuserDoc);
  }

  /**
   * Elimina el userDoc
   * @param {number} userDocId
   * @returns {Promise<void>}
   * @memberof layersService
   */
  // public delete(userDocId: number): Observable<void> {

  //     const op = 'Eliminar userDoc ' + userDocId;

  //     return this.httpClient.delete(`${this.BACKENDURL}${environment.apis.geospatialAPI.endpoints.USERDOCS}/${userDocId}`)
  //         .pipe(
  //             tap(() => {
  //                 // encontrar userDocId en el array
  //                 const userDocPos = this.userDocs.map((userDoc) => userDoc.id).indexOf(userDocId);
  //                 // quitar del array
  //                 this.userDocs.splice(userDocPos, 1);
  //                 this.userDocsSubject.next(this.userDocs);
  //                 this.userDocsCountSubject.next(this.userDocs.length);
  //             }),
  //             catchError((error) => this.ServicesErrorManager.handleError(error, op)),
  //         );
  // }
}
