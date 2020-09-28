import { LayerModel } from './layer.model';

export class UserMapFolderModel {
    public id: number;
    public nodeId: string;
    public parentNodeId: string;
    public userMapId: number;
    public name: string;
    public order: number;
    public layers?: LayerModel[];
}
