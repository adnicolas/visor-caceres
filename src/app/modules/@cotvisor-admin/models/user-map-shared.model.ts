import { UserMapModel } from './user-map.model';
import { UserModel } from './user.model';
/**
 * Modelo de mapas compartidos
 *
 * @export
 * @class UserMapSharedModel
 */
export class UserMapSharedModel {

    public usermap: UserMapModel;
    public userSharedTo: UserModel;
    public timeStamp: Date;
}
