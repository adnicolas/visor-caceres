import { RoleModel } from './role.model';
import { UserModel } from './user.model';

export class UserGroupModel {
  public id?: number;
  public userOwner: number;
  public name: string;
  public description: string;
  public roles: RoleModel[];
  public users: UserModel[];
  constructor() {

    this.name = '';
    this.description = '';

  }

}
