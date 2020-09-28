import { Injectable } from '@angular/core';
import { ParentService } from './parent.service';
import { BehaviorSubject, Observable } from 'rxjs';
import * as ol from 'openlayers';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { environment } from 'src/environments/environment';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsMapService } from './vs-map.service';
/**
 * Servicio que devuelve las capas base .
 * Obtiene el json con las opciones para crear las capas base del endpoint configurado
 *
 * @export
 * @class AreaSelectionService
 * @extends {ParentService}
 */
@Injectable({
  providedIn: 'root'
})
export class AreaSelectionService extends ParentService {

  private areaSubject = new BehaviorSubject<ol.Feature[]>([]);
  // Capas vectoriales de seleccion de los distintos mapas
  private mapsAreaSelectionLayers: VsLayerVector[] = [];
  // Capa vectorial actual
  private currentAreaSelectionLayer: VsLayerVector;

  constructor(private mapService: VsMapService) {
    super();
  }

  /**
   * Retorna el area actualmente seleccionada
   *
   * @returns {Observable<ol.Feature[]>}
   *
   * @memberOf AreaSelectionService
   */
  public getArea(): Observable<ol.Feature[]> {
    return this.areaSubject.asObservable();
  }

  /**
   * Establece el area en el servicio
   *
   * @param {ol.Feature[]} area
   *
   * @memberOf AreaSelectionService
   */
  public setArea(area: ol.Feature[]) {
    this.areaSubject.next(area);
  }

  /**
   * Establece el area en el mapa añadiendo las features y en el servicio
   *
   * @param {ol.Feature[]} area
   *
   * @memberOf AreaSelectionService
   */
  public setAreaToActiveMap(area: ol.Feature[]) {
    this.currentAreaSelectionLayer.olInstance.getSource().clear();
    this.currentAreaSelectionLayer.olInstance.getSource().addFeatures(area);
    this.mapService.getActiveMap().getView().fit(this.currentAreaSelectionLayer.olInstance.getSource().getExtent(), { duration: environment.map_view.animations.travel_duration });
    this.setArea(area);
  }

  /**
   *  Retorna la capa de selección de área para el mapa o crea una nueva si aún no existe
   *
   * @param {VsMap} map
   * @returns
   *
   * @memberOf AreaSelectionService
   */
  public getAreaSelectionVectorLayer(map: VsMap) {
    let layerVector: VsLayerVector;
    if (!this.mapsAreaSelectionLayers.hasOwnProperty(map.name)) {
      layerVector = this.newVectorLayer(map.getView().getProjection().getCode());
      this.mapsAreaSelectionLayers[map.name] = layerVector;
      map.addVsLayer(layerVector);
    } else {
      layerVector = this.mapsAreaSelectionLayers[map.name];
    }
    this.currentAreaSelectionLayer = layerVector;
    return layerVector;
  }

  /**
   * Crea una nueva capa de tipo VsLayerVector con el estilo apropiado para dibujar sobre el mapa
   *
   * @returns {VsLayerVector}
   * @memberof ToolAreaSelectorComponent
   */
  private newVectorLayer(mapProyection: string): VsLayerVector {
    const vector = new VsLayerVector({
      name: 'AreaSelector',
      title: 'Area Selector',
      projection: mapProyection,
      opt_options: {
        isTopLayer: true
      }
    });
    vector.olInstance.setStyle(new ol.style.Style({
      fill: new ol.style.Fill({
        color: environment.colors.secondary + environment.colors.transparency.high,
      }),
      stroke: new ol.style.Stroke({
        color: environment.colors.secondary,
        width: 3,
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: environment.colors.primary,
        }),
      }),
    }));
    return vector;
  }

}
