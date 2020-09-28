import { ToolsGroupModel } from './tools-group.model';
import { UserMapModel } from './user-map.model';

// tslint:disable:variable-name
export class ViewConfigModel {
  public id?: number;
  public name: string;
  public title: string;
  public description: string;
  public toolsgroup: ToolsGroupModel;
  public urlLogo: string;
  public defaultMap: UserMapModel;
  public language: string;
  public color_primary?: string;
  public color_secondary?: string;
  public color_tertiary?: string;
  public color_danger?: string;
  public color_light?: string;
  public color_dark?: string;
  public color_normal_text?: string;
  public color_inverse_text?: string;

  public constructor() {
    this.defaultMap = new UserMapModel();
    this.toolsgroup = new ToolsGroupModel();
  }
}
