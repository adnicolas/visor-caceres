
import { UserModel } from './user.model';
import { UserDocModel } from './user-doc.model';
import { UserMapFolderModel } from './user-map-folder.model';

export class UserMapModel {
  public id: number;
  public userOwner: UserModel;
  public name: string;
  public description: string;
  public public: boolean;
  public password: string;
  // bbox del mapa en su proyeccion
  // tslint:disable:variable-name
  public bboxMaxX: number;
  public bboxMaxY: number;
  public bboxMinX: number;
  public bboxMinY: number;
  // proyeccion del mapa
  public projection: string;
  public img: string;
  public folders: UserMapFolderModel[];
  public documents: UserDocModel[];
  public stampModification: Date;
  public stampCreation: Date;
  // El id de la capa base
  public baseLayerId: number;
  public hasPassword?: boolean;
  public changePassword?: boolean;

  public constructor() {
    this.userOwner = new UserModel();
  }
}
