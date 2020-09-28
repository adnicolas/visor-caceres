import { Component, ElementRef, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import * as ol from 'openlayers';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { ButtonItem } from '@theme/classes/button-item.class';
import { FileUploadComponent } from '@theme/components/file-upload/file-upload.component';
import { ToastService } from '@theme/services/toast.service';
import { environment } from 'src/environments/environment';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { AreaSelectionService } from '@cotvisor/services/area-selection.service';
import * as shp from 'shpjs';


/**
 * Herramienta de mapa para seleccionar el área (Poligonal, Rectangular o Circular) en el que buscar las imágenes de GDBX o SENTINEL
 *
 * @export
 * @class ToolAreaSelectorComponent
 * @extends {AbstractParentToolSelectableComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'cot-tool-area-selector',
  templateUrl: './tool-area-selector.component.html',
  styleUrls: ['./tool-area-selector.component.scss']
})
export class ToolAreaSelectorComponent extends AbstractParentToolSelectableComponent implements OnInit, OnDestroy {
  @ViewChild('mouseOverlay') public mouseOverlay: ElementRef;

  @ViewChild(FileUploadComponent) private fileUpload: FileUploadComponent;

  @Input() direction: string = 'right';
  public areaType: string;
  public isDrawing: boolean;
  public isRemoving: boolean;
  public showLayerLoader: boolean = false;
  public fileFormatsAccepts = '.kml,.zip';
  public splitButtonItems: ButtonItem[] = [];
  public helpTooltip: ol.Overlay;
  public helpMessage: string;
  private draw: ol.interaction.Draw;
  private snap: ol.interaction.Snap;
  private modify: ol.interaction.Modify;
  private select: ol.interaction.Select;
  private layerVector: VsLayerVector;
  private file: File;

  // Propiedad usada para cancelar el envío de nuevas features cuando en realidad se ha cancelado el dibujo
  private cancelInserction: boolean = false;


  constructor(private areaSelectionService: AreaSelectionService, private toast: ToastService) {
    super();
    this.isDrawing = false;
    this.isRemoving = false;
  }

  public ngOnInit() {
    super.ngOnInit();
    this.splitButtonItems = [
      new ButtonItem({
        icon: 'fas fa-draw-polygon',
        toggleButton: true,
        command: () => {
          this.toggleAreaSelector('Polygon');
        }
      }),
      new ButtonItem({
        icon: 'fas fa-vector-square',
        toggleButton: true,
        command: () => {
          this.toggleAreaSelector('Rectangle');
        }
      }),
      /*       new ButtonItem({
              icon: 'fas fa-circle-notch',
              toggleButton: true,
              command: () => {
                this.toggleAreaSelector('Circle');
              }
            }), */
      new ButtonItem({
        icon: 'fas fa-file-upload',
        command: () => {
          this.showLayerLoaderModal();
        }
      }),
      new ButtonItem({
        icon: 'fas fa-eraser',
        toggleButton: true,
        command: () => {
          this.toggleRemove();
        }
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
      this.splitButtonItems[0].label = this.componentLiterals['TOOLS.AREA_POLYGON'];
      this.splitButtonItems[1].label = this.componentLiterals['TOOLS.AREA_RECTANGLE'];
      /*       this.splitButtonItems[2].label = this.componentLiterals['TOOLS.AREA_CIRCLE']; */
      this.splitButtonItems[2].label = this.componentLiterals['TOOLS.AREA_SELECTOR.ADD_LAYER'];
      this.splitButtonItems[3].label = this.componentLiterals['TOOLS.REMOVE_AREA'];
      this.splitButtonItems[4].label = this.componentLiterals['TOOLS.REMOVE_ALL_AREAS'];
    });
    this.useLiterals([
      'TOOLS.AREA_POLYGON',
      'TOOLS.AREA_RECTANGLE',
      'TOOLS.AREA_SELECTOR.ADD_LAYER',
      'TOOLS.REMOVE_AREA',
      'TOOLS.REMOVE_ALL_AREAS',
      'ERRORS.ERROR',
      'WARNINGS.WARNING',
      'ERRORS.LOAD_FILE',
      'ERRORS.OVERSIZE_FILE',
      'TOOLS.AREA_SELECTOR.NO_FEATURES',
      'TOOLS.AREA_SELECTOR.ONLY_POLYGONS'],
      { max_size: Math.round(environment.file_sizes.zip_max_size / 1048576) });
  }

  public ngOnDestroy() {
    super.ngOnDestroy();
    // Quito la interacción de modificar
    this.map.removeInteraction(this.modify);
    this.modify = null;
  }


  /**
   * Implementación de metodo abstracto de AbstractParentToolSelectableComponent. Metodo de activación de la herramienta
   *
   * @memberof ToolAreaSelectorComponent
   */
  public activateTool() {
    this.mapService.getActiveMap().activateTool(this);
    this.isActive = true;
  }

  /**
   * Implementación de metodo abstracto de AbstractParentToolSelectableComponent
   * Método de desactivación de la herramienta
   *
   * @memberof ToolAreaSelectorComponent
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
   * @memberof ToolAreaSelectorComponent
   */
  public afterChangeActiveMap() {

    this.layerVector = this.areaSelectionService.getAreaSelectionVectorLayer(this.map);
    // Añado la posibilidad de modificar las geometrías en todo momento
    this.modify = new ol.interaction.Modify({ source: this.layerVector.olInstance.getSource() });
    this.modify.on('modifyend', this.featureAdded);
    this.map.addInteraction(this.modify);

    // Creo el overlay que se va moviendo junto al ratón
    this.helpTooltip = new ol.Overlay({
      element: this.mouseOverlay.nativeElement,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
    });
    this.map.addOverlay(this.helpTooltip);
  }


  /**
   * Implementación del método abstracto de AbstracParentToolComponent
   * Es llamado antes de cambiar el mapa activo
   * @memberof ToolAreaSelectorComponent
   */
  public beforeChangeActiveMap() {
    // Desactivo todos los controles
    this.isActive = false;
    this.deactivateAll();
    // Elimino el evento y la interacción de modificar el vector para este mapa
    this.modify.un('modifyend', this.featureAdded);
    this.map.removeInteraction(this.modify);
  }




  /**
   * Activa/Desactiva la herramienta de eliminación por selección de features
   *
   * @memberof ToolAreaSelectorComponent
   */
  public toggleRemove() {
    this.isRemoving = !this.isRemoving;
    if (this.isRemoving) {
      if (this.isActive) {
        this.deactivateAreaSelector();
      } else {
        this.activateTool();
      }
      this.addSelectInteraction();
      // this.map.on('pointermove', this.selectFeature);
      this.map.on('click', this.removeFeature);
    } else {
      this.deactivateTool();
    }
  }

  /**
   * Activa/Desactiva el selector de área seleccionado
   *
   * @param {string} activeArea
   * @memberof ToolAreaSelectorComponent
   */
  public toggleAreaSelector(activeArea: string): void {
    if (activeArea === this.areaType) {
      this.deactivateTool();
    } else {
      if (this.isActive) {
        if (this.isRemoving) {
          this.deactivateRemoving();
        }
      } else {
        this.activateTool();
      }
      this.areaType = activeArea;
      this.addDrawInteraction();
    }
  }

  /**
   * Elimina todas las geometrías del vector activo
   *
   * @memberof ToolAreaSelectorComponent
   */
  public removeAll() {
    this.deactivateAll();
    if (this.layerVector.olInstance.getSource().getFeatures().length) {
      this.layerVector.olInstance.getSource().clear();
      this.areaSelectionService.setArea(this.layerVector.olInstance.getSource().getFeatures());
    }
  }


  /**
   * Método que se ejecuta cuando el usuario cambia su seleccion de archivo
   *
   * @param {File} file
   * @memberof ToolAreaSelectorComponent
   */
  public changeFile(file: File): void { // tslint:disable-line
    this.file = file;
    if (file) {
      if (file.size > environment.file_sizes.zip_max_size) {
        this.toast.showWarning({
          summary: this.componentLiterals['ERRORS.ERROR'],
          detail: this.componentLiterals['ERRORS.OVERSIZE_FILE']
        }
        );
        this.file = null;
      }
    }
  }

  /**
   * Carga la capa a partir del archivo subido
   *
   * @memberof ToolAreaSelectorComponent
   */
  public loadLayer(): void {
    // Consigo la extensión del fichero
    // tslint:disable-next-line:no-bitwise
    const fileExt = this.file.name.slice((this.file.name.lastIndexOf('.') - 1 >>> 0) + 2);
    const fileReader: FileReader = new FileReader();

    fileReader.onloadend = (e) => {
      try {
        let features: ol.Feature[] = [];
        if (fileExt === 'zip') {
          // Por si se trata de un conjunto de shapes, recojo el geojson en un array y junto las features
          const geojsonArray = [].concat(shp.parseZip(fileReader.result));
          for (const geojson of geojsonArray) {
            const localFeatures = new ol.format.GeoJSON().readFeatures(geojson, {
              featureProjection: this.mapService.getActiveMap().getView().getProjection().getCode(),
              dataProjection: 'EPSG:4326',
            });
            if (localFeatures) {
              features = features.concat(localFeatures);
            }
          }
        } else if (fileExt === 'kml') {
          features = new ol.format.KML({ extractStyles: false }).readFeatures(fileReader.result, {
            featureProjection: this.mapService.getActiveMap().getView().getProjection().getCode(),
            dataProjection: 'EPSG:4326',
          });
        } else {
          this.toast.showError({
            summary: this.componentLiterals['ERRORS.ERROR'],
            detail: this.componentLiterals['ERRORS.LOAD_FILE']
          }
          );
          return;
        }

        if (!features.length) {
          this.toast.showWarning({
            summary: this.componentLiterals['WARNINGS.WARNING'],
            detail: this.componentLiterals['TOOLS.AREA_SELECTOR.NO_FEATURES']
          });
        } else {
          this.layerVector.olInstance.getSource().clear();
          const totalFeatures = features.filter(feature => (feature.getGeometry() instanceof ol.geom.Polygon || feature.getGeometry() instanceof ol.geom.MultiPolygon));
          // Si el tamaño ha variado, es que hay alguna feature que no es de tipo poligonal o multipoligonal.
          if (totalFeatures.length !== features.length) {
            this.toast.showWarning({
              summary: this.componentLiterals['ERRORS.ERROR'],
              detail: this.componentLiterals['TOOLS.AREA_SELECTOR.ONLY_POLYGONS']
            });
          }

          this.layerVector.olInstance.getSource().addFeatures(totalFeatures);
          this.featureAdded(null);
          this.file = null;
          this.fileUpload.clear();
          this.showLayerLoader = false;
        }
        // this.loader.closeLoading();
      } catch (error) {
        this.toast.showWarning({
          summary: this.componentLiterals['ERRORS.ERROR'],
          detail: this.componentLiterals['ERRORS.LOAD_FILE']
        });
        // this.loader.closeLoading();
      }
    };

    if (fileExt === 'zip') {
      fileReader.readAsArrayBuffer(this.file);
    } else if (fileExt === 'kml') {
      fileReader.readAsText(this.file);
    }
  }


  /**
   * Añade la interacción de dibujo al mapa. Controla qué geometrías dibujar
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private addDrawInteraction(): void {
    // Desactivo la anterior interacción de dibujo si la hubiera
    this.deactivateDraw();
    const type = this.areaType === 'Polygon' ? 'Polygon' : 'Circle';
    // @ts-ignore
    const geometryFunction = this.areaType === 'Rectangle' ? ol.interaction.Draw.createBox() : null;
    this.map.on('pointermove', this.showHelpMessage);
    this.layerVector.olInstance.getSource().on('addfeature', this.featureAdded);
    // Asigno la geometría a dibujar dependiendo de si está activada o no la medición en area
    this.draw = new ol.interaction.Draw({
      source: this.layerVector.olInstance.getSource(),
      type,
      geometryFunction,
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
        })
      ],
    });
    this.map.addInteraction(this.draw);
    this.draw.on('drawstart',
      (evt: ol.interaction.Draw.Event) => {
        this.isDrawing = true;
      });

    this.draw.on('drawend',
      (evt: ol.interaction.Draw.Event) => {
        this.isDrawing = false;
      });

    this.snap = new ol.interaction.Snap({ source: this.layerVector.olInstance.getSource() });
    this.map.addInteraction(this.snap);
  }


  /**
   * Envía las nuevas features añadidas a la capa al servicio de áreas
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private featureAdded = (event: any) => {
    if (this.cancelInserction) {
      this.layerVector.olInstance.getSource().removeFeature(event.feature);
    } else {
      this.map.getView().fit(this.layerVector.olInstance.getSource().getExtent(), { duration: this.zoomDuration });
      this.areaSelectionService.setArea(this.layerVector.olInstance.getSource().getFeatures());
    }
  }


  /**
   * Asigna al overlay de ayuda la posición del cursor sobre el mapa.
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private showHelpMessage = (evt: ol.MapBrowserEvent) => {
    this.helpTooltip.setPosition(evt.coordinate);
  }



  /**
   * Desactiva todas las herramientas, tanto de dibujo de área como de eliminación
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private deactivateAll(): void {
    this.deactivateAreaSelector();
    this.deactivateRemoving();
  }

  /**
   * Muestra el modal de carga de capas y desactiva el resto
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private showLayerLoaderModal() {
    this.showLayerLoader = true;
    this.deactivateAll();
  }


  /**
   * Desactiva las herramientas de selección de área
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private deactivateAreaSelector() {
    this.areaType = null;
    this.deactivateDraw();
  }


  /**
   * Desactiva la herramienta de eliminación de feataure
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private deactivateRemoving() {
    this.isRemoving = false;
    if (this.select) {
      this.map.removeInteraction(this.select);
      this.select = null;
    }
    this.map.un('click', this.removeFeature);
  }


  /**
   * Desactiva la herramienta de dibujo
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private deactivateDraw(): void {
    if (this.draw) {
      // Si se encuentra dibujando sin terminar la medición cuando cesa la interacción elimino la geometría
      if (this.isDrawing) {
        // Cancelamos la insercción de la última feature utilizada, que responde al evento addFeature
        this.cancelInserction = true;
        this.draw.finishDrawing();
        this.cancelInserction = false;
      }
      this.map.removeInteraction(this.draw);
      this.map.removeInteraction(this.snap);
      this.map.un('pointermove', this.showHelpMessage);
      this.layerVector.olInstance.getSource().un('addfeature', this.featureAdded);
      this.draw = null;
    }
  }


  /**
   * Añade la interacción de selección de áreas al mapa
   *
   * @private
   * @memberof ToolAreaSelectorComponent
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
   * Elimina la feature seleccionada al realizar un click
   *
   * @private
   * @memberof ToolAreaSelectorComponent
   */
  private removeFeature = (evt: ol.MapBrowserEvent) => {
    // Si se está moviendo el mapa
    if (evt.dragging) {
      return;
    }
    this.select.getFeatures().forEach((feature) => {
      this.layerVector.olInstance.getSource().removeFeature(feature);
    });
    // Para que se quite la selección, eliminamos las feature seleccionadas
    this.select.getFeatures().clear();
    (this.map.getTargetElement() as HTMLElement).style.cursor = 'auto';
    // Actualizamos las features en el servicio
    const features = this.layerVector.olInstance.getSource().getFeatures();
    this.areaSelectionService.setArea(features);
    if (features.length === 0) {
      this.toggleRemove();
    }
  }
}
