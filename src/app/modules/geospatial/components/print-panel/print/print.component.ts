import { ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import * as ol from 'openlayers';
import { VsMap } from '@cotvisor/models/vs-map';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsLayerVector } from '@cotvisor/models/vs-layer-vector';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsLayerWMTS } from '@cotvisor/models/vs-layer-wmts';
import { takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gss-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.scss']
})
export class PrintComponent extends ParentComponent implements OnInit, OnDestroy, AfterViewInit {
  public map: VsMap;
  public previousTarget: string | Element;
  public previousView: { center: ol.Coordinate; zoomLevel: number };

  public mapTitle: string;
  public mapDescription: string;
  public srs: string;
  public formatTypes: any;
  public format: any;
  public legends: Array<{ layerName: string; url: string }> = [];
  public selectedLegends: Array<{ layerName: string; url: string }> = [];
  public orientations: any[] = [{ name: 'horizontal' }, { name: 'vertical' }];

  public orientation: any;
  public centerCoord: number[];
  public activationArray = {
    title: false,
    description: false,
    legends: false,
    coordinates: true,
    srs: true,
    centerCoord: false,
    gridCoord: false,
  };

  public wheelMouseInteraction: ol.interaction.MouseWheelZoom;
  public zoomControl: ol.control.Zoom;
  public extent: number[];

  public markerFeature: ol.Feature;
  public markerVector: VsLayerVector;

  protected centerIcon = 'assets/icons/center.png';

  private altoPagina = 210;
  private anchoPagina = 297;
  private margenPagina = 10;
  private inlineMediaStyle: any;
  private currZindex = 1;

  private active: boolean = false;

  public objectKeys = Object.keys;

  public DEFAULT_MAP_TITLE: string = 'Mapa';

  @ViewChild('mapPrinterContainer') public mapPrinterContainer: ElementRef;
  @ViewChild('innerPrinterContainer') public innerPrinterContainer: ElementRef;

  // FIXME la aplicaacion da error al cerrar el panel por segunda vez. Entra en el Setter demasiadas veces.
  @Input('active')
  public set $active(value: boolean) {
    if (value) {
      this.onOpen();
    } else {
      this.onClose();
    }
  }

  constructor(
    private vsMapService: VsMapService,
    private renderer: Renderer2,
    private cdRef: ChangeDetectorRef,
  ) {
    super();

    // Suscribimos el cambio de mapa activo
    this.vsMapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((vsMap) => {
        if (vsMap) {
          this.map = vsMap;
          if (this.active) {
            this.initializeMap();
          }
        }
      });
    this.formatTypes = environment.print_config.paper_formats;
    // this.formatTypes = this.objectKeys(this.formats);
    this.format = this.formatTypes[4]; // a4
    this.orientation = this.orientations[0]; // vertical
    this.centerCoord = [];

    // Añadimos la gratícula
    // this.addGraticule();
  }

  public ngOnInit(): void {
    // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    // Add 'implements OnInit' to the class.
    this.onChangeFormat();

  }

  public ngAfterViewInit() {
    this.addClassToCloseButton();
  }

  private addClassToCloseButton() {
    const panel = document.getElementById('printPanel');
    const node = panel.querySelector('.ui-sidebar-close');
    node.classList.add('noprint');
    const iconNode = panel.querySelector('.pi-times');
    iconNode.classList.add('noprint');
  }


