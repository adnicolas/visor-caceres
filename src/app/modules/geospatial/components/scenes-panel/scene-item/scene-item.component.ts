import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as ol from 'openlayers';
import { takeUntil } from 'rxjs/operators';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsLayerImage } from '@cotvisor/models/vs-layer-image';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { environment } from 'src/environments/environment';
import { ScenesService } from '@geospatial/components/scenes-panel/services/scenes.service';
import { Scene } from '@geospatial/classes/scene';

@Component({
  selector: 'gss-scene-item',
  templateUrl: 'scene-item.component.html',
  styleUrls: ['scene-item.component.scss']
})
// TODO heredar de Tierra3ParentComponent
// TODO  las imágenes seleccionadas deberían quedar debajo de la capa que contiene los AOI
export class SceneItemComponent extends ParentComponent implements OnInit, OnDestroy {

  @Input() scene: Scene;
  public map: VsMap;
  public active: boolean = false;
  private overlayLayer: ol.layer.Vector;
  private wktFormat: ol.format.WKT;

  private imageLayer: VsLayerImage;
  constructor(private mapService: VsMapService, private sceneService: ScenesService) {
    super();
    // Suscribimos el cambio de mapa activo
    this.mapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((vsMap) => {
        if (vsMap) {
          this.map = vsMap;
          this.createOverlayLayer();
        }
      });
    this.wktFormat = new ol.format.WKT();
  }


  public ngOnInit() {
    // Subscribimos al cambio de escenas seleccionadas
    this.sceneService.selectedScenes$.pipe(takeUntil(this.unSubscribe))
      .subscribe((scenes) => {
        this.active = scenes.some(scene => (scene.id === this.scene.id && scene.satelliteName === this.scene.satelliteName));
      });
  }

  /**
   * Al eliminar el componente elimino también la capa overlay
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @memberof SceneItemComponent
   */
  public ngOnDestroy() {
    super.ngOnDestroy();
    this.overlayLayer.getSource().clear();
    this.overlayLayer.setMap(null);
  }

  /**
   * Capa para mostrar la geometria de la imagen sobre el mapa (igual que landviewer)
   *
   * @private
   * @memberof SceneItemComponent
   */
  private createOverlayLayer() {
    this.overlayLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
      style: [
        // AREAS
        new ol.style.Style({
          fill: new ol.style.Fill({
            color: environment.colors.tertiary + environment.colors.transparency.high,
          }),
          stroke: new ol.style.Stroke({
            color: environment.colors.primary,
            width: 3,
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: environment.colors.primary,
            }),
          }),
        }),
      ],
    });
    this.overlayLayer.setMap(this.map);
  }


  /**
   * Mostrar el extent del scene
   *
   * @param {*} scene
   * @memberof SceneItemComponent
   */
  public showTileGeometry() {
    const features = this.wktFormat.readFeatures(this.scene.geometryWKT, {
      dataProjection: 'EPSG:4326',
      featureProjection: this.map.getView().getProjection()
    });
    // polygon.transform('EPSG:4326', 'EPSG:3857');
    // ol 3.5 https://stackoverflow.com/questions/27210362/open-layers-3-how-to-draw-a-polygon-programmatically
    this.overlayLayer.getSource().addFeatures(features);
  }


  /**
   * Limpiar la capa de los extents de los scenes
   *
   * @memberof SceneItemComponent
   */
  public hideTileGeometry() {
    this.overlayLayer.getSource().clear();
  }


  /**
   *  Funcion que dispara al hacer click sobre el scene-item.
   *
   * @memberof SceneItemComponent
   */
  public toggleScene() {
    this.active = !this.active;
    if (this.active) {
      // Cargar la imagen
      this.imageLayer = new VsLayerImage({
        name: this.scene.id,
        title: this.scene.id,
        projection: this.map.getView().getProjection().getCode(),
        opt_options: {
          img: this.scene.thumbnail,
          extent: this.overlayLayer.getSource().getExtent(),
          visible: true,
          isTopLayer: true
        }
      });
      // La añade al servicio de escenas seleccionadas
      this.sceneService.addSelectedScene(this.scene, this.imageLayer);
    } else {
      // La quita del servicio de escenas seleccionadas
      this.sceneService.removeSelectedScene(this.scene);
    }
  }
}
