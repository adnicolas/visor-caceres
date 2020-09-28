import { VsWindowType } from '@cotvisor/models/format/shared/vs-window-type';
import { VsWMCBoundingBoxType } from './vs-wmc-bounding-box';

/**
 * Definicion de mapa en el formato WMC
 * @type {String}
 */
export class VsWMCGeneralType {

  public window: VsWindowType;
  public boundingBox: VsWMCBoundingBoxType;
  public title: string;
  public extension: any[];

  constructor() {
    this.boundingBox = new VsWMCBoundingBoxType();
    this.window = new VsWindowType();
    this.extension = [];
  }

}
