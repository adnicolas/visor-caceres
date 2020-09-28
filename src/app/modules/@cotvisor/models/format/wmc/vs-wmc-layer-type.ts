import { VsWindowType } from '@cotvisor/models/format/shared/vs-window-type';
import { VsWMCServerType } from './vs-wmc-server-type';
import { VsWmcStyleType } from './vs-wmc-style-type';

/**
 * Definicion de capas en el formato WMC
 * @type {any}
 */
export class VsWMCLayerType {

  public server: VsWMCServerType;
  public name: string;
  public title: string;
  public dataUrl: string;
  public $queryable: boolean;
  public $hidden: boolean;
  public styleList: {
    style: VsWmcStyleType[],
  };
  public window: VsWindowType;
  public extension: any;

  constructor() {
    this.styleList = { style: [] };
    this.window = new VsWindowType();
    this.server = new VsWMCServerType();
    this.extension = {};

  }

}
