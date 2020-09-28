import * as ol from 'openlayers';
import proj4 from 'proj4';
import { Component, Input, AfterViewInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { LayersService } from '@cotvisor-admin/services';
import { ToastService } from '@theme/services/toast.service';
import { takeUntil } from 'rxjs/operators';
import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { Router } from '@angular/router';
import { LayerModel, CategoryModel } from '@cotvisor-admin/models';
import { ResourceTypes } from '@cotvisor-admin/classes/resource-types.enum';
import { ResourceActions } from '@cotvisor-admin/classes/resource-actions.enum';

const LAYER_LIST_URL = '/capas';

@Component({
  selector: 'cot-layers-detail',
  templateUrl: './layers-detail.component.html',
  styleUrls: ['./layers-detail.component.scss'],
})
export class LayersDetailComponent extends ParentComponent implements AfterViewInit {


  // @ViewChild('tagInput') public tagInput: Searchbar;
  @Input() public addMode?: boolean = false;
  // @ViewChild('layerForm') public layerForm: NgForm;
  public previewOlMap: ol.Map;
  public languagesFlagsSrcArray: string[] = [];
  protected layer: LayerModel;
  private languagesCodesArray: string[] = [];
  public categories: CategoryModel[];
  public layers: LayerModel[];
  public tabs: MenuItem[];
  public activeTab: MenuItem;
  protected targetLayer: LayerModel;
  protected isReplaceLayerActive: boolean = false;
  private layerExtent: ol.Extent;
  public resourceTypes = ResourceTypes;
  public resourceActions = ResourceActions;
  constructor(
    private confirmDialogService: ConfirmDialogService,
    private layersService: LayersService,
    private toastService: ToastService,
    private router: Router
  ) {
    super();

    // importación de proyecciones. Al no usar vsMapService no se inicializan si no se hace aquí
    ol.proj.setProj4(proj4);
    for (const projection of environment.all_app_projections) {
      proj4.defs(projection.code, projection.proj4_def);
    }

    this.tabs = [
      {
        id: 'datos',
        icon: 'pi pi-info-circle',
        command: () => {
          this.changeActiveTab('datos');
        }
      },
      {
        id: 'compartir',
        icon: 'pi pi-share-alt',
        command: () => {
          this.changeActiveTab('compartir');
        }
      },
    ];
    this.activeTab = this.tabs[0];
    this.onComponentLiteralsChange
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(() => {
        this.tabs[0].label = this.componentLiterals['GLOBAL.INFO'];
        this.tabs[1].label = this.componentLiterals['GLOBAL.SHARE'];

      });
    this.useLiterals([
      'GLOBAL.INFO',
      'GLOBAL.SHARE',
      'LAYER_DETAIL.DELETE_LAYER_QUESTION',
      'LAYER_DETAIL.DELETE_LAYER_SUCCESS',
      'LAYER_DETAIL.DELETE_LAYER'
    ]);
  }

  /**
   * Setter layer
   * @param {LayerModel} value
   */
  @Input('layer')
  public set $layer(value: LayerModel) {
    this.layer = value;
    if (this.layer) {
      // @ADR: Para 4326 vienen al revés
      this.layerExtent = this.layer.projection === 'EPSG:4326' ?
        [this.layer.bboxMinY, this.layer.bboxMinX, this.layer.bboxMaxY, this.layer.bboxMaxX] :
        [this.layer.bboxMinX, this.layer.bboxMinY, this.layer.bboxMaxX, this.layer.bboxMaxY];
      this.convertLanguagesStringToArray(this.layer.languages);
    }
  }

  ngAfterViewInit(): void {
    if (this.layer.service) {
      this.previewOlMap = new ol.Map(this.getOlPreviewMapConfig());
      const previewOlLayer = this.getOlPreviewLayer();
      this.previewOlMap.addLayer(previewOlLayer);
      this.previewOlMap.getView().fit(previewOlLayer.getExtent());
    }
  }

  /**
   * Converts a string of laguanges (e.g. "ES,PT" ) to an array of strings (["ES","PT"])
   *
   * @private
   * @param {*} arrayString
   * @memberof LayersDetailComponent
   */
  private convertLanguagesStringToArray(languagesString) {

    if (languagesString) {
      this.languagesCodesArray = languagesString.split(',');
      this.languagesCodesArray.forEach(
        langCode =>
          this.languagesFlagsSrcArray.push(`https://www.countryflags.io/${langCode}/flat/24.png`)
      );

    }

  }


  /**
   * Llamada a servicio de eliminar capa tras pedir confirmación
   *
   * @memberof LayersDetailComponent
   */
  public deleteLayer() {
    this.confirmDialogService.open({
      message: this.componentLiterals['LAYER_DETAIL.DELETE_LAYER_QUESTION'],
      header: this.componentLiterals['LAYER_DETAIL.DELETE_LAYER'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // eliminar capa
        this.layersService.delete(this.layer.id)
          .subscribe(
            _success => {
              this.toastService.showSuccess({ summary: this.componentLiterals['LAYER_DETAIL.DELETE_LAYER_SUCCESS'], detail: '' });
              this.router.navigateByUrl(LAYER_LIST_URL);
            });
      },
      reject: () => { }
    });
  }

  /**
   * Método llamado al cambiar de pestaña para conocer la pestaña activa
   *
   * @private
   * @param {string} activeTab
   *
   * @memberOf LayersDetailComponent
   */
  private changeActiveTab(activeTab: string) {
    this.activeTab = this.tabs.find((tab) => tab.id === activeTab);
  }

  private getOlPreviewMapConfig(): any {

    // zoomSlider.setTarget(this.zoomControl.nativeElement);


    return {
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      target: 'preview-map',

      // view: new ol.View({
      //     projection: environment.map_view.default_projection,
      //     center: [environment.map_view.map_center[0], environment.map_view.map_center[1]],
      //     minZoom: environment.map_view.view_constraints.min_zoom,
      //     zoom: environment.map_view.initial_zoom,
      //     extent: [
      //         environment.map_view.view_constraints.max_extent[0],
      //         environment.map_view.view_constraints.max_extent[1],
      //         environment.map_view.view_constraints.max_extent[2],
      //         environment.map_view.view_constraints.max_extent[3],
      //     ],
      // }),
      view: new ol.View({
        projection: this.layer.projection,
        extent: this.layerExtent
      }),
      renderer: 'canvas',

      controls: [new ol.control.Zoom()],

    };
  }

  // tslint:disable-next-line:align
  private getOlPreviewLayer(): ol.layer.Layer {


    switch (this.layer.service.type) {
      case 'WMS':
        return new ol.layer.Image({
          // @ts-ignore
          extent: this.layerExtent,
          source: new ol.source.ImageWMS({
            projection: this.layer.projection,
            url: this.layer.service.url,
            params: { LAYERS: this.layer.name },
          })
        });
      case 'WFS':
        const option = this.layer.service.url.indexOf('?') > -1 ? this.layer.service.url.split('?')[1] ? '&' : '' : '?';
        // const vectorSource = new ol.source.Vector({

        //     format: new ol.format.GeoJSON(
        //         //     {
        //         //     defaultDataProjection: this.layer.projection,
        //         //     featureProjection: environment.map_view.default_projection,
        //         //     // @ts-ignore
        //         //     extractGeometryName: true
        //         // }
        //     ),
        //     url: (extent) => {
        //         const url = `${this.layer.service.url}${option}service=WFS&` +
        //             `version=1.1.0&request=GetFeature&typename=${this.layer.name}&` +
        //             `outputFormat=application/json&srsname=${environment.map_view.default_projection}&` +
        //             `bbox=${extent.join(',')},${environment.map_view.default_projection}`;
        //         return url;
        //     },
        //     strategy: ol.loadingstrategy.bbox
        // });


        // const format = new ol.format.GeoJSON({
        //     // @ts-ignore
        //     extractGeometryName: true
        // });

        // const vectorSource = new ol.source.Vector(({
        //     format,
        //     loader: (extent, resolution, projection) => {
        //         const proj = projection.getCode();
        //         const reprojectedExtent = ol.proj.transformExtent(
        //             extent,
        //             projection,
        //             this.layer.projection,
        //         );

        //         const getFeatureUrl = this.layer.service.url +
        //             option +
        //             'request=GetFeature&version=1.1.0' +
        //             '&service=WFS' +
        //             '&typename=' +
        //             this.layer.name +
        //             '&outputFormat=' +
        //             'application/json' +
        //             '&srsname=' +
        //             this.layer.projection +
        //             '&bbox=' + reprojectedExtent.join(',') + ',' + this.layer.projection;

        //         const url = Utilities.proxyfyURL(getFeatureUrl);

        //         const xhr = new XMLHttpRequest();
        //         xhr.open('GET', url);
        //         const onError = () => {
        //             // @ts-ignore
        //             vectorSource.removeLoadedExtent(extent);
        //         };
        //         xhr.onerror = onError;
        //         xhr.onload = () => {
        //             if (xhr.status === 200) {
        //                 const response = xhr.responseText;
        //                 vectorSource.addFeatures(
        //                     format.readFeatures(response, {
        //                         dataProjection: this.layer.p,
        //                         featureProjection: proj,
        //                     }),
        //                 );
        //             } else {
        //                 onError();
        //             }
        //         };
        //         xhr.send();
        //     },
        //     strategy: ol.loadingstrategy.bbox,

        // }));

        const vectorSource = new ol.source.Vector({
          format: new ol.format.GeoJSON({
            // Default data projection. Default is EPSG:4326.
            defaultDataProjection: this.layer.projection,
            // Projection for features read or written by the format
            featureProjection: this.layer.projection,
            // @ts-ignore
            extractGeometryName: true

          }),
          // Pedimos los datos en la proyección original de la capa, posteriormente en el format se hace al conversion al src del mapa
          url: `${this.layer.service.url}${option}service=WFS&` +
            `version=1.1.0&request=GetFeature&typename=${this.layer.name}&` +
            `outputFormat=application/json&srsname=${this.layer.projection}`
          ,
          strategy: ol.loadingstrategy.all
        });

        return new ol.layer.Vector({
          source: vectorSource,
          // @ts-ignore
          extent: this.layerExtent,
          style: new ol.style.Style({
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 255, 1.0)',
              width: 2
            })
          })
        });
    }


  }
}

