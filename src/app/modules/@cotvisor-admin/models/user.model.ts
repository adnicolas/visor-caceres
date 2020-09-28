import { RoleModel } from './role.model';
import { UserGroupModel } from './user-group.model';
export class UserModel {
  public id: number;
  public userName: string;
  public password: string;
  public email: string;
  public disabled: boolean;
  public profileProvider: string;
  public roles: RoleModel[];
  public groups: UserGroupModel[];
  public socialUser: any;

  constructor() {
    this.userName = '';
    this.password = '';
    this.email = '';
    this.disabled = false;
    this.profileProvider = null;
    this.roles = null;
    this.socialUser = null;
  }

}
