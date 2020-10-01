import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '@theme/services/toast.service';
import { environment } from 'src/environments/environment';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { VsLayerWFS } from '@cotvisor/models/vs-layer-wfs';
import { ResponseStatus } from '@cotvisor/models/vs-response-status.enum';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { WfsReaderService } from '@cotvisor/services/wfs-reader.service';
/**
 * Componente para la carga de capas de servidores WFS en el mapa activo
 *
 * @export
 * @class WmsLoaderComponent
 * @extends {ParentComponent}
 * @implements {OnInit}
 */
@Component({
  selector: 'cot-wfs-loader',
  templateUrl: './wfs-loader.component.html',
  styleUrls: ['./wfs-loader.component.scss']
})
export class WfsLoaderComponent extends ParentComponent implements OnInit {

  public url: string;
  public activeUrl: string;
  public serverList: { url: string; title: string; }[] = [];
  public serverListLoaded: boolean = false;
  public serverDescription: string;
  public serverTitle: string;
  public serverLayers: {
    vsLayer: VsLayerWFS;
    loaded: boolean;
  }[];
  public status: string;
  public tabs: MenuItem[];
  public activeTab: MenuItem;
  public ResponseStatus = ResponseStatus;
  public pattern = environment.reg_exp.url;

  constructor(private wfsReaderService: WfsReaderService, private toastService: ToastService, private mapService: VsMapService) {
    super();
  }

  public ngOnInit() {
    this.serverLayers = [];
    this.url = '';

    // Consigo la lista de servidores de la configuración del componente
    this.getModuleConfigAsync()
      .then((config) => {
        if (!config.suggestedWFSServers) {
          this.serverList = [];
          this.serverListLoaded = true;
        } else {
          for (const server of config.suggestedWFSServers) {
            this.serverList.push(server);
          }
          this.serverListLoaded = true;
        }
      })
      .catch((error) => {
        this.serverList = [];
        this.serverListLoaded = true;
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
   * Realiza la consulta al servidor WFS a partir de la url introducida
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
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, '&service=wfs', '');
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, 'service=wfs', '');
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, '&request=getcapabilities', '');
    this.url = Utilities.removeSubstringRegardlessOfCase(this.url, 'request=getcapabilities', '');

    // Realizamos la consulta al servicio WFS y metemos las capas en un array
    this.wfsReaderService.getWFSCapabilitiesAsync(this.url)
      .then(
        (capabilities) => {
          const layers = this.wfsReaderService.getWFSLayersFromCapabilities(capabilities, this.url, null);
          this.populateLayerManager(layers);
          this.serverDescription = this.wfsReaderService.getWFSServiceDescriptionFromCapabilities(capabilities);
          this.serverTitle = this.wfsReaderService.getWFSTitleFromCapabilities(capabilities);
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
   * Rellena la estructura del array de capas WFS a cargar con las capas VsLayer
   * recibidas en la consulta al WFS, inicializándolas como no cargadas
   * @private
   * @param {VsLayerWFS[]} vsLayers
   * @memberof WmsLoaderComponent
   */
  private populateLayerManager(vsLayers: VsLayerWFS[]) {
    this.serverLayers = [];
    const loadedLayers = this.mapService.getActiveMap().getActiveLayers();
    for (const vsLayer of vsLayers) {
      // Inicializa las capas a no cargadas
      const serverLayer = {
        vsLayer,
        loaded: loadedLayers.some((layer: VsLayerWFS) => (
          layer.name === vsLayer.name && layer.sourceType === 'WFS' && layer.service.url === vsLayer.service.url
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
