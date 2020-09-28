import { VsOnlineResourceType } from '@cotvisor/models/format/shared/vs-online-resource-type';

/**
 * Objeto Contexto global de WMC
 * @return {[type]} [description]
 */
export class VsWMCServerType {

  public onlineResource: VsOnlineResourceType;
  public $service: string;
  public $version: string;
  public $title: string;

  constructor() {
    this.onlineResource = new VsOnlineResourceType();
  }
}
