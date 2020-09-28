import { VsOnlineResourceType } from './vs-online-resource-type';

/**
 * definicion del tipo URL
 * @type {String}
 */
export class VsUrlType {

  public onlineResource: VsOnlineResourceType;
  public width: number;
  public height: number;
  public format: string;

  constructor() {
    this.onlineResource = new VsOnlineResourceType();
    this.format = '';
    this.height = 0;
    this.width = 0;
  }

}
