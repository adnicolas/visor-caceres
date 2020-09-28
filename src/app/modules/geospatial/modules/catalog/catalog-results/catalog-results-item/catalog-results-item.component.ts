import { Component, OnInit, Input } from '@angular/core';
import { Metadata } from '@geospatial/modules/catalog/metadata';
import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { WfsReaderService } from '@cotvisor/services/wfs-reader.service';
import { ToastService } from '@theme/services/toast.service';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';

@Component({
  selector: 'gss-catalog-results-item',
  templateUrl: './catalog-results-item.component.html',
  styleUrls: ['./catalog-results-item.component.scss']
})
export class CatalogResultsItemComponent extends ParentComponent implements OnInit {

  @Input() metadata: Metadata;
  imageData: any;
  linksMenu: MenuItem[] = [];
  downloadMenu: MenuItem[] = [];
  layerLoadMenu: MenuItem[] = [];

  constructor(private mapService: VsMapService, private wfsReaderService: WfsReaderService, private toastService: ToastService) {
    super();
    this.useLiterals(['ERRORS.BAD_SERVER_RESPONSE', 'ERRORS.ERROR']);
  }

  ngOnInit() {
    if (this.metadata.image) {
      this.imageData = this.getData(this.metadata.image[0]).property_1;
    } else {
      this.imageData = environment.default_thumbnail_catalog;
    }
    this.generateButtonsMenus();
  }
  /**
   * Genera los botones del menu del elemento del catálogo
   *
   *
   * @memberOf CatalogResultsItemComponent
   */
  generateButtonsMenus() {
    if (this.metadata.link) {
      this.metadata.link.forEach(
        metadataLink => {
          const linkData = this.getData(metadataLink);
          // linkData.property_3 contiene el protocolo del enlace segun https://github.com/geopython/pycsw/wiki/Geonode-notes
          switch (this.getLinkType(linkData.property_3)) {
            case 'link':
              this.linksMenu.push({ label: linkData.property_0, target: '_blank', url: linkData.property_2 });
              break;
            case 'wms':
              this.layerLoadMenu.push({ label: linkData.property_1, command: () => this.loadWms(linkData.property_0, linkData.property_2) });
              break;
            case 'wfs':
              this.layerLoadMenu.push({ label: linkData.property_1, command: () => this.loadWfs(linkData.property_0, linkData.property_2) });
              break;
            case 'download':
              this.downloadMenu.push({ label: linkData.property_0 || linkData.property_1, target: '_blank', url: linkData.property_2 });
              break;
            default:
              break;
          }

        }
      );
    }
  }


  /**
   * Carga una capoa desde WMS
   *
   * @param {string} name
   * @param {string} wmsUrl
   *
   * @memberOf CatalogResultsItemComponent
   */
  // TODO @Joe Add WMS
  loadWms(name: string, wmsUrl: string) {

    // tslint:disable-next-line:no-console
    console.log('Cargar  ' + wmsUrl);


  }

  /**
   * Carga la capa desde el servicio WFS
   *
   * @param {string} layerName
   * @param {string} layerTitle
   * @param {string} wfsUrl
   *
   * @memberOf CatalogResultsItemComponent
   */
  loadWfs(layerName: string, wfsUrl: string) {

    this.wfsReaderService.getWFSCapabilitiesAsync(wfsUrl)
      .then(
        (serviceCapabilities) => {

          let layerCapabilitites = [].concat(serviceCapabilities.featuretypelist.featuretype);

          layerCapabilitites = layerCapabilitites.filter(featuretype => {
            const featureName: string = featuretype.name;
            return featureName.substring(featureName.indexOf(':') + 1) === layerName;
          });

          if (layerCapabilitites[0]) {
            const newVFSLayer = this.wfsReaderService.initNewVsLayer(wfsUrl, serviceCapabilities, layerCapabilitites[0]);
            this.mapService.addVsLayer(newVFSLayer);
            this.toastService.showInfo({ summary: 'Capa añadida', detail: `Capa ${layerName} añadida al mapa` });
          } else this.toastService.showError({ summary: 'Error al cargar la capa', detail: `No se ha encontrado la capa ${layerName} en el servicio ${wfsUrl}` });

        },
        (err) => {
          this.toastService.showError({
            summary: this.componentLiterals['ERRORS.ERROR'],
            detail: this.componentLiterals['ERRORS.BAD_SERVER_RESPONSE'],
          });
        },
      );

  }


  /**
   * Abre la página del metadato concreto en geonetwork
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @memberof CatalogResultsItemComponent
   */
  goToMetadata() {
    const BASEURL = environment.apis.geonetworkAPI.baseUrl;
    window.open(`${BASEURL}${environment.apis.geonetworkAPI.endpoints.metadataLink}/${this.metadata['geonet:info'].uuid}`, '_blank').focus();
  }

  /**
   * Obtiene las propiedaes de una cadena separadas por pipes
   *
   * @param {string} property
   * @returns {*}
   *
   * @memberOf CatalogResultsItemComponent
   */
  getData(property: string): any {
    const data = property.split('|');
    const parsedData = {};
    data.forEach((element, index) => parsedData[`property_${index}`] = element);
    return parsedData;
  }



  /**
   * Ontiene el tipo de enlace a partir del protocolo
   *
   * @param {string} protocol
   * @returns {string}
   *
   * @memberOf CatalogResultsItemComponent
   */
  getLinkType(protocol: string): string {

    // TODO tratar el resto de protocolos
    // Lista completa en  https://github.com/geopython/pycsw/wiki/Geonode-notes
    switch (protocol) {
      case 'WWW:LINK-1.0-http--link':
      case 'WWW:LINK-1.0-http--partners':
      case 'WWW:LINK-1.0-http--related':
      case 'WWW:LINK-1.0-http--samples':
        return 'link';
      case 'OGC:WMS-1.3.0-http-get-capabilities':
      case 'OGC:WMS-1.1.1-http-get-capabilities':
        return 'wms';
      case 'OGC:WFS-1.0.0-http-get-capabilities':
      case 'OGC:WFS':
        return 'wfs';
      case 'WWW:DOWNLOAD-1.0-http--download':
        return 'download';

    }
    return null;

  }
}
