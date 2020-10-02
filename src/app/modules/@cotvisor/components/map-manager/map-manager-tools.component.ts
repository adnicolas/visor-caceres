import { Component, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';
import { UserModel } from '@cotvisor-admin/models';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { UserMapsService, GlobalAuthService } from '@cotvisor-admin/services';
import { ToastService } from '@theme/services/toast.service';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { takeUntil, merge } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorVisor } from '@cotvisor/classes/error-visor.class';
import { DynamicDialogService } from '@theme/services/dynamic-dialog.service';
import { MapEditInfoComponent } from './map-edit-info/map-edit-info.component';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { environment } from 'src/environments/environment';
import { UserMapsVisorLoaderComponent } from '@geospatial/components/user-maps-visor-loader/user-maps-visor-loader.component';


/**
 * Componente que muestra las herramientas de gestión de un mapa (eliminar, compartir, cargar,...)
 *
 * @export
 * @class MapManagerToolsComponent
 */
@Component({
  selector: 'cot-map-manager-tools',
  templateUrl: './map-manager-tools.component.html',
})
export class MapManagerToolsComponent extends ParentComponent implements OnInit {


  public currentVsUserMap: VsMapUserMap;
  public currentUser: UserModel;

  public isFavouriteMap: boolean;
  public disableFavouritebutton: boolean;
  public disabledDelete: boolean;
  public disabledSave: boolean;
  public disabledSaveAs: boolean;
  public disabledNew: boolean;
  public disabledShare: boolean;

