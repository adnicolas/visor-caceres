import { PermissionModel } from './permission.model';
export class RoleModel {
    public id: number;
    public name: string;
    public permissions: PermissionModel[];

}
