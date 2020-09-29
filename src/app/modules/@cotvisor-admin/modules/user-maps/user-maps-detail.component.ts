import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserMapModel, UserModel } from '@cotvisor-admin/models';
import { UserMapsService, UsersService } from '@cotvisor-admin/services';
import { ToastService } from '@theme/services/toast.service';
import { takeUntil } from 'rxjs/operators';
import { MenuItem, DynamicDialogRef } from 'primeng/components/common/api';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { ResourceTypes } from '@cotvisor-admin/classes/resource-types.enum';
import { ResourceActions } from '@cotvisor-admin/classes/resource-actions.enum';

const MAP_LIST_URL = 'mapas';

@Component({
  selector: 'cot-user-maps-detail',
  viewProviders: [DynamicDialogRef],
  templateUrl: './user-maps-detail.component.html',
  styleUrls: ['./user-maps-detail.component.scss'],
})
export class UserMapsDetailComponent extends ParentComponent implements OnInit {
  @Input() public userMap: UserMapModel;
  @ViewChild('userMapForm') public userMapForm: NgForm;
  public tabs: MenuItem[];
  public activeTab: MenuItem;
  public users: UserModel[];
  public resourceTypes = ResourceTypes;
  public resourceActions = ResourceActions;

  constructor(
    private userMapsService: UserMapsService,
    private toastService: ToastService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    private dinamic: DynamicDialogRef,
    private usersService: UsersService
  ) {
    super();
    this.tabs = [
      {
        icon: 'pi pi-info-circle',
        id: 'datos',
        command: () => {
          this.changeActiveTab('datos');
        },
      },
      {
        id: 'compartir',
        icon: 'pi pi-share-alt',
        command: () => {
          this.changeActiveTab('compartir');
        },
      },
    ];
    this.activeTab = this.tabs[0];
    this.onComponentLiteralsChange.pipe(takeUntil(this.unSubscribe)).subscribe(() => {
      this.tabs[0].label = this.componentLiterals['GLOBAL.INFO'];
      this.tabs[1].label = this.componentLiterals['GLOBAL.SHARE'];
    });
    this.useLiterals([
      'GLOBAL.INFO',
      'GLOBAL.SHARE',
      'USER_MAPS.DELETE_MAP_QUESTION',
      'USER_MAPS.DELETE_MAP_SUCCESS',
      'USER_MAPS.DELETE_MAP',
      'USER_MAPS.LOAD_MAP_QUESTION',
      'USER_MAPS.LOAD_MAP',
    ]);
  }

  ngOnInit() {
    this.usersService.getAll();
    this.usersService.users$.pipe(takeUntil(this.unSubscribe)).subscribe((users) => {
      this.users = users;
    });
  }
  /**
   * Llamada a servicio de guardar mapa
   *
   * @memberof UserMapsDetailComponent
   */
  public saveUserMap() {
    this.userMapsService
      .save(this.userMap)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((userMap) => {
        this.toastService.showSuccess({ detail: `Mapa ${userMap.name} guardado correctamente`, summary: 'Guardado' });
        this.userMapForm.form.markAsPristine();
      });
  }

  /**
   * Llamada a servicio de eliminar mapa tras pedir confirmación al usuario
   *
   * @memberof UserMapsDetailComponent
   */
  public deleteUserMap() {
    this.confirmDialogService.open({
      message: this.componentLiterals['USER_MAPS.DELETE_MAP_QUESTION'],
      header: this.componentLiterals['USER_MAPS.DELETE_MAP'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // eliminar capa
        this.userMapsService.delete(this.userMap.id).subscribe((_success) => {
          this.toastService.showSuccess({
            summary: this.componentLiterals['USER_MAPS.DELETE_MAP_SUCCESS'],
            detail: '',
          });
          this.router.navigateByUrl(MAP_LIST_URL);
        });
      },
      reject: () => { },
    });
  }

  gotoUserMap() {
    this.confirmDialogService.open({
      message: this.componentLiterals['USER_MAPS.LOAD_MAP_QUESTION'],
      header: this.componentLiterals['USER_MAPS.LOAD_MAP'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.dinamic.close();
        this.router.navigateByUrl(`/visor?map=${this.userMap.id}`);
      },
      reject: () => { },
    });
  }

  /**
   * Método llamado al cambiar de pestaña para conocer la pestaña activa
   *
   * @private
   * @param {string} activeTab
   *
   * @memberOf UserMapsDetailComponent
   */
  private changeActiveTab(activeTab: string) {
    this.activeTab = this.tabs.find((tab) => tab.id === activeTab);
  }
}
