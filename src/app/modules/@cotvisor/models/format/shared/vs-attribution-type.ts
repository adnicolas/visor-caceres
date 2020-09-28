import { VsUrlType } from './vs-url-type';

/**
 * definicion del tipo URL
 * @type {String}
 */
export class VsAttributionType {
  public title: string;
  public onlineResource: string;
  public logoURL: VsUrlType;

  constructor() {
    this.logoURL = new VsUrlType();
    this.onlineResource = '';
    this.title = '';
  }

}
