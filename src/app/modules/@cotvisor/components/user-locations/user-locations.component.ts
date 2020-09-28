import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserLocationsService } from '@cotvisor/services/user-locations.service';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { VsUserLocation } from '@cotvisor/models/vs-user-location';
import * as ol from 'openlayers';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { takeUntil } from 'rxjs/operators';
import { VsMap } from '@cotvisor/models/vs-map';
import { ToastService } from '@theme/services/toast.service';
import { Observable } from 'rxjs';
import { GlobalAuthService } from '@cotvisor-admin/services';
@Component({
  selector: 'cot-user-locations',
  templateUrl: 'user-locations.component.html',
  styleUrls: ['user-locations.component.scss']
})
export class UserLocationsComponent extends ParentComponent implements OnInit {

  @ViewChild('overlayElement') public overlayElement: ElementRef;
  private map: VsMap;
  private locationsVectorLayer: ol.layer.Vector;
  private cursor: HTMLElement;
  public locationPopup: ol.Overlay;
  public userLocations: VsUserLocation[];
  public showPopup: boolean = false;
  public selectedUserLocation: VsUserLocation = null;
  public _showAll: boolean;
  public loading$: Observable<boolean>;

  sortOptions: { label: string; value: string; }[];
  sortKey: string;
  sortField: string;
  sortOrder: number;

  @Input()
  set showAll(val: boolean) {
    this._showAll = val;
    if (val === true && this.locationsVectorLayer) {
      this.showAllLocations();
    } else if (val === false && this.locationsVectorLayer) {
      this.hideAllLocations();
    }
  }
  get showAll(): boolean {
    return this._showAll;
  }

  constructor(
    public userLocationsService: UserLocationsService,
    private mapService: VsMapService,
    private confirmDialogService: ConfirmDialogService,
    private toastService: ToastService,
    private globalAuthService: GlobalAuthService) {
    super();
  }

  public ngOnInit() {
    // Suscribimos el cambio de mapa activo
    this.mapService.activeMapChanged$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((vsMap) => {
        if (vsMap) {
          this.initComponentMap(vsMap);
        }
      });
    this.globalAuthService.authState$.subscribe((user) => {
      if (user && user.id) {
        this.userLocationsService.getByUserId(user.id);
      }
    });

    this.loading$ = this.userLocationsService.loading$;
    // recoge traducciones
    this.useLiterals(['USER_LOCATIONS.DELETE_LOCATION', 'USER_LOCATIONS.DELETE_LOCATION_QUESTION', 'USER_LOCATIONS.LOCATION_DELETED']);
    this.sortOptions = [
      { label: 'ID', value: 'id' },
      { label: 'Nombre desc', value: '!name' },
      { label: 'Nombre asc', value: 'name' }
    ];
  }

  /**
   *
   * Inicializa las propiedaes del componente relacionadas con el mapa
   *
   * @private
   * @param {VsMap} vsMap
   *
   * @memberOf UserLocationsComponent
   */
  private initComponentMap(vsMap: VsMap) {
    this.map = vsMap;
    // crea capa de ubicaciones
    this.createUserLocationsLayer();
    // recogemos ubicaciones ya guardadas
    this.userLocationsService.userLocationsStore$.subscribe((locations) => {
      if (locations) {
        this.userLocations = locations;
        // limpia features existentes
        this.locationsVectorLayer.getSource().clear();
        // crea una feature para cada ubicacion
        this.createFeatureForEachUserLocation();
      }
    });
    // crear evento al hover sobre la feature de un userLocation
    this.addFeatureHoverEvent();
    // crear evento al click la feature de un userLocation
    this.addFeatureClickEvent();
  }

