import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import * as ol from 'openlayers';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { ButtonItem } from '@theme/classes/button-item.class';
import { environment } from 'src/environments/environment';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { VsMap } from '@cotvisor/models/vs-map';
import { MeasureFeature } from './measure-feature';

// TODO @Adrián - Definir servicio de medidas para otro proyecto - permite mostrar medidas en otros componentes

/**
 * Herramienta de mapa para medir distancias/áreas
 *
 * @export
 * @class ToolMeasureComponent
 * @extends {AbstractParentToolSelectableComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'cot-tool-measure',
  templateUrl: './tool-measure.component.html',
  styleUrls: ['./tool-measure.component.scss']
})
export class ToolMeasureComponent extends AbstractParentToolSelectableComponent implements OnInit {
  @Input() direction: string = 'right';

  public measureLayers: {};
  public measureTooltip: ol.Overlay;
  public features: MeasureFeature[];
  public freeHand: boolean;
  public blockFreeHand: boolean;
  public drawing: boolean;
  public isMeasure: boolean;
  public isRemoving: boolean;
  public isExportToLayer: boolean;
  public measureArea: boolean;
  public featuresId: number;
  public distance: string;
  public totalDistance: string;
  public area: string;
  @ViewChild('mouseOverlay') public mouseOverlay: ElementRef;
  public map: VsMap;
  public CONFIG: any;
  public splitButtonItems: ButtonItem[] = [];
  private layerVector: VsLayerVector;
  private draw: ol.interaction.Draw;
  private select: ol.interaction.Select;
  private mapChange: Subject<boolean> = new Subject<boolean>();

  constructor() {
    super();
    this.isMeasure = false;
    this.isRemoving = false;
    this.isExportToLayer = false;
    this.features = [];
    this.featuresId = 1;
    this.drawing = false;
    this.measureLayers = {};
  }


  ngOnInit() {
    super.ngOnInit();
    this.splitButtonItems = [
      new ButtonItem({
        icon: 'fas fa-ruler-horizontal',
        toggleButton: true,
        command: () => { this.toggleMeasure(false); }
      }),
      new ButtonItem({
        icon: 'fas fa-ruler-combined',
        toggleButton: true,
        command: () => { this.toggleMeasure(true); }
      }),
      new ButtonItem({
        icon: 'fas fa-eraser',
        toggleButton: true,
        command: () => { this.toggleDelete(); }
      }),
      new ButtonItem({
        icon: 'fas fa-trash',
        command: () => {
          this.removeAll();
        }
      })
    ];
    // Asignamos las etiquetas del lenguaje activo y nos subscribimos a los cambios de idioma que se hagan
    this.onComponentLiteralsChange.pipe(takeUntil(this.unSubscribe)).subscribe(() => {
      this.splitButtonItems[0].label = this.componentLiterals['TOOLS.MEASURE_LINE'];
      this.splitButtonItems[1].label = this.componentLiterals['TOOLS.MEASURE_AREA'];
      this.splitButtonItems[2].label = this.componentLiterals['TOOLS.MEASURE_DELETE'];
      this.splitButtonItems[3].label = this.componentLiterals['TOOLS.REMOVE_ALL_MEASURES'];
    });
    this.useLiterals(['TOOLS.MEASURE_LINE', 'TOOLS.MEASURE_AREA', 'TOOLS.MEASURE_DELETE', 'TOOLS.REMOVE_ALL_MEASURES']);
  }

  /**
   * Asigna al overlay de ayuda la posición del cursor sobre el mapa.
   *
   * @private
   * @memberof ToolMeasureComponent
   */
  private showHelpMessage = (evt: ol.MapBrowserEvent) => {
    this.measureTooltip.setPosition(evt.coordinate);
  }

  /**
   * Implementación de metodo abstracto de AbstractParentToolSelectableComponent. Metodo de activación de la herramienta
   *
   * @memberof ToolMeasureComponent
   */
  public activateTool() {
    this.mapService.getActiveMap().activateTool(this);
    this.isActive = true;
  }

  /**
   * Implementación de metodo abstracto de AbstractParentToolSelectableComponent
   * Método de desactivación de la herramienta
   *
   * @memberof ToolMeasureComponent
   */
  public deactivateTool() {
    // desactivamos la heramienta en el mapa
    this.mapService.getActiveMap().deactivateTool();
    this.deactivateAll();
    this.isActive = false;
  }


  /**
   * Implementación del método abstracto de AbstracParentToolComponent
   * Es llamado después de cambiar el mapa activo
   * @memberof ToolMeasureComponent
   */
  public afterChangeActiveMap() {
    if (!this.measureLayers.hasOwnProperty(this.map.name)) {
      const newVector = this.newVectorLayer();
      this.measureLayers[this.map.name] = this.layerVector = newVector;
      this.map.addVsLayer(this.layerVector);
    } else {
      this.layerVector = this.measureLayers[this.map.name];
    }
    // Creo el overlay que se va moviendo junto al ratón
    this.measureTooltip = new ol.Overlay({
      element: this.mouseOverlay.nativeElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
    });
    this.map.addOverlay(this.measureTooltip);

    this.mapChange.next(true);
    // Subscripción al servicio del mapa que reproyecta las capas al vuelo
    this.map.observableMapViewChange$.pipe(takeUntil(this.mapChange)).subscribe(
      ([oldView, newView]) => {
        if (this.features) {
          this.features.forEach((measurefeature: MeasureFeature) =>
            measurefeature.reproyectFeatureAndOverlay(oldView.getProjection().getCode(),
              newView.getProjection().getCode()),
          );
        }
      });
  }

  /**
   * Implementación del método abstracto de AbstracParentToolComponent
   * Es llamado antes de cambiar el mapa activo
   * @memberof ToolMeasureComponent
   */
  public beforeChangeActiveMap() {
    this.isActive = false;
    // Desactivo todos los controles
    this.deactivateAll();
  }


  /**
   * Crea una nueva capa de tipo VsLayerVector con el estilo apropiado para dibujar sobre el mapa
   *
   * @returns {VsLayerVector}
   * @memberof ToolMeasureComponent
   */
  public newVectorLayer(): VsLayerVector {
    const vector = new VsLayerVector({
      name: 'Measure',
      title: 'Measure',
      projection: this.map.getView().getProjection().getCode(),
      opt_options: {
        isTopLayer: true
      }
    });
    vector.olInstance.setStyle([
      // AREAS
      new ol.style.Style({
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
      }),
      // LINEAS
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: environment.colors.primary,
          }),
        }),
        geometry: (feature) => {
          if (feature.getGeometry() instanceof ol.geom.LineString && !feature.get('freehand')) {
            const coordinates = (feature.getGeometry() as ol.geom.LineString).getCoordinates();
            return new ol.geom.MultiPoint(coordinates);
          }
        },
      }),
    ]);

    return vector;
  }



  /**
   * Elimina todas las mediciones
   *
   * @memberof ToolMeasureComponent
   */
  public removeAll() {
    this.deactivateAll();
    for (let i = this.features.length - 1; i >= 0; i--) {
      this.removeMeasureFeature(this.features[i]);
      this.features.splice(i, 1);
    }
  }

  /**
   * Dado un polígono devuelve su área formateada en km² o m²
   *
   * @private
   * @param {ol.geom.Polygon} polygon
   * @memberof ToolMeasureComponent
   */
  private formatArea(polygon: ol.geom.Polygon) {
    const sourceProj = this.map.getView().getProjection();
    const geom = polygon.clone().transform(sourceProj, 'EPSG:4326') as ol.geom.Polygon;
    const coordinates = geom.getLinearRing(0).getCoordinates();
    const wgs84Sphere = new ol.Sphere(6378137);
    const area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
    if (area > 100000) {
      this.area = (Math.round(area / 1000000 * 100) / 100).toLocaleString() + ' km²';
    } else {
      this.area = (Math.round(area * 100) / 100).toLocaleString() + ' m²';
    }
  }

  /**
   * Dada una línea devuelve su distancia total formateada en km o m
   *
   * @private
   * @param {ol.geom.LineString} line
   * @memberof ToolMeasureComponent
   */
  private formatLength(line: ol.geom.LineString) {
    const coordinates = line.getCoordinates();
    let totalDistance = 0;
    let lastDistance = 0;
    const sourceProj = this.map.getView().getProjection();
    const wgs84Sphere = new ol.Sphere(6378137);
    for (let i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      const c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
      const c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
      lastDistance = wgs84Sphere.haversineDistance(c1, c2);
      totalDistance += lastDistance;
    }
    if (totalDistance > 1000) {
      this.totalDistance = (Math.round(totalDistance / 1000 * 100) / 100).toLocaleString() +
        ' ' + 'km';
    } else {
      this.totalDistance = (Math.round(totalDistance * 100) / 100).toLocaleString() +
        ' ' + 'm';
    }
    if (lastDistance > 1000) {
      this.distance = (Math.round(lastDistance / 1000 * 100) / 100).toLocaleString() +
        ' ' + 'km';
    } else {
      this.distance = (Math.round(lastDistance * 100) / 100).toLocaleString() +
        ' ' + 'm';
    }
  }

  /**
   * Añade la interacción de dibujo al mapa. Controla qué geometrías dibujar y cuando añadir los overlays con las mediciones
   *
   * @private
   * @memberof ToolMeasureComponent
   */
  private addDrawInteraction(): void {

    // Desactivo la anterior interacción de dibujo si la hubiera
    this.deactivateMeasure();
    // Asigno la geometría a dibujar dependiendo de si está activada o no la medición en area
    const type: ol.geom.GeometryType = (this.measureArea ? 'Polygon' : 'LineString');
    this.map.on('pointermove', this.showHelpMessage);
    this.draw = new ol.interaction.Draw({
      source: this.layerVector.olInstance.getSource(),
      type,
      freehandCondition: (ev) => {
        if (!this.blockFreeHand) {
          this.freeHand = ol.events.condition.shiftKeyOnly(ev);
        } else {
          this.freeHand = false;
        }
        return this.freeHand;
      },
      style: [
        new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.8)',
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
          }),
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new ol.style.Fill({
              color: 'rgba(255, 255, 255, 0.2)',
            }),
          }),
        }),
        new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            stroke: new ol.style.Stroke({
              color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new ol.style.Fill({
              color: 'rgba(0, 0, 0, 1)',
            }),
          }),
          // Asigno puntos a cada vértice de una línea de puntos mientras dibujo
          geometry: (feature) => {
            if (feature.get('freehand')) {
              return null;
            }
            let coordinates;
            if (feature.getGeometry() instanceof ol.geom.LineString) {
              coordinates = (feature.getGeometry() as ol.geom.LineString).getCoordinates();
            } else {// return the coordinates of the first ring of the polygon
              coordinates = (feature.getGeometry() as ol.geom.Polygon).getCoordinates();
            }
            if (coordinates) {
              return new ol.geom.MultiPoint(coordinates);
            }
          },
        }),
      ],
    });

    this.map.addInteraction(this.draw);
    let listener;
    let mFeature: MeasureFeature;
    this.draw.on('drawstart',
      (evt: ol.interaction.Draw.Event) => {
        this.drawing = true;

        // Necesario para saber si ha cambiado el número de coordenadas en la geometría.
        // Pongo 2 para que ignore la primera coordenada
        let coordNumber = 2;
        mFeature = new MeasureFeature({ feature: evt.feature });
        mFeature.feature.set('freehand', this.freeHand);
        // Una vez que he empezado a dibujar en normal no se puede usar el dibujo libre
        this.blockFreeHand = !this.freeHand;

        mFeature.setId(this.featuresId);
        this.featuresId++;
        this.features.push(mFeature);
        listener = evt.feature.getGeometry().on('change', (evtGeom) => {
          const geom = evtGeom.target;
          let tooltipCoord;
          const coordinates = geom.getCoordinates();
          // Si la geometría es de tipo polígono, consigo el área
          if (geom instanceof ol.geom.Polygon) {
            this.formatArea(geom);
            // Conseguir las últimas coordenadas del polígono
            tooltipCoord = coordinates[0][coordinates[0].length - 2];
          } else if (geom instanceof ol.geom.LineString) { // Si la geometría es de tipo línea de puntos
            // Pongo esta variable para guardar la distancia inmediatamente anterior, sino la distancia del nuevo segmento se pone a 0
            const distance = this.distance;
            this.formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
            if (!this.freeHand) {
              const overlayHtml = '+' + distance + '<br>' + this.totalDistance;
              if (coordinates.length > coordNumber) { // Si se ha añadido una nueva coordenada inserto un overlay
                coordNumber = coordinates.length;
                this.createOverlay(tooltipCoord, mFeature, overlayHtml);
              }
            }
          }
          this.measureTooltip.setPosition(tooltipCoord);
        });
      });

    this.draw.on('drawend',
      (evt: ol.interaction.Draw.Event) => {
        this.blockFreeHand = false;
        const geom = evt.feature.getGeometry();
        if (geom instanceof ol.geom.Polygon) {
          this.createOverlay((geom as ol.geom.Polygon).getInteriorPoint().getCoordinates(), mFeature, this.area);
          // meter area como propiedad del feature para la exportacion
          mFeature.feature.setProperties({ Area: this.area });
          this.area = '';
        } else {
          if (evt.feature.get('freehand')) {
            this.createOverlay((geom as ol.geom.LineString).getLastCoordinate(), mFeature, this.totalDistance);
          }
          // meter distancia como propiedad del feature para la exportacion
          mFeature.feature.setProperties({ Distancia: this.totalDistance });
          this.distance = '';
          this.totalDistance = '';
        }
        this.measureTooltip.setPosition(null);
        ol.Observable.unByKey(listener);
        this.drawing = false;
      });

  }

  /**
   * Añade la interacción de selección de medidas al mapa
   *
   * @private
   * @memberof ToolMeasureComponent
   */
  private addSelectInteraction(): void {
    this.select = new ol.interaction.Select({ layers: [this.layerVector.olInstance], condition: ol.events.condition.pointerMove });
    // Evento que se lanza al seleccionar una feature
    this.select.on('select', (evt: ol.interaction.Select.Event) => {
      (this.map.getTargetElement() as HTMLElement).style.cursor = evt.selected.length ? 'pointer' : 'auto';
    });
    this.map.addInteraction(this.select);
  }


  /**
   * Añade un overlay con el contenido del html al mapa en la coordinada seleccionada a la feature de medición pasada como parámetro
   *
   * @private
   * @param {ol.Coordinate} coord
   * @param {MeasureFeature} feature
   * @param {string} html
   * @memberof ToolMeasureComponent
   */
  private createOverlay(coord: ol.Coordinate, feature: MeasureFeature, html: string) {
    const overlayElement = document.createElement('div');
    overlayElement.className = 'ol-tooltip ol-tooltip-static';
    overlayElement.innerHTML = html;
    const overlay = new ol.Overlay({
      offset: [0, -7],
      positioning: 'bottom-center',
      stopEvent: false,
      position: coord,
      element: overlayElement,
    });
    this.map.addOverlay(overlay);
    feature.addOverlay(overlay);
  }

  /**
   * Desactiva todas las herramientas, tanto de medición como de eliminación
   *
   * @private
   * @memberof ToolMeasureComponent
   */
  private deactivateAll(): void {
    this.isMeasure = false;
    this.isRemoving = false;
    this.deactivateRemove();
    this.deactivateMeasure();
  }

  private deactivateMeasure(): void {
    if (this.draw) {
      // Si se encuentra dibujando sin terminar la medición cuando cesa la interacción elimino la geometría
      if (this.drawing) {
        this.draw.finishDrawing();
        const measureFeature = this.features.splice((this.features.length - 1), 1);
        this.removeMeasureFeature(measureFeature[0]);
      }
      this.map.removeInteraction(this.draw);
      this.draw = null;
      this.map.un('pointermove', this.showHelpMessage);
    }
  }

  /**
   * Desactiva la herramienta de eliminación de mediciones
   *
   * @private
   * @memberof ToolMeasureComponent
   */
  private deactivateRemove(): void {
    this.isRemoving = false;
    this.map.un('click', this.removeFeature);

    if (this.select) {
      this.map.removeInteraction(this.select);
      this.select = null;
    }
  }

  /**
   * Activa/Desactiva la herramienta de eliminación por selección de mediciones
   *
   * @memberof ToolMeasureComponent
   */
  public toggleDelete() {
    this.isRemoving = !this.isRemoving;
    if (this.isRemoving) {
      if (this.isActive) {
        this.deactivateMeasure();
      } else {
        this.activateTool();
      }
      this.addSelectInteraction();
      this.map.on('click', this.removeFeature);
    } else {
      this.deactivateTool();
    }
  }

  /**
   * Activa/Desactiva el la medición de área/distancia
   *
   * @param {boolean} measureArea
   * @memberof ToolMeasureComponent
   */
  public toggleMeasure(measureArea: boolean): void {
    // Si selecciono
    if (this.measureArea !== measureArea) {
      this.isMeasure = true;
    } else {
      this.isMeasure = !this.isMeasure;
    }
    // Si está activo
    if (this.isMeasure) {
      if (this.isActive) {
        if (this.isRemoving) {
          this.deactivateRemove();
        }
      } else {
        this.activateTool();
      }
      this.measureArea = measureArea;
      this.deactivateRemove();
      this.addDrawInteraction();
    } else {
      this.deactivateTool();
    }
  }


  /**
   * Elimina la feature y los overlays de medida
   *
   * @private
   * @param {MeasureFeature} feature
   * @memberof ToolMeasureComponent
   */
  private removeMeasureFeature(feature: MeasureFeature): void {
    feature.removeFeature(this.layerVector.olInstance.getSource());
    feature.removeOverlays();
  }

  /**
   * Elimina la feature seleccionada al realizar un click
   *
   * @private
   * @memberof ToolMeasureComponent
   */
  private removeFeature = (evt: ol.MapBrowserEvent) => {
    // Si se está moviendo el mapa
    if (evt.dragging) {
      return;
    }
    this.select.getFeatures().forEach((feature) => {
      // Compruebo la feature seleccionada y la elimino del vector, sus overlays y del array de features
      for (let i = 0; i < this.features.length; i++) {
        const measureFeature = this.features[i];
        if (feature.getId() === measureFeature.getId()) {
          this.removeMeasureFeature(measureFeature);
          this.features.splice(i, 1);
          // si ya no hay features, apaga modo borrar
          if (this.features && this.features.length === 0) {
            this.toggleDelete();
          }
        }
      }
    });
    if (this.select) {
      // Para que se quite la selección, eliminamos las feature seleccionadas
      this.select.getFeatures().clear();
    }
    (this.map.getTargetElement() as HTMLElement).style.cursor = 'auto';
  }
}
