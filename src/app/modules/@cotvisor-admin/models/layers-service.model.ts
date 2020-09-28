import { CategoryModel } from './category.model';
/**
 *
 *
 * @export
 * @class LayersServiceModel
 */
export class LayersServiceModel {
    public id: number;
    public category: CategoryModel;
    public url: string;
    public type: string;
    public name: string;
    public title: string = '';
    public description: string = '';
    public validated: boolean = false;
    public revised: boolean = false;
    public userIdRevision: number;
    public stampRevision: Date;
}
