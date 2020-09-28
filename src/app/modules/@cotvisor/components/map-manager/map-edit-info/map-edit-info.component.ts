import { Component, OnInit, ViewChild } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserMapModel } from '@cotvisor-admin/models';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';
import { takeUntil } from 'rxjs/operators';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ToastService } from '@theme/services/toast.service';

/**
 * Componente para editar la información del mapa
 *
 * @export
 * @class EditMapInfoModalComponent
 * @extends {ParentComponent}
 */
@Component({
  selector: 'cot-map-edit-info',
  templateUrl: 'map-edit-info.component.html',
  styleUrls: ['map-edit-info.component.scss']
})
export class MapEditInfoComponent extends ParentComponent implements OnInit {

  public userMapSource: UserMapModel;
  public vsMapUserMap: VsMapUserMap;
  public mapInfo: UserMapModel;
  public mapAvatar: string;
  public mapForm: FormGroup;
  public showPasswordForm: boolean = false;
  @ViewChild('editMapForm') public editMapForm: NgForm;

  constructor(
    private toastService: ToastService,
    public dynamicDialogRef: DynamicDialogRef,
    public dynamicDialogConfig: DynamicDialogConfig,
    private vsMapService: VsMapService,
    private fb: FormBuilder) {
    super();

    this.createMapForm();
  }

  public ngOnInit() {
    this.vsMapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((vsMap: VsMapUserMap) => {
        if (vsMap) {
          this.vsMapUserMap = vsMap;
          this.userMapSource = vsMap.userMapSource;
          this.getUserMapModelAttributes();
        }
      });

    // Si lo solicitamos vendrá ya como sucio para poder guardarlo
    if (this.dynamicDialogConfig.data && this.dynamicDialogConfig.data.createNew) {
      this.mapForm.markAsDirty();
      this.mapInfo.hasPassword = false;
      this.mapInfo.password = null;
    }
  }

  public closeModal() {
    this.dynamicDialogRef.close({ saved: false });
  }

  public passwordToggleChange() {
    this.showPasswordForm = !this.showPasswordForm;
    if (!this.showPasswordForm) {
      this.mapInfo.password = this.userMapSource.password;
      this.mapInfo.hasPassword = this.userMapSource.hasPassword;
      this.mapForm.controls.password.markAsUntouched();
      this.mapForm.controls.confirmPassword.markAsUntouched();
      this.mapForm.controls.confirmPassword.setValue(null);
      this.mapForm.controls.password.disable();
      this.mapForm.controls.confirmPassword.disable();
    } else {
      this.mapForm.controls.password.enable();
      this.mapForm.controls.confirmPassword.enable();
      this.mapInfo.hasPassword = true;
    }
  }

  protected removePassword() {
    this.mapInfo.password = null;
    this.mapInfo.hasPassword = false;
    this.mapForm.markAsDirty();
  }

  public saveUserMapModelAttributes() {
    this.userMapSource.name = this.mapInfo.name;
    this.userMapSource.img = this.userMapSource.img;
    this.userMapSource.changePassword = this.mapInfo.password !== this.userMapSource.password;
    this.userMapSource.password = this.mapInfo.password;
    this.userMapSource.description = this.mapInfo.description;
    this.userMapSource.public = this.mapInfo.public;
    this.userMapSource.hasPassword = this.mapInfo.hasPassword || this.userMapSource.password != null;
    this.dynamicDialogRef.close({ saved: true, userMapSource: this.userMapSource });
  }

  private getUserMapModelAttributes() {
    this.mapInfo = new UserMapModel();
    this.mapInfo.name = this.userMapSource.name;
    this.mapInfo.img = this.userMapSource.img;
    this.mapInfo.password = this.userMapSource.password;
    this.mapInfo.hasPassword = this.userMapSource.hasPassword;
    if (!this.showPasswordForm) {
      // Desactivo la validación de los campos de contraseña
      this.mapForm.controls.password.disable();
      this.mapForm.controls.confirmPassword.disable();
    }
    this.mapInfo.description = this.userMapSource.description;
    this.mapInfo.public = this.userMapSource.public;
    // FIXME problemas del tainted canvas
    this.vsMapUserMap.generateMapThumbnail()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (imgData) => this.mapAvatar = imgData
        ,
        (error) => {
          setTimeout(() => {
            this.toastService.showWarning({ summary: 'Imagen del mapa', detail: 'Por restricciones de seguridad no se puede obtener la imagen del mapa, se usará la imagen por defecto' });
          }, 0);
          this.mapAvatar = environment.default_visor_map_image;
        }
      );

  }

  private createMapForm() {
    this.mapForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      public: ['', Validators.required],
      password: ['', Validators.compose([Validators.required,
        // Validators.minLength(6), Validators.maxLength(14),
        // Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,14}$')
      ])],
      confirmPassword: ['', Validators.required],
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }


  private matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {
      [key: string]: any
    } => {
      const password = group.controls[passwordKey];
      const confirmPassword = group.controls[confirmPasswordKey];
      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true,
        };
      }
    };
  }

}
