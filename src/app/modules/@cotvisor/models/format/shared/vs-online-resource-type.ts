/**
 * definicion del tipo de recusro online
 * @type {String}
 */
export class VsOnlineResourceType {
  public '$xmlns:xlink': string;
  public '$xlink:type': string;
  public '$xlink:href': string;

  constructor() {
    this['$xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
    this['$xlink:type'] = '';
    this['$xlink:href'] = '';
  }
}
