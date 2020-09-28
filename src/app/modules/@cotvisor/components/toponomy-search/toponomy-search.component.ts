import { Component, OnDestroy } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';

import { VsMapService } from '@cotvisor/services/vs-map.service';
import { ToastService } from '@theme/services/toast.service';
import { takeUntil } from 'rxjs/operators';
import * as ol from 'openlayers';
import { environment } from 'src/environments/environment';
import { HttpProxyService } from '@cotvisor/services/http-proxy.service';
import { ErrorVisor } from '@cotvisor/classes/error-visor.class';
import { Subject } from 'rxjs';


/**
 * buscador de entidades
 *
 * @export
 * @class GenericSearchComponent
 * @extends {ParentComponent}
 */
@Component({
  selector: 'cot-toponomy-search',
  styleUrls: ['./toponomy-search.component.scss'],
  templateUrl: './toponomy-search.component.html',
})
export class ToponomySearchComponent extends ParentComponent implements OnDestroy {

  public places: any;
  public url: string;
  public reset: boolean = true;
  public searchTerm: string;
  public searching: boolean;
  public loading: boolean; // adding feature to searchlayer
  minSearchStringLength = 3;


  public selectedPlace: {};

  private unSubscribeSearch: Subject<boolean> = new Subject<boolean>();


  constructor(private httpProxy: HttpProxyService, private mapService: VsMapService, private toastService: ToastService) {

    super();
    // Url base servicio geocoder Cartociudad
    this.url = 'http://www.cartociudad.es/geocoder/api/geocoder/';
    // this.url = "http://nominatim.openstreetmap.org/search?";  <-- Para openstreetmap
    this.resetComponent();
    this.mapService.searchLayerCleared$.subscribe(() => {
      if (this.reset) {
        this.resetComponent();
      }
    });
  }
  public resetComponent() {
    this.places = [];
    this.searching = false;
    this.loading = false;
    this.searchTerm = '';
    this.selectedPlace = null;
    this.unSubscribe.next(); // cancelar peticiones
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.unSubscribeSearch.next(true);
    this.unSubscribeSearch.complete();
  }



  /**
   * Funcion para controlar los eventos teclado del input de la busqueda
   *
   * @param {*} e
   * @memberof ToponomySearchComponent
   */
  public onKeyUp(e) {
    if (e.keyCode === 13) {
      if (e.currentTarget.value.length >= environment.search_min_length_term) {
        this.searchPlaces(e.currentTarget.value, true);
      }
    } else {
      if (e.currentTarget.value.length >= environment.search_min_length_term) {
        this.searchPlaces(e.currentTarget.value, false);
      }
    }
  }

  /**
   * buscar ubicaciones de un geocoder a partir de un string
   *
   * @param {*} event
   * @param {*} loadFirst // para cargar el primer resultado una vez terminada la peticion o no
   * @memberof ToponomySearchComponent
   */
  public searchPlaces(queryString: any, loadFirst: boolean) {
    this.searchTerm = queryString;
    this.searching = false;
    // Cancelo anteriores peticiones de búsqueda
    this.unSubscribeSearch.next(true);
    if (this.searchTerm && this.searchTerm.length >= environment.search_min_length_term) {
      this.searching = true;
      const apiURL = this.url + 'candidatesJsonp?q=' + this.searchTerm + '&limit=10'; // cartociudad
      this.httpProxy.getJsonp(apiURL).pipe(takeUntil(this.unSubscribeSearch))
        .subscribe((data) => {
          this.places = data;
          this.searching = false;
          if (loadFirst === true) {
            this.loadFirstSuggestion();
          }
        },
          (error) => {
            this.searching = false;
            throw new ErrorVisor('ToponomySearchComponent', 'Error al consultar lugares', error.stack);
          }
        );
    }
  }





  /**
   * carga un resultado de la busqueda y añadirlo al mapa
   *
   * @param {string} id
   * @param {string} tye
   * @param {string} portl
   *
   * @memberOf ToponomySearchComponent
   */
  public loadPlace(id: string, type: string, portal: string) {
    this.loading = true;
    // Cancelo anteriores peticiones de búsqueda
    // this.unSubscribeSearch.next(true);
    let apiURL;
    if (portal) {
      apiURL = this.url + 'findJsonp?id=' + id + '&type=' + type + '&portal=' + portal;
    } else {
      apiURL = this.url + 'findJsonp?id=' + id + '&type=' + type;
    }
    this.httpProxy.getJsonp(apiURL)
      .pipe(takeUntil(this.unSubscribeSearch))
      .subscribe(
        (data) => {
          // this.spinnerService.closeLoading();
          const feature = new ol.format.WKT().readFeature(data.geom, { featureProjection: environment.map_view.default_projection, dataProjection: 'EPSG:4326' });
          const activeMap = this.mapService.getActiveMap();
          // Elimino todas las búsquedas anteriores, evitando que se reinicie el componente
          this.reset = false;
          this.mapService.clearSearchLayer();
          this.reset = true;
          // Añado la feature a la capa
          this.mapService.addFeaturesToSearchLayer([feature]);
          // Centro el mapa en la búsqueda
          activeMap.getView().fit(feature.getGeometry().getExtent(), { duration: 500, maxZoom: 17 });
          // Añado un popup con la opción ir a
          this.loading = false;
        },
        (error) => {
          this.toastService.showError({ detail: 'Error al cargar la localización', summary: 'error' });
          this.loading = false;
        });

  }


  /**
   * carga la primera sugerencia de la lista de places
   *
   * @memberof ToponomySearchComponent
   */
  public loadFirstSuggestion() {
    if (this.places.length) {
      if (this.places.length > 0) {
        const firstSuggestion = this.places[0];
        this.loadPlace(firstSuggestion.id, firstSuggestion.type, firstSuggestion.portal);
        this.selectedPlace = firstSuggestion;
      }
    }
  }
}