  constructor(
    private vsMapService: VsMapService,
    private userMapService: UserMapsService,
    private globalAuthService: GlobalAuthService,
    private toast: ToastService,
    private router: Router,
    private dynamicDialogService: DynamicDialogService,
    private confirmDialogService: ConfirmDialogService

  ) {

    super();
    this.disableFavouritebutton = true;
    this.disabledDelete = true;
    this.disabledSave = true;
    this.disabledSaveAs = true;
    this.disabledShare = true;
    this.useLiterals(['MAPMANAGER.DELETE_MAP', 'MAPMANAGER.DELETE_MAP_CONFIRM', 'MAPMANAGER.MAP_DELETED', 'MAPMANAGER.ERROR_EXPORT', 'MAPMANAGER.NEW_MAP', 'MAPMANAGER.NEW_MAP_CONFIRM']);
    this.vsMapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (vsMapUserMap: VsMapUserMap) => {
          this.currentVsUserMap = vsMapUserMap;
          this.initButtonsStates();
        }
      );
    this.globalAuthService.authState$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (user) => {
          this.currentUser = user;
          this.initButtonsStates();
        }
      );

  }



  public ngOnInit(): void {

    // polyfill
    if (!HTMLCanvasElement.prototype.toBlob) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value(callback, type, quality) {
          const dataURL = this.toDataURL(type, quality).split(',')[1];
          setTimeout(() => {

            const binStr = atob(dataURL);
            const len = binStr.length;
            const arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));

          });
        },
      });
    }
  }

  /**
   * marca o desmarca el mapa como mapa favorito del usuario
   *
   * @memberof MapManagerToolsComponent
   */
  public toggleFavourite() {
    this.disableFavouritebutton = true;
    this.isFavouriteMap ? this.unsetFavourite() : this.setFavourite();
    this.disableFavouritebutton = false;
  }

  /**
   * Establece el mapa como favorito
   *
   * @private
   * @memberof MapManagerToolsComponent
   */
  private setFavourite() {
    if (this.globalAuthService.isAuthenticated() && this.currentVsUserMap.userMapSource.id) {
      this.userMapService.setFavouriteMap(
        this.globalAuthService.getCurrentUser().id,
        this.currentVsUserMap.userMapSource.id)
        .then(
          () => {
            this.toast.showInfo({ detail: 'Mapa marcado como favorito', summary: 'Mapa favorito' });
            this.isFavouriteMap = true;
          },
        )
        .catch(errormsg => this.toast.showError({ summary: 'Error', detail: errormsg }));
    }
  }

  /**
   * Elimina el mapa como favorito
   *
   * @private
   * @memberof MapManagerToolsComponent
   */
  private unsetFavourite() {
    if (this.globalAuthService.isAuthenticated()) {
      this.userMapService.deleteFavouriteMap(
        this.globalAuthService.getCurrentUser().id,
        this.currentVsUserMap.userMapSource.id)
        .then(() => {
          this.toast.showInfo({ detail: 'Mapa eliminado de favoritos', summary: 'Eliminado como favorito' });
          this.isFavouriteMap = false;
        })
        .catch(errormsg => this.toast.showError({ summary: 'Error', detail: errormsg }));
    }
  }

  public saveUserMap() {
    // TODO ¿ Mostrar Loader ?
    // this.loader.presentLoadingCrescent();
    // Si es una actualización
    this.currentVsUserMap.setAttributesBeforeSave();
    if (this.currentVsUserMap.userMapSource.id != null) {
      // const observableBatch = [];
      const updatePassword$ = this.userMapService.updatePassword(this.currentVsUserMap.userMapSource.id, this.currentVsUserMap.userMapSource.password).pipe(takeUntil(this.unSubscribe));
      const updateMap$ = this.userMapService.update(this.currentVsUserMap.userMapSource).pipe(takeUntil(this.unSubscribe));
      let update$: any;
      // TODO validar que el merge funciona
      // Si la contraseña ha cambiado, hacemos ambas peticiones a la vez
      if (this.currentVsUserMap.userMapSource.changePassword) {
        update$ = updateMap$.pipe(merge(updatePassword$));
      } else { update$ = updateMap$; }


      // Hago todas las peticiones en paralelo
      // Observable.forkJoin(observableBatch)

      update$.subscribe((results: [string]) => {
        // TODO parar loader
        this.toast.showInfo({ detail: 'Mapa guardado correctamente', summary: 'Mapa guardado' });
      },
        // (error) => {
        //     // TODO parar loader
        //     this.toast.showError({ summary: 'Error', detail: `Error ${error.status} al ${error.operation} ` });
        // },
      );


    } else {
      // Si es una creación
      this.userMapService.save(this.currentVsUserMap.userMapSource)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(
          (userMap) => {
            // TODO loader
            // this.loader.closeLoading();
            this.toast.showInfo({ detail: 'Mapa guardado correctamente', summary: 'Mapa guardado' });
            // Cargar mapa nuevo
            this.router.navigateByUrl(`visor?map=${userMap.id}`);
          },
          // (error) => {
          //     // TODO loader
          //     // this.loader.closeLoading();
          //     this.toast.showError({ summary: 'Error', detail: `Error ${error.status} al ${error.operation} ` });
          // },
        );
    }
  }

  public saveUserMapAs() {

    const editMapInfoModalComponentRef = this.dynamicDialogService.open(MapEditInfoComponent, 'Guardar como...', { createNew: true });
    editMapInfoModalComponentRef.onClose
      .subscribe(
        (dataFromComponent) => {
          if (dataFromComponent && dataFromComponent.saved) this.saveNewMap();
        });

  }

  private saveNewMap() {
    this.currentVsUserMap.userMapSource.id = null;
    this.currentVsUserMap.userMapSource.userOwner = null;
    // this.currentVsUserMap.userMapSource.baseLayerId = this.currentVsUserMap.getCurrentBaseLayerIndex();
    this.currentVsUserMap.userMapSource.folders.forEach((folder) => {
      folder.id = null;
    });
    // this.loader.presentLoadingCrescent();
    this.userMapService.save(this.currentVsUserMap.userMapSource)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (userMap) => {
          //  this.loader.closeLoading();
          this.toast.showSuccess({ detail: 'Mapa guardado correctamente', summary: 'Mapa guardado' });
          this.router.navigate(['visor'], { queryParams: { map: userMap.id } });
        },
        (error) => {
          // this.loader.closeLoading();
          this.toast.showError({ summary: 'Error', detail: this.translateService.instant('MAPMANAGER.ERROR_EXPORT' + error) });
        },
      );
  }

  public deleteUserMap() {

    this.confirmDialogService.open({
      message: this.componentLiterals['MAPMANAGER.DELETE_MAP_CONFIRM'],
      header: this.componentLiterals['MAPMANAGER.DELETE_MAP'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userMapService.delete(this.currentVsUserMap.userMapSource.id)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(
            () => {
              // this.loader.closeLoading();
              this.vsMapService.removeMap(this.currentVsUserMap);
              this.toast.showInfo({ detail: this.componentLiterals['MAPMANAGER.MAP_DELETED'], summary: this.componentLiterals['MAPMANAGER.DELETE_MAP'] });
              this.router.navigate([environment.pages.visor]);
            }
          );
      },
      reject: () => { }
    });

  }

  private initButtonsStates() {

    if (!this.currentVsUserMap) return;

    if (!this.currentUser) {
      this.disabledDelete = true;
      this.disabledSave = true; // TODO @ADR: WRITEPERMISSION OVER RESOURCE
      this.disabledSaveAs = true;
      this.disableFavouritebutton = true;
      this.disabledNew = true;
      this.isFavouriteMap = false;
    } else {
      this.disabledDelete = this.currentUser.id !== this.currentVsUserMap.userMapSource.userOwner.id
        || this.currentVsUserMap.userMapSource.id == null;
      this.disabledSave = this.currentUser.id !== this.currentVsUserMap.userMapSource.userOwner.id
        && this.currentVsUserMap.userMapSource.id !== null;
      this.disableFavouritebutton = this.currentVsUserMap.userMapSource.id == null;
      this.disabledSaveAs = false;
      this.disabledNew = false;
      this.disabledShare = false;
      if (this.currentVsUserMap.userMapSource.id) {
        this.userMapService.isFavouriteMap(this.currentUser.id, this.currentVsUserMap.userMapSource.id)
          .then(
            (result) => {
              this.isFavouriteMap = result;
            })

          .catch(
            // TODO mantener la info del error
            (error) => {
              throw new ErrorVisor('UserMapService.isFavouriteMap', 'Error al comprobar si el mapa es favorito', error);
            }
          );
      }
    }
  }

  public newUserMap() {
    this.confirmDialogService.open({
      message: this.componentLiterals['MAPMANAGER.NEW_MAP_CONFIRM'],
      header: this.componentLiterals['MAPMANAGER.NEW_MAP'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        setTimeout(() => this.router.navigate([environment.pages.visor], { queryParams: { map: 'new' } }), 0);
      },
      reject: () => { }
    });



  }



  /**
   * Muestra modal para buscar mapa a cargar
   *
   *
   * @memberOf MapManagerToolsComponent
   */
  public loadUserMap() {
    this.dynamicDialogService.open(UserMapsVisorLoaderComponent, 'Cargar mapa...');
  }




  public openSharePopover(ev) {
    // TODO implementar
    this.toast.showInfo({ summary: 'No implementado', detail: 'Pte de implementación' });
    // this.popoverService.presentSharePopover(ev);
  }

  public openSaveMapImageAlert() {
    this.exportMapAsImage(this.currentVsUserMap.userMapSource.name);
  }

  public exportMapAsImage(fileName) {
    const map = this.vsMapService.getActiveMap();
    map.once('postcompose', (event: ol.render.Event) => {
      const canvas = event.context.canvas;
      if (navigator.msSaveBlob) {
        // @ts-ignore válido para IE
        navigator.msSaveBlob(canvas.msToBlob(), fileName);
      } else {
        if (!this.isCanvasTainted(event.context)) {
          canvas.toBlob((blob) => {
            Utilities.saveBlobToFile(blob, fileName);
          });
        } else {
          this.toast.showError({ summary: 'Error', detail: this.translateService.instant('MAPMANAGER.ERROR_EXPORT') });
        }
      }
    });
    map.renderSync();
  }

  private isCanvasTainted(ctx) {
    try {
      ctx.getImageData(0, 0, 1, 1);
      return false;
    } catch (err) {
      return (err.code === 18);
    }
  }

}
