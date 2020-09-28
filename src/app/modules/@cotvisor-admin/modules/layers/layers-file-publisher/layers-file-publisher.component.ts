import { Component, ViewChild } from '@angular/core';
import { LayersService } from '@cotvisor-admin/services';
import { LayerModel } from '@cotvisor-admin/models';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { FileUploadComponent } from '@theme/components/file-upload/file-upload.component';
import { LayerFilePublisherModeler } from '@cotvisor/classes/utils/layer-file-publisher-modeler.class';
import { PublisherLayerModel } from './publisher-layer.model';
import { Router } from '@angular/router';

@Component({
  selector: 'cot-layers-file-publisher',
  templateUrl: './layers-file-publisher.component.html',
  styleUrls: ['./layers-file-publisher.component.scss']
})
export class LayersFilePublisherComponent extends ParentComponent {

  @ViewChild('fileLoader') fileLoader: FileUploadComponent;

  public layer: LayerModel;
  public layerForm: FormGroup;
  public filesAcepted = 'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip';
  public propoposedlayerName: string;
  public loading = false;
  public geomFile: File;
  private layerFilePublisherModeler: LayerFilePublisherModeler;



  constructor(public layersService: LayersService, private formBuilder: FormBuilder, private router: Router) {
    super();
    this.layer = new LayerModel();
    this.layerForm = this.formBuilder.group({
      name: [this.layer.name, Validators.required],
      geomFile: [this.layer.name, Validators.required]
    });

  }




  publish() {
    this.loading = true;
    this.layerFilePublisherModeler = new LayerFilePublisherModeler();
    this.layerFilePublisherModeler.read(this.geomFile, this.layerForm.controls.name.value)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(publisherLayer => this.publishFeatures(publisherLayer));

  }


  private publishFeatures(publisherLayer: PublisherLayerModel) {
    this.layersService.publishLayerFromfile(publisherLayer)
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((newLayer) => {
        this.loading = false;
        this.router.navigate(['/capas', newLayer.id]);
      }
      );
  }

  /**
   * A partir de las featires leídas del archivos se mapean al modelo necesario para publicar
   *
   * @private
   * @param {ol.Feature[]} filefeatures
   * @returns {PublisherFeatureModel[]}
   *
   * @memberOf LayersFilePublisherComponent
   *
   */
  public changeFile(file: File): void {

    if (file) {
      if (file.size > environment.file_sizes.zip_max_size) {
        this.geomFile = null;
      } else {
        this.layerForm.controls.name.setValue(file.name.replace(/\.[^/.]+$/, ''));
        this.geomFile = file;
      }
    } else {
      this.layerForm.controls.name.setValue('');
      this.geomFile = null;
    }
  }


}
