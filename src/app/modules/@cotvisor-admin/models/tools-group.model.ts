import { ToolModel } from './tool.model';

export class ToolsGroupModel {
    public id: number;
    public name: string;
    public description: string;
    public tools: ToolModel[] = [];
}
