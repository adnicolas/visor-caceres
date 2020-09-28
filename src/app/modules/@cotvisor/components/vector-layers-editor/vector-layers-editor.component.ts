import { Component, ViewChild } from '@angular/core';
import * as jsts from 'jsts';
import * as ol from 'openlayers';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { ToastService } from '@theme/services/toast.service';
import { LayersFoldersTreeService } from '@cotvisor/components/map-manager/layers-folders/layers-folders-tree.service';
import { LayerToDraw } from './LayerToDraw.class';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AbstractParentToolSelectableComponent } from '@cotvisor/classes/parent/abstract-parent-tool-selectable.component';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { VsLayerWFS } from '@cotvisor/models/vs-layer-wfs';
import { WfsReaderService } from '@cotvisor/services/wfs-reader.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalAuthService } from '@cotvisor-admin/services';
import { FeatureAtributesClass } from './FeatureAtributesClass';
import { GeometryTypesOptionsClass } from './GeometryTypesOptionsClass';

const DEFAULT_GEOMETRY_DRAW = 'Polygon';


// tslint:disable-next-line:max-classes-per-file
@Component({
  selector: 'cot-vector-layers-editor',
  templateUrl: './vector-layers-editor.component.html',
  styleUrls: ['./vector-layers-editor.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class VectorLayersEditorComponent extends AbstractParentToolSelectableComponent {


  /**
   * input del nombre de la nueva capa a crear
   * @param  {[type]} 'layerNameInput' [description]
   */
  @ViewChild('layerNameInput') public layerNameInput;
  /**
   * Input de texto de la herramienta añadir texto
   * @param  {[type]} 'inputGeometryText' [description]
   */
  @ViewChild('inputGeometryText') public inputGeometryText;

  /**
   * Lista de capas editables
   *
   * @type {LayerToDraw[]}
   * @memberOf VectorLayersEditorComponent
   */
  public editableLayers: LayerToDraw[];
  /**
   * Interaccion de dibujo
   *
   * @type {ol.interaction.Draw}
   * @memberOf VectorLayersEditorComponent
   */
  public draw: ol.interaction.Draw;
  /**
   * Interaccion de modificación
   *
   * @type {ol.interaction.Modify}
   * @memberOf VectorLayersEditorComponent
   */
  public modify: ol.interaction.Modify;
  /**
   * Interaccion de selección
   *
   * @type {ol.interaction.Select}
   * @memberOf VectorLayersEditorComponent
   */
  public modifySelect: ol.interaction.Select;
  /**
   * Interaccion de Snap
   *
   * @type {ol.interaction.Snap}
   * @memberOf VectorLayersEditorComponent
   */
  public snap: ol.interaction.Snap;
  /**
   * Capa seleccionada de la lista de capas editables
   *
   * @type {(VsLayerWFS | VsLayerVector)}
   * @memberOf VectorLayersEditorComponent
   */
  public selectedVsLayer: VsLayerWFS | VsLayerVector;
  /**
   * FEature seleccionada en la capa seleccionada
   *
   * @type {ol.Feature}
   * @memberOf VectorLayersEditorComponent
   */
  public selectedFeature: ol.Feature;
  public layerAction: string;
  public layerName: string;
  public snapping: boolean;
  public freeHand: boolean;
  public blockFreeHand: boolean;
  public unfinished: boolean;
  public drawingStatus: boolean;
  public modifyingStatus: boolean;
  public removing: boolean;
  public creating: boolean;
  public geometryType: string;
  public featureText: string;
  public editingLayerName: boolean = false;

  public editAttributes: boolean;
  public onEditFeature: ol.Feature;
  public insertedFeatures: ol.Feature[];
  public updatedFeatures: ol.Feature[];
  public deletedFeatures: ol.Feature[];
  public featureTypes: Array<{ name: string; geometryName: string }>;
  public geometryName: string;

  // Geometry Style
  public strokeColor: string;
  public fillColor: string;
  public lineThickness: number;
  public lineType: any;
  public pointRadius: number;
  public bufferRadius: number;
  public fontSize: number;
  public styles: any;
  public lineTypes = [{ representation: '───────────────────', value: [1, 1] },
  { representation: '── ── ── ── ── ── ── ──', value: [10, 10] },
  { representation: '⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅ ⋅', value: [1, 10] },
  { representation: '── ⋅ ── ⋅ ── ⋅ ── ⋅ ── ⋅ ── ⋅', value: [1, 20, 10, 20] }];

  public saveAsMenu = [
    { label: 'GeoJson', command: () => { } },
    { label: 'SHP', command: () => { } }
  ];


  // Para almacenar la transparencia de color que pudiese haber al cambiar entre dibujar textos y el resto
  private strokeTransparency: string;
  private fillTransparency: string;
  geometryTypesOptions: GeometryTypesOptionsClass[];
  dirty: boolean;
  public showFeatureEdit: boolean = false;
  someFieldRequired = false;
  /**
   * Clase de atributos para renderizar en ventana de edición
   *
   * @type {FeatureAtributesClass[]}
   * @memberOf VectorLayersEditorComponent
   */
  editFormfeatureAttributes: FeatureAtributesClass[] = [];



  constructor(
    private toast: ToastService, private layersFoldersTreeService: LayersFoldersTreeService, private globalAuthService: GlobalAuthService,
    private confirmDialogService: ConfirmDialogService, private wfsReaderService: WfsReaderService, private httpClient: HttpClient) {
    super();
    this.snapping = true;
    this.drawingStatus = false;
    this.modifyingStatus = false;
    this.removing = false;
    this.creating = false;
    this.editableLayers = [];
    this.geometryType = '';
    this.dirty = false;
    this.insertedFeatures = [];
    this.updatedFeatures = [];
    this.deletedFeatures = [];

    this.geometryTypesOptions = [
      { value: 'Polygon', title: 'Polígono', icon: 'fas fa-draw-polygon' },
      { value: 'LineString', title: 'Línea', icon: 'fas fa-project-diagram' },
      { value: 'Buffer', title: 'Buffer', icon: 'mi view-day' },
      { value: 'Point', title: 'Punto', icon: 'mi grain' },
      { value: 'Text', title: 'Texto', icon: 'fas fa-font' },
    ];

    // Inicializamos los estilos de las geometrias
    this.fillColor = environment.colors.secondary + environment.colors.transparency.high;
    this.strokeColor = environment.colors.primary;
    this.lineThickness = 3;
    this.pointRadius = 5;
    this.bufferRadius = 25;
    this.fontSize = 12;
    this.lineType = this.lineTypes[0];
    this.strokeTransparency = '';
    this.fillTransparency = '';
    this.setStyle(null);


    // recoge traducciones
    this.useLiterals(['LAYER_EDITOR.DUPLICATE', 'LAYER_EDITOR.INVALID_NAME', 'LAYERS.DELETE', 'LAYERS.DELETE_CONFIRM', 'LAYER_EDITOR.SAVE', 'LAYER_EDITOR.SAVE_CONFIRM', 'LAYER_EDITOR.RESET_CONFIRM', 'LAYER_EDITOR.RESET']);
  }

  /**
   * Activa la herramiena en el mapa
   *
   *
   * @memberOf VectorLayersEditorComponent
   */
  public activateTool(): void {
    this.mapService.getActiveMap().activateTool(this);
    this.isActive = true;
  }
  public deactivateTool(): void {
    this.mapService.getActiveMap().deactivateTool();
    this.deactivateAll();
    this.isActive = false;


  }

  public afterChangeActiveMap() {
    this.map = this.mapService.getActiveMap();
    // emitimos un valor en unsubscribe para eliminar las anterior subscripciones
    this.unSubscribe.next(true);

    // nos suscribimos al evento de capa eliminada para actualizar el estado de las capas
    this.map.observableLayerDeleted$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((layer) => {
        this.updateLayers();
        if (layer === this.selectedVsLayer) {
          this.deactivateAll();
          this.selectedVsLayer = null;
        }
      });

    // nos suscribimos al evento de capa añadida para actualizar el estado de las capas
    this.map.observableLayerAdded$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((layer: VsLayerVector) => {
        // La capa de medición no la tratamos
        if (layer.name === 'Measure') return;
        if (layer.olInstance instanceof ol.layer.Vector) {

          if (layer instanceof VsLayerWFS) {
            // Si no proviene  de nuestro geoserver no la añadios como editable
            if (layer.service.url.includes(environment.apis.geoserver.baseUrl)) {
              // Si es una WFS y proviene de nuestro geoserver obtenemos sus atributos para una posterior edición
              this.getFeatureAttributes(layer.service.url, layer);
              this.editableLayers = [...this.editableLayers, new LayerToDraw(layer, false)];
            }
          } else {
            this.editableLayers = [...this.editableLayers, new LayerToDraw(layer, false)];
          }
        }
      });

    this.updateLayers();
  }

  public beforeChangeActiveMap() {
    // Reinicio los botones
    this.deactivateAll();
    if (this.selectedVsLayer) {

      this.selectedVsLayer = null;
    }
  }

  private updateLayers() {
    this.editableLayers = [];
    for (const layer of this.map.getActiveLayers()) {
      if (layer.olInstance instanceof ol.layer.Vector) {
        this.editableLayers = [...this.editableLayers, new LayerToDraw(layer as VsLayerVector, false)];
      }
    }
  }

  public newLayer() {
    if (this.layerName) {
      let original = true;
      for (const layer of this.editableLayers) {
        if (layer.vsLayer.name === this.layerName) {
          this.toast.showError({ summary: this.componentLiterals['LAYER_EDITOR.INVALID_NAME'], detail: this.componentLiterals['LAYER_EDITOR.DUPLICATE'] });
          original = false;
        }
      }
      if (original) {

        const newVectorLayer: VsLayerVector = new VsLayerVector({
          name: this.layerName,
          title: this.layerName,
          projection: this.map.getView().getProjection().getCode(),
        });
        this.layersFoldersTreeService.selectRootFolder();
        this.mapService.addVsLayer(newVectorLayer);
        this.changeSelectedLayer(newVectorLayer);
        this.selectedVsLayer = newVectorLayer;
        // Reiniciamos el nombre de la capa
        this.layerName = '';
        this.creating = false;
        // Si el usuario estaba dibujando cuando añadió la nueva capa añado
        // una nueva interacción cambiando el vector, sino activo dibujar
        if (this.drawingStatus) {
          this.changeDrawInteraction(this.geometryType);
        } else {
          this.handleDraw(true);
        }
      }
    } else {
      this.toast.showError({ summary: this.componentLiterals['LAYER_EDITOR.INVALID_NAME'], detail: this.componentLiterals['LAYER_EDITOR.NO_LAYER_NAME'] });
    }

  }

  public saveAsPopover(ev) {
    alert('mostrar menu salvar como');
    // this.popoverService.presentSaveAs(ev, this.selectedVsLayer, this.map.getView().getProjection().getCode());
  }

  private removeLayer() {
    for (const layer of this.editableLayers) {
      if (layer.vsLayer === this.selectedVsLayer) {
        this.mapService.removeVsLayer(layer.vsLayer);
        this.layerAction = '';
        // this.setConflictingEvents();
        break;
      }
    }
  }

  /**
   * Desactiva todas las interacciones y establace los flags de estado de interacciones a falso
   *
   * @private
   *
   * @memberOf VectorLayersEditorComponent
   */

  private deactivateAll() {
    this.layerAction = '';
    // Por si se estaba dibujando, modificanado o eliminando features
    this.deactivateDraw();
    this.deactivateModify();
    this.drawingStatus = false;
    this.modifyingStatus = false;
  }


  /**
   * Establece una nueva geometría en la interaccion draw
   *
   * @param {string} geometryType
   * @param {*} [event]
   *
   * @memberOf VectorLayersEditorComponent
   */
  public changeDrawInteraction(geometryType: string, event?: any): void {


    // Si llega evento es un cambio de geometría
    if (event) geometryType = event.option.value;

    // Reinicio el valor de texto a dibujar
    this.featureText = '';
    // Desactivo la anterior interacción de dibujo si la hubiera
    this.deactivateDraw();

    this.geometryType = geometryType;

    this.checkGeometryTypeStyles();
    this.setStyle(null);
    let type: ol.geom.GeometryType = 'Polygon';
    switch (this.geometryType) {
      case 'Text': {
        type = 'Point';
        break;
      }
      case 'Buffer': {
        type = 'LineString';
        break;
      }
      default:
        type = this.geometryType as ol.geom.GeometryType;
    }
    // Asigno la geometría a dibujar dependiendo de si está activada o no la medición en area
    this.draw = new ol.interaction.Draw({
      source: this.selectedVsLayer.olInstance.getSource(),
      type,
      freehandCondition: (ev) => {
        if (!this.blockFreeHand) {
          this.freeHand = ol.events.condition.shiftKeyOnly(ev);
        } else {
          this.freeHand = false;
        }
        return this.freeHand;
      },
      style: (feature) => {
        if (this.featureText) {
          // this.styles.text.getText().setText(this.featureText);
          return this.styles.text;
        }
        return this.styles.general;
      },
    });
    this.map.addInteraction(this.draw);

    this.snap = new ol.interaction.Snap({ source: this.selectedVsLayer.olInstance.getSource() });
    this.map.addInteraction(this.snap);
    this.setSnapping();

    this.draw.on('drawstart',
      (evt) => {
        this.unfinished = true;
      });

    this.draw.on('drawend',
      (evt: ol.interaction.Draw.Event) => {
        this.unfinished = false;
        evt.feature.set('type', this.geometryType);
        const source = this.selectedVsLayer.olInstance.getSource();
        // Inicializo el nombre a vacio en los puntos para que no me de error al guardar un shapefile
        if (this.geometryType === 'Point' as ol.geom.GeometryType) {
          evt.feature.set('name', '');
        }
        // Creamos el buffer a partir de una línea
        if (this.geometryType === 'Buffer' as ol.geom.GeometryType) {
          const parser = new jsts.io.OL3Parser();
          // convierte de una geometría de ol a una geometría de jsts
          const jstsGeom = parser.read(evt.feature.getGeometry());

          // crea un buffer alrededor de la línea del radio especificado
          const buffered = jstsGeom.buffer(this.bufferRadius);

          // convierte de nuevo la geometría de jsts a ol
          evt.feature.setGeometry(parser.write(buffered));
          evt.feature.set('bufferRadius', this.bufferRadius);
        }
        if (this.geometryType === 'Text' as ol.geom.GeometryType) {
          if (this.featureText) {
            evt.feature.set('name', this.featureText);
            evt.feature.setStyle(this.styles.text.clone());
          } else {
            this.toast.showInfo({ summary: 'Crear texto', detail: 'Debe introducir un texto para generar el punto' });
            // TODO comprobar si es correcto el tipo del evento ?
            source.once('addfeature', (addfeatureEvent: ol.source.VectorEvent) => {
              source.removeFeature(addfeatureEvent.feature);
            });
            // Añadir aviso de que no se puede incluir un texto vacio
          }
        } else {
          evt.feature.setStyle(this.styles.general.clone());
        }
        // Actualizamos el extent de la capa
        source.once('addfeature', (addfeatureEvent: ol.source.VectorEvent) => {
          this.selectedVsLayer.extent = source.getExtent();
          this.selectedVsLayer.layerChange();
        });
        // Añado la feature a la lista
        // this.selectedVsLayerFeatures = [...this.selectedVsLayerFeatures, evt.feature]; // Controlar qué pasa cuando se elimina la de texto
        this.insertedFeatures.push(evt.feature);
        if (this.selectedVsLayer instanceof VsLayerWFS) {
          if (this.selectedVsLayer.attributes.length > 0) {
            this.presentEditAttributesModal(evt.feature, this.selectedVsLayer.attributes);
          }
        }
      });

    if (this.geometryType === 'Text' as ol.geom.GeometryType) {
      setTimeout(() => {
        this.inputGeometryText.setFocus();
      }, 100);

    }
  }

  private checkGeometryTypeStyles() {
    // Si cambiamos a una geometría de tipo texto, quitamos la posibilidad de transparencia del color
    if (this.geometryType === 'Text') {
      this.strokeTransparency = this.strokeColor.length > 7 ? this.strokeColor.slice(-2) : '';
      this.strokeColor = this.strokeColor.slice(0, 7);
      this.fillTransparency = this.fillColor.length > 7 ? this.fillColor.slice(-2) : '';
      this.fillColor = this.fillColor.slice(0, 7);
    } else {
      this.strokeColor = this.strokeTransparency ?
        this.strokeColor.slice(0, 7) + this.strokeTransparency : this.strokeColor;
      this.fillColor = this.fillTransparency ? this.fillColor.slice(0, 7) + this.fillTransparency : this.fillColor;
      this.strokeTransparency = '';
      this.fillTransparency = '';
    }
  }

  public setStyle(event) {
    // Si se trata de un número, comprobamos que su valor mínimo sea 0 o más
    if (event && !isNaN(parseFloat(event.value)) && isFinite(event.value) && event.value < 0) {
      // @ts-ignore
      this.toast.presentAutocloseToast(this.literals.numberMustBePositive);
    } else {

      const fill = new ol.style.Fill({
        color: this.fillColor,
      });

      this.styles = {
        general: new ol.style.Style({
          fill,
          stroke: new ol.style.Stroke({
            color: this.strokeColor,
            lineDash: this.lineType.value,
            width: this.lineThickness,
          }),
          image: new ol.style.Circle({
            radius: this.pointRadius,
            stroke: new ol.style.Stroke({
              color: this.strokeColor,
              width: this.lineThickness,
            }),
            fill,
          }),
        }),
        text: new ol.style.Style({
          text: new ol.style.Text({
            font: this.fontSize + 'px helvetica,sans-serif',
            fill,
            text: this.selectedFeature && this.geometryType === 'Text' ?
              this.selectedFeature.getStyle()[0].getText().getText() : this.featureText,
            textAlign: this.selectedFeature ? 'end' : 'center',
            stroke: new ol.style.Stroke({
              color: '#fff',
              width: 1,
            }),
          }),
        }),
      };
    }
    // Si tenemos seleccionada una featura, modificamos el estilo
    if (this.selectedFeature) {
      const featureStyles = this.selectedFeature.getStyle();
      featureStyles[0] = this.geometryType === 'Text' ? this.styles.text : this.styles.general;
      this.selectedFeature.setStyle(featureStyles);
    }
  }

  public changeSelectedLayer(selectedLayer: VsLayer) {
    this.deactivateAll();
    this.resetEditFormfeatureAttributes();
    for (const layer of this.editableLayers) {
      if (layer.vsLayer === selectedLayer) {
        this.selectedVsLayer = layer.vsLayer;
        layer.selectedToDraw = true;
      } else {
        layer.selectedToDraw = false;

      }
    }
  }

  private addModifyInteraction() {
    // Reinicio el valor de texto a dibujar
    this.featureText = '';
    // Desactivo la anterior interacción de modificar si la hubiera
    this.deactivateModify();
    this.modifyingStatus = true;
    // Añadimos los eventos del mapa para poner el cursor como pointer al pasar por encima de las features de la capa
    this.setMapEvents();

    this.modifySelect = new ol.interaction.Select({
      layers: [this.selectedVsLayer.olInstance],
      toggleCondition: ol.events.condition.never,
    });

    this.modifySelect.on('select', (evt: ol.interaction.Select.Event) => {
      // Asignar el estilo nuevo a las seleccionadas y restaurar el suyo propio a las deseleccionadas

      if (evt.selected.length) {
        // Añadimos al array las features seleccionadas
        this.selectedFeature = evt.selected[0];
        this.selectedFeature.set('selected', true);
        // Añadimos el estilo propio de selección y cargamos los parámetros en la
        // de estilo de la feature en el panel de modificación de estilos
        this.addSelectStyle(this.selectedFeature);

      } else {
        this.selectedFeature = null;
      }
      for (const feature of evt.deselected) {
        feature.unset('selected');
        this.removeSelectStyle(feature);
      }
    });
    this.map.addInteraction(this.modifySelect);

    this.modify = new ol.interaction.Modify({ features: this.modifySelect.getFeatures() });
    this.modify.on('modifyend', (evt: ol.interaction.Modify.Event) => {
      const selectedFeature = evt.features.getArray()[0];

      // Si lo hemos creado en local, no hay que adjuntarlo a los modificados, sino cambiar el insertado con el nuevo valor.
      let insertedIndex = this.insertedFeatures.indexOf(selectedFeature);
      if (insertedIndex > -1) {
        this.insertedFeatures[insertedIndex] = selectedFeature;
      } else {
        insertedIndex = this.updatedFeatures.indexOf(selectedFeature);
        insertedIndex > -1 ? (this.updatedFeatures[insertedIndex] = selectedFeature) : this.updatedFeatures.push(selectedFeature);
      }
      this.dirty = true;
      this.selectedVsLayer.extent = this.selectedVsLayer.olInstance.getSource().getExtent();
      this.selectedVsLayer.layerChange();
    });
    this.map.addInteraction(this.modify);



    this.snap = new ol.interaction.Snap({ source: this.selectedVsLayer.olInstance.getSource() });
    this.map.addInteraction(this.snap);
    this.setSnapping();

  }

  private addSelectStyle(feature) {
    // Recogemos el estilo original de la feature
    const featureStyle: ol.style.Style = this.getFeatureStyle(feature);
    // Conseguimos el tipo de geometría para extraer los estilos apropiados
    switch (feature.getGeometry().constructor) {
      case ol.geom.Polygon: {
        this.geometryType = 'Polygon';
        break;
      }
      case ol.geom.LineString: {
        this.geometryType = 'LineString';
        break;
      }
      case ol.geom.Point: {
        if (feature.get('name')) {
          this.geometryType = 'Text';
        } else {
          this.geometryType = 'Point';
        }
        break;
      }
      default: {
        break;
      }
    }
    this.checkGeometryTypeStyles();

    // Extraemos los datos de cada estilo para poder modificarlo.
    const fill = featureStyle.getFill();
    const stroke = featureStyle.getStroke();
    if (this.geometryType === 'Polygon' || this.geometryType === 'LineString') {
      this.strokeColor = ol.color.asString(stroke.getColor());
      this.lineThickness = stroke.getWidth();
      this.lineType = this.lineTypes.filter(
        (lineType) => (JSON.stringify(lineType.value) === JSON.stringify(stroke.getLineDash())))[0];
      // Si no encuentra ninguno compatible significa que tiene el de por defecto que es la ralla sólida
      if (!this.lineType) {
        this.lineType = this.lineTypes[0];
      }
    }
    if (this.geometryType === 'Polygon') {
      this.fillColor = ol.color.asString(fill.getColor() as ol.Color);
    }
    if (this.geometryType === 'Point') {
      if (featureStyle.getImage() instanceof ol.style.Circle) {
        const image = featureStyle.getImage() as ol.style.Circle;
        this.pointRadius = image.getRadius();
        this.strokeColor = ol.color.asString(stroke.getColor());
        this.lineThickness = stroke.getWidth();
        this.fillColor = ol.color.asString(fill.getColor() as ol.Color);
      }
    }
    if (this.geometryType === 'Text') {
      const text = featureStyle.getText();
      this.fillColor = ol.color.asString(text.getFill().getColor() as ol.Color);
      // Por defecto la fuente es 10px sans-serif
      this.fontSize = text.getFont() ? parseInt(text.getFont().split('px')[0], 10) : 10;
      this.featureText = text.getText();
      text.setTextAlign('end');
    }

    // Creamos el nuevo estilo combinando el existente con los vértices para diferenciar la seleccionada
    const selectStyle: ol.style.Style[] = [featureStyle,
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({
            color: '#FF6D00',
          }),
        }),
        // Le damos un estilo de puntos naranjas por cada vértice que tenga la geometría.
        // tslint:disable-next-line:no-shadowed-variable
        geometry: (feature: any) => {
          let coordinates: any;
          if (this.geometryType === 'Polygon') {
            // return the coordinates of the first ring of the polygon
            coordinates = (feature.getGeometry() as ol.geom.Polygon).getCoordinates()[0];
          }
          if (this.geometryType === 'LineString') {
            coordinates = (feature.getGeometry() as ol.geom.LineString).getCoordinates();
          }
          if (this.geometryType === 'Text') {
            coordinates = (feature.getGeometry() as ol.geom.Point).getCoordinates();
          }

          if (coordinates) {
            if (!coordinates.some(isNaN)) {
              return new ol.geom.Point(coordinates);
            } else {
              return new ol.geom.MultiPoint(coordinates);
            }
          }
        },
      })];

    feature.setStyle(selectStyle);
  }

  private removeSelectStyle(feature: ol.Feature) {
    // El estilo de selección es un array de estilos, por lo que me quedo con el primero
    // que es donde está el estilo original de la feature
    const featureStyle = (feature.getStyle() as ol.style.Style[])[0];
    // Si se trata de un texto recupero el centrado
    if (feature.getGeometry() instanceof ol.geom.Point && feature.get('name')) {
      featureStyle.getText().setTextAlign('center');
    }
    feature.setStyle(featureStyle);
  }

  private setMapEvents() {
    this.map.on('pointermove', this.pointerMoveMap);
  }

  private unsetMapEvents() {
    this.map.un('pointermove', this.pointerMoveMap);
  }

  private pointerMoveMap = (evt: ol.MapBrowserEvent) => {
    // Si se está moviendo el mapa, dibujando, o no está activa la selección me salgo.
    if (evt.dragging || this.drawingStatus || !this.modifyingStatus) {
      return;
    }
    const pixel = this.map.getEventPixel(evt.originalEvent);
    const features = this.map.getFeaturesAtPixel(pixel, { layerFilter: (layer) => layer === this.selectedVsLayer.olInstance });
    (this.map.getTargetElement() as HTMLElement).style.cursor = features ? 'pointer' : '';
  }



  private deactivateDraw(): void {

    if (this.draw) {
      // Si se encuentra dibujando sin terminar la medición cuando cesa la interacción elimino la geometría
      if (this.unfinished) {
        this.draw.finishDrawing();
        const features = this.selectedVsLayer.olInstance.getSource().getFeatures();
        this.selectedVsLayer.olInstance.getSource().removeFeature(features[features.length - 1]);
      }
      this.map.removeInteraction(this.draw);
      this.draw = null;
      // Si tenemos habilitado el snapping lo eliminamos
      if (this.snap) {
        this.map.removeInteraction(this.snap);
        this.snap = null;
      }

    }
  }

  private deactivateModify(): void {
    this.unsetMapEvents();
    if (this.modify) {
      if (this.modifySelect) {
        this.modifySelect.getFeatures().clear();
        if (this.selectedFeature) {
          this.removeSelectStyle(this.selectedFeature);
          this.selectedFeature.unset('selected');
          this.selectedFeature = null;
        }
        this.map.removeInteraction(this.modifySelect);
        this.modifySelect = null;
      }
      this.map.removeInteraction(this.modify);
      this.modify = null;
      // Si tenemos habilitado el snapping lo eliminamos
      if (this.snap) {
        this.map.removeInteraction(this.snap);
        this.snap = null;
      }
    }
  }


  /**
   * Maneja la activación o desactivación de la herramienta modificar
   *
   * @param {boolean} [state]
   *
   */
  public handleModify(state?: boolean): void {

    if (state !== undefined) this.modifyingStatus = state;
    if (this.modifyingStatus) {
      if (this.drawingStatus) this.handleDraw(false);
      this.layerAction = 'modify';
      this.deactivateDraw();
      this.addModifyInteraction();
      if (!this.isActive) this.activateTool();
    } else {
      this.layerAction = '';
      this.deactivateModify();
      // Sólo se desactiva la herramienta si no se está en ni dibujando ni modificando
      if (!this.drawingStatus) this.deactivateTool();
    }
  }

  /**
   * Maneja la activación o desactivación de la herramienta dibujar
   *
   * @param {boolean} [state]
   *
   * @memberOf VectorLayersEditorComponent
   */

  public handleDraw(state?: boolean): void {

    if (state !== undefined) this.drawingStatus = state;
    // Si está activo
    if (this.drawingStatus) {
      if (this.modifyingStatus) this.handleModify(false);
      this.layerAction = 'draw';
      this.geometryType = DEFAULT_GEOMETRY_DRAW;
      this.changeDrawInteraction(this.geometryType);
      if (!this.isActive) this.activateTool();
    } else {
      this.layerAction = '';
      this.deactivateDraw();
      // Sólo se desactiva la herramienta si no se está en ni dibujando ni modificando
      if (!this.modifyingStatus) this.deactivateTool();
    }
  }

  private getFeatureStyle(feature: ol.Feature): ol.style.Style {
    const style = feature.getStyle();
    if (style) {
      switch (style.constructor) {
        case ol.style.Style:
          return style as ol.style.Style;
        case Array:
          return style[0];
        case Function: {
          return (style as ol.StyleFunction).call(feature)[0];
        }
        default:
          feature.setStyle(this.styles.general.clone());
          return this.styles.general.clone();
      }
    } else {
      feature.setStyle(this.styles.general.clone());
      return this.styles.general.clone();
    }

  }

  public removeSelectedFeatures() {
    this.selectedVsLayer.olInstance.getSource().removeFeature(this.selectedFeature);
    // Si es una feature creada la eliminamos del array
    this.removeFeatureIfExists(this.selectedFeature);
    this.modifySelect.getFeatures().clear();
    this.selectedFeature = null;
  }

  public activateCreate() {
    this.creating = true;
    setTimeout(() => {
      this.layerNameInput.setFocus();
    }, 100);

  }

  public lineTypeComparator(a: any, b: any) {
    if (a.representation === b.representation) {
      return true;
    }
    return false;
  }

  public _showConfirmDeleteLayer() {

    this.confirmDialogService.open({
      message: this.componentLiterals['LAYERS.DELETE_CONFIRM'],
      header: this.componentLiterals['LAYERS.DELETE'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeLayer();
      },
      reject: () => { },
    });

  }

  public setSnapping() {
    if (this.snap) {
      this.snap.setActive(this.snapping);
    }
  }

  /*   public  modifyFeatureText() {
      if (this.selectedFeature && this.featureText) {
        this.selectedFeature.getStyle()[0].getText().setText(this.featureText);
        this.selectedFeature.changed();
      } else {
        this.toast.presentAutocloseToast('El punto debe contener un texto');
      }
    } */

  public editLayerTitle(event, layerItem: LayerToDraw) {
    layerItem.nameEditing = true;
  }

  public stopEditLayerTitle(layerItem: LayerToDraw) {
    layerItem.nameEditing = false;
    // update layer with new name
    this.updateLayers();
  }


  /**
   * Confirma el guardado de WFST
   *
   *
   * @memberOf VectorLayersEditorComponent
   */
  public confirmSaveLayer() {

    this.confirmDialogService.open({
      message: this.componentLiterals['LAYER_EDITOR.SAVE_CONFIRM'],
      header: this.componentLiterals['LAYER_EDITOR.SAVE'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.transactWFS();
      },
      reject: () => { },
    });

  }
  public confirmResetLayer() {

    this.confirmDialogService.open({
      message: this.componentLiterals['LAYER_EDITOR.RESET_CONFIRM'],
      header: this.componentLiterals['LAYER_EDITOR.RESET'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.resetEdition();
      },
      reject: () => { },
    });

  }



  // TODO @joe Mover a un servicio WFS-T
  /**
   * Transaccion WFST
   *
   * @private
   *
   * @memberOf VectorLayersEditorComponent
   */
  private transactWFS() {
    const currentUser = this.globalAuthService.getCurrentUser();
    const formatWFS = new ol.format.WFS({ gmlFormat: new ol.format.GML2() });
    const formatGML = {
      featureNS: (this.selectedVsLayer as VsLayerWFS).featureNS,
      nativeElements: [],
      featureType: this.selectedVsLayer.name.replace((this.selectedVsLayer as VsLayerWFS).workSpace + ':', ''),
      featurePrefix: (this.selectedVsLayer as VsLayerWFS).workSpace,
      version: '1.1.0',
      srsName: this.map
        .getView()
        .getProjection()
        .getCode(),
    };
    const xs = new XMLSerializer();
    const node = formatWFS.writeTransaction(this.insertedFeatures, this.updatedFeatures, this.deletedFeatures, formatGML);
    const payload = xs.serializeToString(node);
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(currentUser.userName + ':' + currentUser.password),
    });
    const httpOptions = {
      headers,
      responseType: 'text' as 'text', // Necesario para que no de error en la respuesta
    };
    this.httpClient.post((this.selectedVsLayer as VsLayerWFS).service.url, payload, httpOptions)
      .subscribe(
        (response) => {
          // Se hace un reset porque ya se han guardado los datos y se solicitarán de nuevo actualizados.
          this.resetEdition();
        },
        // (error) => {
        //   this.toast.showError({summary:"Guardar capa",detail:"Se ha producido un error al guardar la capa" + error});
        // },
      );
  }

  private resetEdition() {
    this.dirty = false;
    this.insertedFeatures = [];
    this.updatedFeatures = [];
    this.deletedFeatures = [];
    this.selectedVsLayer.olInstance.getSource().clear();
    if (this.modifySelect) {
      this.modifySelect.getFeatures().clear();
    }
  }

  private removeFeatureIfExists(removedFeature) {
    const insertedIndex = this.insertedFeatures.indexOf(removedFeature);
    this.updatedFeatures = this.updatedFeatures.filter((feature) => feature !== removedFeature);
    // Si está insertada es que la acabamos de crear, por lo tanto no hay que eliminarla en remoto
    if (insertedIndex > -1) {
      this.insertedFeatures.splice(insertedIndex, 1);
      if (this.insertedFeatures.length === 0 && this.updatedFeatures.length === 0 && this.deletedFeatures.length === 0) {
        this.dirty = false;
      }
    } else {
      this.deletedFeatures.push(removedFeature);
      this.dirty = true;
    }
  }

  private presentEditAttributesModal(feature: ol.Feature, skeletonAttributes: any[]) {
    /** Si no hay atributos del formulario generados y la capa tiene atributos, se generan */
    this.generateFeatureAttributes(feature, skeletonAttributes);
    this.showFeatureEdit = true;

  }



  private getFeatureAttributes(url, layer: VsLayerWFS) {
    this.wfsReaderService
      .getWFSDescribeFeatureTypeAsync(url, layer.name)
      .then(
        (featureTypes: any) => {
          const featureNS = featureTypes.$.targetNamespace;
          // En geoserver se añade a cada capa el nombre del workspace primero --> visor_jcyl:poligonos
          // Por ello lo capturamos, para poder decirdir si son la misma capa y añadir sus atributos
          let workSpace = '';
          for (const key in featureTypes.$) {
            if (key !== 'targetNamespace' && featureTypes.$[key] === featureNS) {
              workSpace = key;
            }
          }
          // Asigno el namespace
          layer.featureNS = featureNS;
          layer.workSpace = workSpace;
          const featureType = featureTypes.complextype;

          for (const element of featureType.complexcontent.extension.sequence.element) {
            if (element.$.type.includes('gml:')) {
              layer.geometryName = element.$.name;
              layer.geometryType = this.getGeometryTypeFromGML(element.$.type.replace('gml:', '')) as ol.geom.GeometryType;
            } else {
              // Recoger aquí los parámetros que debe tener y cuáles son obligatorios
              layer.attributes.push({
                name: element.$.name,
                required: element.$.nillable === 'false',
                type: this.getAttributeTypeFromGML(element.$.type.replace('xsd:', '')),
              });
            }
          }
        },
        (err) => {
          this.toast.showError({ detail: 'Error al guardar la capa ' + err, summary: 'Error al guardar' });
        },
      )
      .catch((err) => {
        this.toast.showError({ detail: 'Error al guardar la capa  ' + err, summary: 'Error al guardar' });
      });
  }

  private getAttributeTypeFromGML(gmlType: string): string {
    switch (gmlType) {
      case 'int':
      case 'decimal':
      case 'double':
      case 'float':
        return 'number';
      case 'string':
        return 'text';
      case 'dateTime':
      case 'date':
      case 'time':
      case 'boolean':
        return gmlType;
      default:
        return 'text';
    }
  }
  private getGeometryTypeFromGML(gmlType: string): string {
    switch (gmlType) {
      case 'MultiSurfacePropertyType':
        return 'MultiPolygon';
      case 'SurfacePropertyType':
        return 'Polygon';
      case 'MultiLineStringPropertyType':
        return 'MultiLineString';
      case 'LineStringPropertyType':
        return 'LineString';
      case 'MultiPointPropertyType':
        return 'MultiPoint';
      case 'PointPropertyType':
        return 'Point';
      default:
        return '';
    }
  }

  //  ****************************************************** Metodos de la ventana de edición de features *************************************************** */

  /**
   *
   *
   * @private
   * @param {ol.Feature} feature
   * @param {any} skeletonAttributes
   *
   * @memberOf VectorLayersEditorComponent
   */
  private generateFeatureAttributes(feature: ol.Feature, skeletonAttributes): void {
    this.editFormfeatureAttributes = [];
    for (const attr of skeletonAttributes) {
      this.someFieldRequired = this.someFieldRequired || attr.required;
      this.onEditFeature = feature;
      this.editFormfeatureAttributes.push({ key: attr.name, value: feature.get(attr.name), required: attr.required, type: attr.type });
    }
  }


  private resetEditFormfeatureAttributes() {
    this.editFormfeatureAttributes = [];

  }

  public editSelectedFeaturesAttributes() {
    if (this.selectedVsLayer instanceof VsLayerWFS) this.presentEditAttributesModal(this.selectedFeature, this.selectedVsLayer.attributes);
  }


  public onAttrChange(item) {
    this.dirty = true;
  }


  public closeDialog() {
    this.showFeatureEdit = false;
  }

  /**
   * Guarda los cambios de la feature editada
   *
   *
   * @memberOf VectorLayersEditorComponent
   */
  public saveFeatures() {
    for (const attribute of this.editFormfeatureAttributes) {
      this.onEditFeature.set(attribute.key, attribute.value);
    }

    this.dirty = true;
    // Si lo hemos creado en local, no hay que adjuntarlo a los modificados, sino cambiar el insertado con el nuevo valor.
    let insertedIndex = this.insertedFeatures.indexOf(this.onEditFeature);
    if (insertedIndex > -1) {
      this.insertedFeatures[insertedIndex] = this.onEditFeature;
    } else {
      insertedIndex = this.updatedFeatures.indexOf(this.onEditFeature);
      insertedIndex > -1 ? (this.updatedFeatures[insertedIndex] = this.onEditFeature) : this.updatedFeatures.push(this.onEditFeature);
    }
    this.showFeatureEdit = false;

  }


}