  /**
   * metodo que añade un evento que dispara al mover el raton sobre una feature de la capa de ubicaciones
   *
   * @private
   * @memberof UserLocationsComponent
   */
  private addFeatureHoverEvent() {
    this.map.on('pointermove', (evt: any) => {
      this.cursor = (this.map.getTargetElement() as HTMLElement);
      if (!this.cursor) return;
      // comprueba si el mouse coincide con una feature de la capa de ubicaciones
      const hit = this.map.forEachFeatureAtPixel(evt.pixel, (feature, layer) => {
        if (feature.get('type') === 'userLocation') {
          return true;
        }
      });
      // si coincide, cambia el cursor
      if (hit) {
        this.cursor.style.cursor = 'pointer';
      } else {
        // si hay una herramienta activa, aplicar su estilo del cursor
        if (this.map.activeTool) {
          // componentes que utilizan crosshair
          if (this.map.activeTool.constructor.name === 'ToolGeographicInfoComponent'
            || this.map.activeTool.constructor.name === 'IdentifyComponent'
            || this.map.activeTool.constructor.name === 'ToolUserLocationComponent') {
            this.cursor.style.cursor = 'crosshair';
          } else {
            this.cursor.style.cursor = '';
          }
        } else {
          this.cursor.style.cursor = '';
        }

      }
    });
  }


  /**
   *  metodo que añade un evento que dispara al hacer click sobre una feature de la capa de ubicaciones
   *
   * @private
   * @memberof UserLocationsComponent
   */
  private addFeatureClickEvent() {
    this.map.on('singleclick', (evt: any) => {
      this.map.forEachFeatureAtPixel(evt.pixel, (feature: ol.Feature, layer) => {
        if (feature) {
          if (feature.get('type') === 'userLocation') {
            this.showPopup = true;
            // recoge la userlocation asociada a la feature para seleccionarlo
            const clickedUserLocation = this.userLocations.find(x => x.id === feature.getId());
            this.userLocationClicked(clickedUserLocation);
          }
        }
      });
    });
  }


