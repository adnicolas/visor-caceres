import { VsUrlType } from '@cotvisor/models/format/shared/vs-url-type';

/**
 * Tipo estilos de capa en el formato de WMC
 * @type {string}
 */
export class VsWmcStyleType {

  public name: string;
  public title: string;
  public legendURL: VsUrlType;

  constructor() {

    this.name = '',
      this.title = '',
      this.legendURL = new VsUrlType();
  }
}
