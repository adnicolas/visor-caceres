import { UserModel } from './user.model';

/**
 * Modelo de documento de usuario
 *
 * @export
 * @class UserDocModel
 */
export class UserDocModel {
    public id: number;
    public userOwner: UserModel;
    public name: string;
    public description: string;
    public fileType: string;
    public stampCreation: Date;
    public stampModification: Date;
}
