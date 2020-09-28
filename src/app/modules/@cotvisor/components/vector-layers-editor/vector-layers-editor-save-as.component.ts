import { Component, Input } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsLayer } from '@cotvisor/models/vs-layer';
import * as JSZip from 'jszip';
import * as ol from 'openlayers';
import * as shpWriter from 'shp-write';
import * as togpx from 'togpx';
import * as FileSaver from 'file-saver';
import { MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'cot-vector-layers-editor-save-as',
  templateUrl: './vector-layers-editor-save-as.component.html'
})

export class VectorLayersEditorSaveAsComponent extends ParentComponent {
  @Input() vsLayer: VsLayer;
  @Input() layerProjection: string;
  @Input() disabled: boolean = false;

  saveAsMenu: MenuItem[];


  constructor() {
    super();
    // recoge traducciones
    this.useLiterals(['LAYER_EDITOR.FORMAT_SAVE']);

    this.saveAsMenu = [
      {
        label: this.componentLiterals['LAYER_EDITOR.FORMAT_SAVE'],
        items: [
          { label: 'GeoJson', command: () => this.saveAsGeoJSON() },
          { label: 'SHP', command: () => this.saveAsSHP() },
          { label: 'KML', command: () => this.saveAsKML() },
          { label: 'GML', command: () => this.saveAsGML() },
          { label: 'GPX', command: () => this.saveAsGPX() }]
      }
    ];

    this.onComponentLiteralsChange
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(() => {
        this.saveAsMenu[0].label = this.componentLiterals['LAYER_EDITOR.FORMAT_SAVE'];
      });


  }


  /**
   * [saveAsGeoJSON description]
   * @return {[type]} [description]
   */
  protected saveAsGeoJSON() { // tslint:disable-line
    const content = new ol.format.GeoJSON().writeFeatures(this.vsLayer.olInstance.getSource().getFeatures(),
      { dataProjection: 'EPSG:4326', featureProjection: this.layerProjection });
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(blob, this.vsLayer.title + '.json');
  }

  /**
   * [saveAsSHP description]
   * @return {[type]} [description]
   */
  protected saveAsSHP() {
    const content = new ol.format.GeoJSON().writeFeaturesObject(this.vsLayer.olInstance.getSource().getFeatures(),
      { dataProjection: 'EPSG:4326', featureProjection: this.layerProjection });
    // shpWriter.download(content);
    /* Necesario para poder descargar el zip con el nombre de la capa*/
    const downloadLink = document.createElement('a');
    downloadLink.download = this.vsLayer.title + '.zip';
    downloadLink.href = 'data:application/zip;base64,' + shpWriter.zip(content);
    downloadLink.onclick = this.destroyClickedElement;
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  /**
   * [saveAsKML description]
   * @return {[type]} [description]
   */
  protected saveAsKML() {
    const content = new ol.format.KML().writeFeatures(this.vsLayer.olInstance.getSource().getFeatures(),
      { dataProjection: 'EPSG:4326', featureProjection: this.layerProjection });
    const blob = new Blob([content], {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(blob, this.vsLayer.title + '.kml');
  }

  /**
   * Guarda una capa en formato KMZ
   *
   * @protected
   * @memberof PopoverSaveAsComponent
   */
  protected saveAsKMZ() {
    const content = new ol.format.KML().writeFeatures(this.vsLayer.olInstance.getSource().getFeatures(),
      { dataProjection: 'EPSG:4326', featureProjection: this.layerProjection });
    const zip = new JSZip();
    zip.file('doc.kml', content);
    FileSaver.saveAs(zip.generate({ type: 'blob' }), this.vsLayer.title + '.kmz');
  }

  /**
   * [saveAsGML description]
   * @return {[type]} [description]
   */
  protected saveAsGML() {// tslint:disable-line
    const header = '<?xml version="1.0" encoding="utf-8"?>\n<FeatureCollection>';
    const footer = '</FeatureCollection>';
    const content = new ol.format.GML({
      featureNS: 'http://www.geospatialSAI.es',
      featureType: 'gml',
      srsName: 'EPSG:4326',
    }).writeFeatures(this.vsLayer.olInstance.getSource().getFeatures(),
      { dataProjection: 'EPSG:4326', featureProjection: this.layerProjection });
    const blob = new Blob([header + content + footer], {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(blob, this.vsLayer.title + '.gml');
  }

  public saveAsGPX() {
    // convert ol.Feature[] to geoJSON because ol.Feature to GPX doesnt carry over Z values
    const geoJSONstring = new ol.format.GeoJSON().writeFeatures(this.vsLayer.olInstance.getSource().getFeatures(), {
      dataProjection: 'EPSG:4326',
      featureProjection: this.layerProjection,
    });
    // whereas geoJSON to GPX DOES cater for Z values
    const parsedGeoJSON = JSON.parse(geoJSONstring);
    const gpxString = togpx(parsedGeoJSON);

    const blob = new Blob([gpxString], { type: 'text/xml' });
    FileSaver.saveAs(blob, this.vsLayer.title + '.gpx');
  }

  private destroyClickedElement(event) {
    document.body.removeChild(event.target);
  }
}
