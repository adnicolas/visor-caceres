import { Component, Input, Output, EventEmitter, ViewChild, forwardRef } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { FileUpload } from 'primeng/primeng';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

// tslint:disable:no-use-before-declare
export const INPUTFILE_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFileComponent),
  multi: true
};




/**
 * componente para subir archivos
 *
 * @export
 * @class FileUploadComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'the-input-file',
  templateUrl: './input-file.component.html',
  styleUrls: ['./input-file.component.scss'],
  providers: [INPUTFILE_VALUE_ACCESSOR]

})
export class InputFileComponent extends ParentComponent implements ControlValueAccessor {

  @Input() name: string = null;
  @Input() file: File;
  @Input() cancelIcon = 'pi pi-times';
  @Input() cancelText = '';

  /**
   * Pattern to restrict the allowed file types such as "image/*".
   *
   * @type {string}
   * @memberOf FileUploadComponent
   */
  @Input() accept: string = 'false';
  @Input() maxFileSize: number = environment.file_sizes.zip_max_size;
  /**
   * Indica si muestar el boton de upload. Se usa para ocultar el boton
   * y ejecutar el método upload dedse otro evento
   *
   * @type {boolean}
   * @memberOf FileUploadComponent
   */
  @Input() disabled: boolean = false;
  @Output() fileChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild(FileUpload) private fileUpload: FileUpload;

  // tslint:disable-next-line:ban-types
  propagateChange: Function = (value: any) => { };
  // tslint:disable-next-line:ban-types
  propagateTouched: Function = () => { };


  constructor() {
    super();
  }

  // Métodos para implementar el interfaz ControlValueAccessor
  writeValue(value: any): void {
    if (value !== undefined) this.file = value;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  public clear() {
    this.fileUpload.clear();

    this.name = null;
    this.file = null;
    this.propagateChange(this.file);
    this.fileChanged.emit(this.file);
    this.disabled = false;

  }


  public setFile($event) {
    this.file = $event.files[0];
    this.name = $event.files[0].name;
    this.propagateChange(this.file);
    this.fileChanged.emit(this.file);

  }

  public getFile() {
    return this.file;
  }


}

