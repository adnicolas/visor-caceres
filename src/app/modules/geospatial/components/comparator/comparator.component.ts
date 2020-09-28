import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as ol from 'openlayers';
import { environment } from 'src/environments/environment';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { VsMapService } from '@cotvisor/services/vs-map.service';

/**
 * Componente que muestra múltiples mapas con movimiento y zoom sincronizados,
 * configurables por el usuario. Permite seleccionar el mapa activo y cargar en él capas para su comparación
 *
 * @author Centro de Observación y Teledetección Espacial, S.L.U.
 * @export
 * @class ComparatorComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'gss-comparator',
  templateUrl: './comparator.component.html',
  styleUrls: ['./comparator.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ComparatorComponent extends ParentComponent implements OnInit, OnDestroy {

  public maps: VsMap[] = [];
  public mapsReady: boolean = false;
  @Input() public numberColumns: number = 2;
  @Input() public numberRows: number = 2;
  @Input() public maxColumns: number = 3;
  @Input() public maxRows: number = 3;

  public markerFeature: ol.Feature;
  public markerVector: VsLayerVector;
  public sharedView: ol.View;
  public mapConfig: any;
  protected leftButtonDisabled: boolean = false;
  protected rightButtonDisabled: boolean = false;

  @ViewChild('zoomControl') public zoomControl: ElementRef;
  @ViewChild('scaleControl') public scaleControl: ElementRef;

  constructor(private vsMapService: VsMapService, public elementRef: ElementRef) {
    super();
  }

  public ngOnInit(): void {
    this.createMarkerVector();
    this.setMapConfig();
    this.loadMaps();
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    for (const map of this.maps) {
      this.removeMap(map);
    }
    // this.vsMapService.resizeAllMaps();
  }
  public increaseRows() {
    if (this.numberRows < this.maxRows) {
      ++this.numberRows;
      this.loadMaps();
    }
  }

  public increaseColumns() {
    if (this.numberColumns < this.maxColumns) {
      ++this.numberColumns;
      this.loadMaps();
    }
  }

  public deacreseRows() {
    if (this.numberRows > 1) {
      --this.numberRows;
      this.loadMaps();
    }
  }

  public deacreseColumns() {
    if (this.numberColumns > 1) {
      --this.numberColumns;
      this.loadMaps();
    }
  }

  public toggleCursorTraking(event) {
    this.markerVector.setVisible(event);
  }

  private loadMaps() {
    const totalMaps = this.numberColumns * this.numberRows;
    if (totalMaps < this.maps.length) {
      const removeMaps = this.maps.splice(totalMaps, this.maps.length - 1);
      for (const map of removeMaps) {
        this.removeMap(map);
      }
      setTimeout(() => { this.maps.forEach(map => map.updateSize()); }, 20);
    } else {
      const promises = [];
      const newTotalMaps = totalMaps - this.maps.length;
      for (let i = 0; i < newTotalMaps; i++) {
        promises.push(this.vsMapService.newMap(this.mapConfig));
      }
      Promise.all(promises)
        .then(
          (maps: VsMap[]) => {
            if (!this.maps.length && maps.length) {
              this.sharedView = maps[0].getView();
            }
            if (maps.length) {
              for (const map of maps) {
                map.setView(this.sharedView);
                map.addVsLayer(this.markerVector);
                map.on('pointermove', this.pointerMove);
              }
              setTimeout(() => { this.maps.forEach(map => map.updateSize()); }, 20);
              this.maps = [...this.maps, ...maps];
              // setTimeout(() => { this.vsMapService.resizeAllMaps(); }, 20);
            }
            this.mapsReady = true;
          }).catch((err) => console.error(err));
    }
  }

  private createMarkerVector() {

    const iconStyle = new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: 'assets/icons/punto_de_mira_negro_blanco.png',
      })),
    });

    this.markerFeature = new ol.Feature({
      geometry: new ol.geom.Point([0, 0]),
    });

    this.markerFeature.setStyle(iconStyle);

    const vectorSource = new ol.source.Vector({
      features: [this.markerFeature],
    });

    const olLayerInstance = new ol.layer.Vector({
      source: vectorSource,
      visible: false
    });
    this.markerVector = new VsLayerVector({
      name: 'punto_de_mira',
      title: 'Punto de mira',
      projection: environment.map_view.default_projection,
      opt_options: {
        queryable: false,
        isTopLayer: true,
        olInstance: olLayerInstance,
        visible: false
      },
    });
  }

  private pointerMove = (evt: ol.MapBrowserEvent) => {
    this.markerFeature.setGeometry(new ol.geom.Point([evt.coordinate[0], evt.coordinate[1]]));
  }

  private removeMap(map) {
    map.un('pointermove', this.pointerMove);
    this.vsMapService.removeMap(map);
  }

  private setMapConfig() {
    const zoomSlider = new ol.control.ZoomSlider();
    zoomSlider.setTarget(this.zoomControl.nativeElement);
    this.mapConfig = {
      map: {

        renderer: 'canvas',
        target: 'ol-map-div',
        view: new ol.View(
          {
            projection: environment.map_view.default_projection,
            center: [environment.map_view.map_center[0], environment.map_view.map_center[1]],
            minZoom: environment.map_view.view_constraints.min_zoom,
            zoom: environment.map_view.initial_zoom,
            extent: [
              environment.map_view.view_constraints.max_extent[0],
              environment.map_view.view_constraints.max_extent[1],
              environment.map_view.view_constraints.max_extent[2],
              environment.map_view.view_constraints.max_extent[3],
            ],

          }
        ),

        baselayer: new ol.layer.Tile({
          source: new ol.source.OSM(),
        }),
        controls: [new ol.control.ScaleLine({ target: this.scaleControl.nativeElement }), zoomSlider],
      }
    };
  }

}
