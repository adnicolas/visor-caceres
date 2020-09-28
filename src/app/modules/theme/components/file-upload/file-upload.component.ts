import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { FileUpload } from 'primeng/primeng';


/**
 * componente para subir archivos
 *
 * @export
 * @class FileUploadComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'the-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],

})
export class FileUploadComponent extends ParentComponent implements OnInit {
  @Input() name: string = null;
  @Input() customUpload: boolean = true; // uses upload event instead of defining url in template

  /**
   * Pattern to restrict the allowed file types such as "image/*".
   *
   * @type {string}
   * @memberOf FileUploadComponent
   */
  @Input() accept: string = 'false';
  @Input() multiple: boolean = false;
  @Input() maxFileSize: number = environment.file_sizes.zip_max_size;
  @Input() chooseLabel: string = null;
  /**
   * Indica si muestar el boton de upload. Se usa para ocultar el boton
   * y ejecutar el método upload dedse otro evento
   *
   * @type {boolean}
   * @memberOf FileUploadComponent
   */
  @Input() showUploadButton: boolean = true;
  @Input() uploadLabel: string = null;
  @Input() cancelLabel: string = null;
  @Input() disable: boolean = false;
  @Output() uploadEvent: EventEmitter<any> = new EventEmitter();
  @Output() fileChangedEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild(FileUpload) private fileUpload: FileUpload;

  public uploadedFiles: any[] = [];
  constructor() {
    super();
  }

  ngOnInit() {

  }

  public onUploadEvent(event) {
    this.uploadEvent.emit(event);
  }
  public fileChanged(event) {
    this.fileChangedEvent.emit(event);
  }

  public clear() {
    this.fileUpload.clear();
  }


  public upload() {
    this.fileUpload.upload();
  }

}
