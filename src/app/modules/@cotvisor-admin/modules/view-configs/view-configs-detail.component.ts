import { Component, Input, OnInit } from '@angular/core';
import { MenuItem, DynamicDialogRef } from 'primeng/components/common/api';
import { ViewConfigsService } from '@cotvisor-admin/services/view-configs.service';
import { Router } from '@angular/router';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { ToastService } from '@theme/services/toast.service';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
// import { FormGroup, FormControl, FormArray, Control } from '@ng-stack/forms';
import { ToolsGroupsService, UserMapsService, UsersService } from '@cotvisor-admin/services';
import {
  ViewConfigModel,
  UserMapModel,
  ToolModel,
} from '@cotvisor-admin/models';

@Component({
  selector: 'cot-view-configs-detail',
  viewProviders: [DynamicDialogRef],
  templateUrl: './view-configs-detail.component.html',
  styleUrls: ['./view-configs-detail.component.scss']
})
export class ViewConfigsDetailComponent extends ParentComponent implements OnInit {
  @Input() public viewConfig: ViewConfigModel;
  // @ViewChild('viewConfigForm') public viewConfigForm: NgForm;
  public tabs: MenuItem[];
  public activeTab: MenuItem;
  public viewConfigDetailForm: FormGroup;
  // public shareForm: FormGroup;
  public availableLanguages: any[];
  public userMaps: UserMapModel[];
  public selectedMap: UserMapModel;
  public mapsCols: any[];
  public tools: ToolModel[] = [];
  public editMode: boolean = true;
  public showShareDialog: boolean = false;
  public users: any[];

  constructor(
    public viewConfigsService: ViewConfigsService,
    private toastService: ToastService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
    // private dinamic: DynamicDialogRef,
    private fb: FormBuilder,
    public toolsGroupsService: ToolsGroupsService,
    // private globalAuthService: GlobalAuthService,
    public userMapsService: UserMapsService,
    public usersService: UsersService
  ) {
    super();
    this.availableLanguages = [
      { label: 'Castellano', value: 'ES', styleClass: 'flag-es' },
      { label: 'Inglés', value: 'EN', styleClass: 'flag-en' },
    ];
    this.tabs = [
      {
        icon: 'pi pi-info-circle',
        id: 'datos',
        command: () => {
          this.changeActiveTab('datos');
        },
      },
      /*{
        id: 'compartir',
        icon: 'pi pi-share-alt',
        command: () => {
          this.changeActiveTab('compartir');
          // this.onClickShareDialog();
        },
      },*/
    ];
    this.activeTab = this.tabs[0];
    this.onComponentLiteralsChange.pipe(takeUntil(this.unSubscribe)).subscribe(() => {
      this.tabs[0].label = this.componentLiterals['GLOBAL.INFO'];
      // this.tabs[1].label = this.componentLiterals['GLOBAL.SHARE'];
      // this.availableLanguages[0].name = this.componentLiterals['GLOBAL.CASTELLANO'];
      // this.availableLanguages[1].name = this.componentLiterals['GLOBAL.INGLES'];
    });
    this.useLiterals([
      'GLOBAL.INFO',
      'GLOBAL.SHARE',
      'VIEWMANAGER.DELETE_VIEW_QUESTION',
      'VIEWMANAGER.DELETE_VIEW',
      'VIEWMANAGER.DELETE_VIEW_SUCCESS',
      'GLOBAL.CASTELLANO',
      'GLOBAL.INGLES'
      // 'VIEW_CONFIGS.LOAD_VIEW_QUESTION',
      // 'VIEW_CONFIGS.LOAD_VIEW',
    ]);
  }

  ngOnInit() {
    if (!this.viewConfig.id) {
      this.editMode = false;
    }
    this.mapsCols = [
      { field: 'img', header: '', format: 'img', hideFilter: true },
      { field: 'name', header: 'Nombre', format: 'text' },
      { field: 'description', header: 'Descripción', format: 'text' },
    ];
    // const currentUser = this.globalAuthService.getCurrentUser();
    this.userMapsService.getReadableMaps();
    this.toolsGroupsService.getAll();
    this.usersService.getAll();
    this.createForm();

    this.usersService.users$.pipe(takeUntil(this.unSubscribe)).subscribe((users) => {
      this.users = users;
    });

    this.userMapsService.userMaps$.pipe(takeUntil(this.unSubscribe)).subscribe((userMaps) => {
      this.userMaps = userMaps;

      const userMapids = this.viewConfigDetailForm.get('availableMaps') as FormArray;

      this.userMaps.forEach((userMap) => {
        userMapids.push(this.fb.group({
          id: [userMap.id],
          name: [userMap.name],
          description: [userMap.description],
          img: [userMap.img],
          baseLayerId: [userMap.baseLayerId],
          userOwner: this.fb.group({
            id: [userMap.userOwner.id]
          })
        }));
      });

      this.selectedMap = this.userMaps.find((userMap) => {
        return userMap.id === this.viewConfig.defaultMap.id;
      });
    });
    this.toolsGroupsService.toolGroups$.pipe(takeUntil(this.unSubscribe)).subscribe((toolsGroups) => {
      // this.toolsGroupsOptions = toolsGroups;
      const selectedToolGroup = toolsGroups.find((toolGroup) => {
        return toolGroup.id === this.viewConfig.toolsgroup.id;
      });

      if (selectedToolGroup) {
        this.viewConfigDetailForm.get('toolsGroup').setValue(selectedToolGroup);
        selectedToolGroup.tools.forEach((tool) => {
          this.tools.push(tool);
        });
      }
    });
  }