  private initializeMap() {
    if (this.map) {
      this.active = true;
      this.previousView = { center: this.map.getView().getCenter(), zoomLevel: this.map.getView().getZoom() };
      this.previousTarget = this.map.getTarget();
      this.map.setTarget('map-printer');
      this.map.title = this.DEFAULT_MAP_TITLE;
      this.mapDescription = 'Descripción del mapa';
      this.mapTitle = this.map.title;
      this.extent = this.map
        .getView()
        .calculateExtent(this.map.getSize())
        .map((el) => {
          return Number(el.toFixed(2));
        });
      // Creo el punto centro
      this._createMarkerVector();
      // Desactivo la rueda del raton como zoom
      this.getWheelMouseInteraction();
      this.wheelMouseInteraction.setActive(false);

      // Activo el control de zoom
      this.zoomControl = new ol.control.Zoom({});
      this.map.addControl(this.zoomControl);

      // Activo los eventos sobre el mapa
      this.setMapEvents();

      // Recuperamos las leyendas de las capas visible
      this.selectedLegends = [];
      this.getLegends();

      // Recuperamos la proyección actual con su nombre
      this.getMapProjection();
      // Ajustamos el tamaño de página
      this.adjustPageSize();

    }

  }


  /**
   * Metodo que se ejecuta al abrir el panel de impresion
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @memberof PrintComponent
   */
  public onOpen() {

    this.initializeMap();
    this.map.deactivateCurrentTool(); // desactivar herramienta (si hay una abierta)
  }

  /**
   * Antes de cerrar la ventana de impresión, devuelvo el mapa a su target y posición originales
   *
   * @memberof PrintComponent
   */
  public onClose() {
    if (this.active) {
      this.map.setTarget(this.previousTarget);
      // Restauro el mapa tal cual vino
      this.map.getView().setCenter(this.previousView.center);
      this.map.getView().setZoom(this.previousView.zoomLevel);
      // Activo la rueda del raton como zoom
      this.wheelMouseInteraction.setActive(true);
      // Desactivo el control de zoom
      this.map.removeControl(this.zoomControl);
      // Desactivo los eventos sobre el mapa
      this.unsetMapEvents();
      // Desactivo el vector del punto medio
      this._removeMarkerVector();
      // Elimino el media style usado para los page
      this.removeInlineMediaStyle();
      this.active = false;
    }
  }

  public onChangeFormat() {
    this.adjustPageSize();
  }

  private adjustPageSize() {
    if (this.orientation.name === 'horizontal') {
      this.anchoPagina = this.format.h;
      this.altoPagina = this.format.w;
    } else {
      this.anchoPagina = this.format.w;
      this.altoPagina = this.format.h;
    }
    this.setDimensions();
    this.changeMediaStyle();
  }

  /**
   * Método necesario para lanzar la detección de fallos y no pueda mostrar el error
   * “expression has changed after it was checked”
   *
   * @param {*} event
   * @memberof PrintComponent
   */
  public changeActivation(event) {
    if (!event.value) {
      this.cdRef.detectChanges();
    }
  }

  public setDimensions() {
    this.renderer.setStyle(this.mapPrinterContainer.nativeElement, 'width', this.anchoPagina + 'mm');
    this.renderer.setStyle(this.mapPrinterContainer.nativeElement, 'height', this.altoPagina + 'mm');
    this.renderer.setStyle(this.mapPrinterContainer.nativeElement, 'padding', this.margenPagina + 'mm');
    if (this.map) {
      this.extent = this.map
        .getView()
        .calculateExtent(this.map.getSize())
        .map((el) => {
          return Number(el.toFixed(2));
        });
      this.map.updateSize();
    }
  }

  /**
   * Método utilizado para cambiar el zindex del elemento draggable seleccionado.
   * De esta forma no queda ningún elemento por debajo de otro al moverlos.
   *
   * @param {*} event
   * @memberof PrintComponent
   */
  public changeZindex(event) {
    const target = event.currentTarget || event.target || event.srcElement;
    this.currZindex++;
    this.renderer.setStyle(target, 'z-index', this.currZindex);
  }

  private setMapEvents() {
    /*     this.map.on('pointerdrag', this.moveMap);
        this.map.on('moveend', this.moveMap); */
    this.map.on('postcompose', this.moveMap);
  }
  private unsetMapEvents() {
    /* this.map.un('pointerdrag', this.moveMap);
    this.map.un('moveend', this.moveMap); */
    this.map.un('postcompose', this.moveMap);
  }

