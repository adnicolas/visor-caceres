import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '@theme/services/toast.service';
import { environment } from 'src/environments/environment';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { ResponseStatus } from '@cotvisor/models/vs-response-status.enum';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { WmsReaderService } from '@cotvisor/services/wms-reader.service';
/**
 * Componente para la carga de capas de servidores WMS en el mapa activo
 *
 * @export
 * @class WmsLoaderComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'cot-wms-loader',
  templateUrl: './wms-loader.component.html',
  styleUrls: ['./wms-loader.component.scss']
})
export class WmsLoaderComponent extends ParentComponent implements OnInit {

  public url: string;
  public activeUrl: string;
  public serverList: { url: string; title: string; }[] = [];
  public serverListLoaded: boolean = false;
  public serverDescription: string;
  public serverTitle: string;
  public serverLayers: {
    vsLayer: VsLayerWMS;
    loaded: boolean;
  }[];
  public status: string;
  public tabs: MenuItem[];
  public activeTab: MenuItem;
  public ResponseStatus = ResponseStatus;
  public pattern = environment.reg_exp.url;

  constructor(private wmsReaderService: WmsReaderService, private toastService: ToastService, private mapService: VsMapService) {
    super();
  }

  public ngOnInit() {
    this.serverLayers = [];
    this.url = '';

    // Consigo la lista de servidores de la configuración del componente
    this.getModuleConfigAsync().then((config) => {
      for (const server of config.suggestedWMSServers) {
        this.serverList.push(server);
      }
      this.serverListLoaded = true;
    }, (error) => {
      this.serverListLoaded = false;
    });

    this.tabs = [
      {
        /* icon: 'fas fa-server', */
        id: 'servers',
        command: () => {
          this.changeActiveTab('servers');
        }
      },
      {
        /* icon: 'fas fa-layer-group', */
        id: 'layers',
        command: () => {
          this.changeActiveTab('layers');
        },
        visible: false
      },
    ];
    // Asignamos las etiquetas del lenguaje activo y nos subscribimos a los cambios de idioma que se hagan
    this.onComponentLiteralsChange.pipe(takeUntil(this.unSubscribe)).subscribe(() => {
      this.tabs[0].label = this.componentLiterals['LOADER.SUGGESTED_SERVERS'];
      this.tabs[1].label = this.componentLiterals['LOADER.LAYERS'];

    });
    this.useLiterals(['LOADER.SUGGESTED_SERVERS', 'LOADER.LAYERS', 'ERRORS.ERROR', 'ERRORS.NO_SERVER_RESPONSE', 'ERRORS.BAD_SERVER_RESPONSE']);

    this.activeTab = this.tabs[0];
  }

  /**
   * Realiza la consulta al servidor WMS a partir de la url introducida
   *
   * @memberof WmsLoaderComponent
   */
  public getDataFromReaderServices() {
    // Inicializamos la consulta
    this.status = ResponseStatus.PENDING;
    this.serverLayers = [];
    this.activeTab = this.tabs[1];
    this.tabs[1].visible = true;

    // Eliminamos los posibles parámetros a mayores que vengan en la url
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, '&service=wms', '');
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, 'service=wms', '');
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, '&request=getcapabilities', '');
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, 'request=getcapabilities', '');

    // Realizamos la consulta al servicio WMS y metemos las capas en un array
    this.wmsReaderService.getWMSCapabilitiesAsync(this.url).then(
      (capabilities) => {
        const layers = this.wmsReaderService.getWMSLayersFromCapabilities(capabilities, this.url, null);
        this.populateLayerManager(layers);
        this.serverDescription = this.wmsReaderService.getWMSServiceDescriptionFromCapabilities(capabilities);
        this.serverTitle = this.wmsReaderService.getWMSTitleFromCapabilities(capabilities);
        this.status = ResponseStatus.OK;
        this.activeUrl = this.url;
      },
      (err) => {
        this.toastService.showError({
          summary: this.componentLiterals['ERRORS.ERROR'],
          detail: this.componentLiterals['ERRORS.BAD_SERVER_RESPONSE'],
        });
        this.status = ResponseStatus.KO;

      },
    )
      .catch((err) => {
        this.toastService.showError({
          summary: this.componentLiterals['ERRORS.ERROR'],
          detail: this.componentLiterals['ERRORS.NO_SERVER_RESPONSE'],
        });
        this.status = ResponseStatus.KO;
      },
      );
  }

  /**
   * Asigna la nueva url seleccionada
   *
   * @protected
   * @param {string} url
   * @memberof WmsLoaderComponent
   */
  protected serverSelected(url: string) {
    this.url = url;
  }

  /**
   * Rellena la estructura del array de capas WMS a cargar con las capas VsLayer
   * recibidas en la consulta al WMS, inicializándolas como no cargadas
   * @private
   * @param {VsLayerWMS[]} vsLayers
   * @memberof WmsLoaderComponent
   */
  private populateLayerManager(vsLayers: VsLayerWMS[]) {
    this.serverLayers = [];
    const loadedLayers = this.mapService.getActiveMap().getActiveLayers();
    for (const vsLayer of vsLayers) {
      // Inicializa las capas a no cargadas
      const serverLayer = {
        vsLayer,
        loaded: loadedLayers.some((layer: VsLayerWMS) => (
          layer.name === vsLayer.name && layer.sourceType === 'WMS' && layer.service.url === vsLayer.service.url
        ))
      };
      this.serverLayers.push(serverLayer);
    }
  }

  /**
   * Método llamado al cambiar de pestaña para conocer la pestaña activa
   *
   * @private
   * @param {string} activeTab
   * @memberof WmsLoaderComponent
   */
  private changeActiveTab(activeTab: string) {
    this.activeTab = this.tabs.find((tab) => tab.id === activeTab);
  }
}
