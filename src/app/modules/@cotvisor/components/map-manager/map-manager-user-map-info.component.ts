import { Component, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserMapModel, UserModel } from '@cotvisor-admin/models';
import { GlobalAuthService, UserMapsService } from '@cotvisor-admin/services';
import { takeUntil } from 'rxjs/operators';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';
import { environment } from 'src/environments/environment';
import { DynamicDialogService } from '@theme/services/dynamic-dialog.service';
import { MapEditInfoComponent } from './map-edit-info/map-edit-info.component';
import { ToastService } from '@theme/services/toast.service';

/**
 * Componente que muestra la información de detalle de un mapa de usuario
 *
 * @export
 * @class MapManagerToolsComponent
 */
@Component({
  selector: 'cot-map-manager-user-map-info',
  templateUrl: './map-manager-user-map-info.component.html',
})
export class MapManagerUserMapInfoComponent extends ParentComponent implements OnInit {

  public userMapModel: UserMapModel;
  public mapAvatar: string;
  public showConfigMap: boolean;

  constructor(
    private globalAuthService: GlobalAuthService,
    private vsMapService: VsMapService,
    private dynamicDialogService: DynamicDialogService,
    private userMapsService: UserMapsService,
    private toastService: ToastService
  ) {

    super();
    this.vsMapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (vsMapUserMap: VsMapUserMap) => {
          if (vsMapUserMap) this.userMapModel = vsMapUserMap.userMapSource;
          else this.userMapModel = null;
        }
      );
    this.useLiterals(['USER_MAPS.PROPERTIES']);
  }

  public ngOnInit(): void {
    this.globalAuthService.authState$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (user) => this.checkButtons(user),
      );
    if (this.userMapModel.img) this.mapAvatar = this.userMapModel.img;
    else this.mapAvatar = environment.default_visor_map_image;
  }

  /**
   *
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @memberof MapManagerUserMapInfoComponent
   */
  public openEditMapInfoModal() {
    const editMapInfoModalComponentRef = this.dynamicDialogService.open(
      MapEditInfoComponent,
      this.componentLiterals['USER_MAPS.PROPERTIES'],
      {
        createNew: false,
      }
    );
    editMapInfoModalComponentRef.onClose.subscribe((returnFromComponent) => {
      if (returnFromComponent && returnFromComponent.saved && returnFromComponent.userMapSource) {
        this.saveMap(returnFromComponent.userMapSource);
      }
    });
  }
  /**
   *
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @memberof MapManagerUserMapInfoComponent
   */
  saveMap(userMapSource: UserMapModel) {
    this.userMapsService
      .update(userMapSource)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (userMap) => {
          this.toastService.showSuccess({ detail: 'Mapa guardado correctamente', summary: 'Mapa guardado' });
        },
        (error) => {
          // this.loader.closeLoading();
          this.toastService.showError({
            summary: 'Error',
            detail: this.translateService.instant('MAPMANAGER.ERROR_EXPORT' + error),
          });
        }
      );
  }

  private checkButtons(user: UserModel) {
    if (!user) {
      this.showConfigMap = false;
    } else {
      this.showConfigMap = user.id === this.userMapModel.userOwner.id;
    }
  }

}