  private moveMap = (evt: ol.MapBrowserEvent) => {
    this.extent = this.map
      .getView()
      .calculateExtent(this.map.getSize())
      .map((el) => {
        return Number(el.toFixed(2));
      });
    this.centerCoord = this.map
      .getView()
      .getCenter()
      .map((el) => {
        return Number(el.toFixed(2));
      });
    if (this.markerFeature) {
      this.markerFeature.setGeometry(new ol.geom.Point(this.map.getView().getCenter()));
    }
  }

  private changeMediaStyle() {
    const head = document.getElementsByTagName('head')[0];
    const newStyle = document.createElement('style');
    const page = '@page { size: ' + this.format + (this.orientation === 'horizontal' ? ' landscape' : '') + '; margin:0;}';
    const print =
      '@media print {html,body {width:' + this.anchoPagina + 'mm !important;' + ' height:' + this.altoPagina + 'mm !important;}}';
    newStyle.setAttribute('type', 'text/css');
    newStyle.appendChild(document.createTextNode(page + print));
    if (this.inlineMediaStyle != null) {
      head.replaceChild(newStyle, this.inlineMediaStyle);
    } else {
      head.appendChild(newStyle);
    }
    this.inlineMediaStyle = newStyle;
  }

  private removeInlineMediaStyle() {
    const head = document.getElementsByTagName('head')[0];
    head.removeChild(this.inlineMediaStyle);
    this.inlineMediaStyle = null;
  }


  private _createMarkerVector() {
    const iconStyle = new ol.style.Style({
      image: new ol.style.Icon(
        /** @type {olx.style.IconOptions} */({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          opacity: 1,
          src: this.centerIcon,
        }),
      ),
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
      updateWhileInteracting: true,
      updateWhileAnimating: true,
    });
    this.markerVector = new VsLayerVector({
      name: 'centro_mapa',
      title: 'Centro del mapa',
      projection: this.map
        .getView()
        .getProjection()
        .getCode(),
      opt_options: {
        queryable: false,
        isTopLayer: true,
        olInstance: olLayerInstance,
      },
    });
    this.map.addVsLayer(this.markerVector);
    this.markerVector.setVisible(this.activationArray.centerCoord);
  }

  private _removeMarkerVector() {
    if (this.markerVector) {
      this.map.removeVsLayer(this.markerVector);
    }
  }

  private getWheelMouseInteraction() {
    this.map.getInteractions().forEach((interaction) => {
      if (interaction instanceof ol.interaction.MouseWheelZoom) {
        this.wheelMouseInteraction = interaction;
      }
    });
  }

  private getLegends() {
    // TODO: Comprobar que al eliminar una capa que tiene una leyenda activa, esta se quite del mapa de impresión
    const visibleLayers = this.map.getVisibleLayers();
    this.legends = [];
    for (const layer of visibleLayers) {
      if ((layer instanceof VsLayerWMS || layer instanceof VsLayerWMTS) && layer.activeStyle && layer.activeStyle.legendURL.length) {
        this.legends.push({ layerName: layer.title, url: layer.activeStyle.legendURL[0].onlineResource });
      }
    }
  }

  private getMapProjection() {
    for (const projection of environment.all_app_projections) {
      if (
        projection.code ===
        this.map
          .getView()
          .getProjection()
          .getCode()
      ) {
        this.srs = projection.name + ' - ' + projection.code;
      }
    }
  }

  // private addGraticule() {
  //   const graticule = new ol.Graticule({
  //     strokeStyle: new ol.style.Stroke({
  //       color: 'rgba(255,120,0,0.9)',
  //       width: 2,
  //       lineDash: [0.5, 4],
  //     }),
  //     showLabels: true,
  //     map: this.map,
  //   });
  //   graticule.setMap(this.map);
  // }
}