  /**
   * Llamada a servicio de guardar visor
   *
   * @memberof ViewConfigsDetailComponent
   */
  public saveViewConfig() {
    let viewConfigObj = {
      name: this.viewConfigDetailForm.controls.name.value,
      title: this.viewConfigDetailForm.controls.title.value,
      description: this.viewConfigDetailForm.controls.description.value,
      urlLogo: this.viewConfigDetailForm.controls.urlLogo.value,
      defaultMap: this.viewConfigDetailForm.controls.defaultMap.value,
      language: this.viewConfigDetailForm.controls.language.value,
      toolsgroup: this.viewConfigDetailForm.controls.toolsGroup.value
    };
    if (this.editMode) {
      viewConfigObj = { ...viewConfigObj, ...{ id: this.viewConfig.id } };
      this.viewConfigsService
        .save(viewConfigObj)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((viewConfig) => {
          this.toastService.showInfo({ detail: `Visor ${viewConfig.name} guardado correctamente`, summary: 'Guardado' });
          this.viewConfigDetailForm.markAsPristine();
        });
    } else {
      this.viewConfigsService
        .create(viewConfigObj)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe((viewConfig) => {
          this.toastService.showInfo({ detail: `Visor ${viewConfig.name} guardado correctamente`, summary: 'Guardado' });
          this.viewConfigDetailForm.markAsPristine();
          this.router.navigateByUrl('/visores');
        });
    }

  }

  /**
   * Llamada a servicio de eliminar visor tras pedir confirmación al usuario
   *
   * @memberof ViewConfigsDetailComponent
   */
  public deleteViewConfig() {
    this.confirmDialogService.open({
      message: this.componentLiterals['VIEWMANAGER.DELETE_VIEW_QUESTION'],
      header: this.componentLiterals['VIEWMANAGER.DELETE_VIEW'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // eliminar visor
        this.viewConfigsService.delete(this.viewConfig.id).subscribe((_success) => {
          this.toastService.showSuccess({
            summary: this.componentLiterals['VIEWMANAGER.DELETE_VIEW_SUCCESS'],
            detail: '',
          });
          this.router.navigateByUrl('/visores');
        });
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
   * @memberOf ViewConfigsDetailComponent
   */
  private changeActiveTab(activeTab: string) {
    this.activeTab = this.tabs.find((tab) => tab.id === activeTab);
  }

  private createForm(): void {
    // Strongly typed approach --> NgStack
    /*const viewConfigDetailForm = new FormGroup<ViewConfigForm>({
      name: new FormControl(this.viewConfig.name),
      title: new FormControl(this.viewConfig.title),
      language: new FormControl(this.viewConfig.language),
      urlLogo: new FormControl(this.viewConfig.urlLogo),
      defaultMap: new FormGroup<DefaultUserMapForm>({
        id: new FormControl<number>(this.viewConfig.defaultMap.id),
        baseLayerId: new FormControl<number>(this.viewConfig.defaultMap.baseLayerId),
        userOwner: new FormGroup<UserForm>({
          id: new FormControl<number>(this.viewConfig.defaultMap.userOwner.id)
        })
      }),
      toolsGroup: new FormGroup<ToolsGroupForm>({
        id: new FormControl<number>(this.viewConfig.toolsGroup.id),
        name: new FormControl<string>(this.viewConfig.toolsGroup.name),
        description: new FormControl<string>(this.viewConfig.toolsGroup.description),
        tools: new FormArray<ToolForm>([])
      }),
      availableMaps: new FormArray<DefaultUserMapForm>([])
    });*/

    this.viewConfigDetailForm = this.fb.group(
      {
        name: [this.viewConfig.name, Validators.required],
        title: [this.viewConfig.title, Validators.required],
        description: [this.viewConfig.description],
        urlLogo: [this.viewConfig.urlLogo, Validators.required],
        availableMaps: this.fb.array([]),
        defaultMap: this.fb.group({
          id: [this.viewConfig.defaultMap.id, Validators.required],
          userOwner: this.fb.group({
            id: [this.viewConfig.defaultMap.userOwner.id, Validators.required]
          }),
          baseLayerId: [this.viewConfig.defaultMap.baseLayerId, Validators.required]
        }),
        language: [this.viewConfig.language, Validators.required],
        toolsGroup: [this.viewConfig.language, Validators.required]
      }
    );
    /*this.shareForm = this.fb.group({
      sharingUsers: []
    });*/
  }

  trackByFn(index, row) {
    return index;
  }

  get toolsGroup() {
    return this.viewConfigDetailForm.get('toolsGroup');
  }

  onSelectChange(row: any) {
    const defaultMapCtrl = this.viewConfigDetailForm.get('defaultMap');
    if (row) {
      defaultMapCtrl.setValue({
        id: row.id,
        userOwner: {
          id: row.userOwner.id
        },
        baseLayerId: row.baseLayerId
      }, { onlySelf: false });
    } else {
      defaultMapCtrl.setValue({
        id: null,
        userOwner: {
          id: null
        },
        baseLayerId: null
      }, { onlySelf: false });
    }
    // @ADR: Necesario para habilitar botón de guardado tras cambio en la selección del mapa por defecto
    if (!defaultMapCtrl.dirty) {
      defaultMapCtrl.markAsDirty();
    }
  }

  onToolGroupChange(ev) {
    this.tools = [];
    ev.value.tools.forEach(tool => {
      this.tools.push(tool);
    });
  }

  /*shareViewConfig() {
    const idsUsers = this.shareForm.controls.sharingUsers.value.map(({ id }) => id);
    this.shareService.shareViewConfig(this.viewConfig.id, idsUsers);
  }*/
}