  /**
   * genera una capa nueva para poder mostrar en el mapa las features asociadas a las userLocations
   *
   * @memberof UserLocationsComponent
   */
  public createUserLocationsLayer() {
    const iconStyle = new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'assets/icons/marker.png'
        // src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg'
      }))
    });
    this.locationsVectorLayer = new ol.layer.Vector({

      source: new ol.source.Vector(),
      style: iconStyle
    });
    this.locationsVectorLayer.setMap(this.map);
  }

  private createFeatureForEachUserLocation() {
    this.locationsVectorLayer.getSource().clear();
    const mapProjection = this.map.getView().getProjection().getCode();
    this.userLocations.forEach((location: VsUserLocation) => {
      this.createFeatureForLocation(location, mapProjection);
    });
  }

  /**
   * crea una feature para una userLocation y la asigna un id
   *
   * @private
   * @param {VsUserLocation} userLocation
   * @param {*} mapProjection
   * @memberof UserLocationsComponent
   */
  private createFeatureForLocation(userLocation: VsUserLocation, mapProjection) {
    const feature: ol.Feature = new ol.format.WKT().readFeature(userLocation.wktPoint);
    const coordinates = (feature.getGeometry() as ol.geom.Point).getCoordinates();
    const iconFeature = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.transform(coordinates, userLocation.srs, mapProjection)),
      name: userLocation.name,
      show: userLocation.show,
      type: 'userLocation'
    });
    // asigna el id
    iconFeature.setId(userLocation.id);
    // mostrar/esconder feature segun propiedad show de la ubicacion asociada
    if (userLocation.show) {
      iconFeature.setStyle(null);
    } else {
      iconFeature.setStyle(new ol.style.Style({}));
    }
    // add feature to locations layer
    this.locationsVectorLayer.getSource().addFeature(iconFeature);
  }


  /**
   * metodo que se ejecuta al hacer click sobre una ubicacion en el panel
   *
   * @param {VsUserLocation} userLocation
   * @memberof UserLocationsComponent
   */
  public userLocationClicked(userLocation: VsUserLocation) {
    // get current map projection
    const mapProjection = this.mapService.getActiveMap().getView().getProjection().getCode();
    // centrar mapa en coordenadas reproyectadas de la ubicacion
    const feature: ol.Feature = new ol.format.WKT().readFeature(userLocation.wktPoint);
    const coordinates = (feature.getGeometry() as ol.geom.Point).getCoordinates();
    this.map.getView().setCenter(ol.proj.transform(coordinates, userLocation.srs, mapProjection));
    // aplicar zoom guardada
    this.map.getView().setZoom(userLocation.zoom);
    // remove previous overlay
    this.removeOverlay();
    // show location feature
    userLocation.show = true;
    this.toggleUserLocationFeature(userLocation);
    // definir ubicacion seleccionada para mostrar sus atributos
    this.selectedUserLocation = userLocation;
    // open overlay to show location info
    this.addOverlay();
  }


  /**
   * encender / apagar feature de la ubicacion
   *
   * @param {VsUserLocation} userLocation
   * @memberof UserLocationsComponent
   */
  public toggleUserLocationFeature(userLocation: VsUserLocation) {
    // busca feature relacionada al userLocation
    const feature = this.locationsVectorLayer.getSource().getFeatureById(userLocation.id);
    if (feature) {
      // mostrar/esconder feature segun propiedad show de la userLocation asociada
      if (userLocation.show) {
        feature.setStyle(null);
      } else {
        feature.setStyle(new ol.style.Style({}));
        // quita el popup
        this.removeOverlay();
      }
    }
  }


  /**
   * mostrar confirmacion para borrar la ubicacion
   *
   * @memberof UserLocationsComponent
   */
  public showConfirmDeleteLocation(userLocation: VsUserLocation) {
    this.confirmDialogService.open({
      message: this.componentLiterals['USER_LOCATIONS.DELETE_LOCATION_QUESTION'],
      header: this.componentLiterals['USER_LOCATIONS.DELETE_LOCATION'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // eliminar userLocation
        this.userLocationsService.delete(userLocation.id).pipe()
          // catchError((error) => this.servicesErrorManager.handleError(error)),
          .subscribe(
            _success => {
              this.deleteUserLocationFeature(userLocation);
              this.toastService.showSuccess({ summary: this.componentLiterals['USER_LOCATIONS.LOCATION_DELETED'], detail: '' });
            });


        // elimina su popup
        this.removeOverlay();
      },
      reject: () => { }
    });
  }


  /**
   * eliminar feature asociada a una userLocation del mapa
   *
   * @private
   * @param {VsUserLocation} userLocation
   * @memberof UserLocationsComponent
   */
  private deleteUserLocationFeature(userLocation: VsUserLocation) {
    // busca feature relacionada al userLocation
    const feature = this.locationsVectorLayer.getSource().getFeatureById(userLocation.id);
    if (feature) {
      this.locationsVectorLayer.getSource().removeFeature(feature);
    }
  }

  /**
   * Añade el overlay con el popup al mapa
   * @return {[type]} [description]
   */
  private addOverlay() {
    const feature: ol.Feature = new ol.format.WKT().readFeature(this.selectedUserLocation.wktPoint);
    const coordinates = (feature.getGeometry() as ol.geom.Point).getCoordinates();
    this.locationPopup = new ol.Overlay({
      element: this.overlayElement.nativeElement,
      position: ol.proj.transform(coordinates, this.selectedUserLocation.srs, this.mapService.getActiveMap().getView().getProjection().getCode()),
      positioning: 'bottom-left',
      stopEvent: true,
      offset: [0, 0],
    });

    this.map.addOverlay(this.locationPopup);
    this.showPopup = true;
  }

  /**
   * Elimina el overlay
   * @return {[type]} [description]
   */
  public removeOverlay() {
    this.map.removeOverlay(this.locationPopup);
    this.showPopup = false;
  }


  /**
   * mostrar todas las features asociadas a las userLocations y actualizar sus valores "show"
   *
   * @private
   * @memberof UserLocationsComponent
   */
  private showAllLocations() {
    // show each feature
    const features = this.locationsVectorLayer.getSource().getFeatures();
    features.forEach((feature) => {
      feature.setStyle(null);
    });
    // change property "show" for each userLocation object
    this.userLocations.forEach((userLocation: VsUserLocation) => {
      userLocation.show = true;
    });
  }


  /**
   * esconder todas las features asociadas a las userLocations y actualizar sus valores "show"
   *
   * @private
   * @memberof UserLocationsComponent
   */
  private hideAllLocations() {
    // hide each feature
    const features = this.locationsVectorLayer.getSource().getFeatures();
    features.forEach((feature) => {
      feature.setStyle(new ol.style.Style({}));
    });
    // change property "show" for each userLocation object
    this.userLocations.forEach((userLocation: VsUserLocation) => {
      userLocation.show = false;
    });
  }

  onSortChange(event) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
}
