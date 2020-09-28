import { CategoryModel } from './category.model';
import { LayersServiceModel } from './layers-service.model';
import { MetadataModel } from './metadata.model';
import { TagModel } from './tag.model';
import { UserModel } from './user.model';
import { StyleModel } from './style.model';

// tslint:disable:variable-name
/**
 * Modelo de capa
 *
 * @export
 * @class LayerModel
 */
export class LayerModel {
  public id: number;
  public service: LayersServiceModel;
  public category: CategoryModel;
  public userOwner: UserModel;
  public name: string;
  public title: string;
  public visible: boolean;
  public opacity: number;
  public order: number;
  public description: string;
  public attribution: string;
  public attributionLink: string;
  public languages: string;
  public queryable: boolean;
  public minScale: number;
  public maxScale: number;
  // proyección de la capa
  public projection: string;
  // bbox en la proyección de la capa
  public bboxMaxX: number;
  public bboxMaxY: number;
  public bboxMinX: number;
  public bboxMinY: number;
  // contenido de capa de usuario
  public userContent: string;
  // imagen codificada en base64
  public img: string;
  // Capa favorita ?
  public favorite: boolean;
  // indica si la capa ha sido validada
  public validated: boolean;
  // indica si la capa ya ha sido supervisada y marcada o no como validada
  public revised: boolean;
  public styles: StyleModel[];
  // Identificador del estilo seleccionado
  public selectedStyle: string;
  public formats: string;
  // Identificador del formato seleccionado
  public selectedFormat: string;
  // Identificador del formato seleccionado
  public selectedLanguage: string;
  public metadatas: MetadataModel[];
  // Usuario que ha hecho la revisión de la capa
  public userIdRevision: number;
  public tags: TagModel[];
  // Fecha de revisión de la capa
  public stampRevision: Date;
  public stampCreation: Date;
  // Campos WMTS
  public dimensions: string;

  public WMTS_matrixSet: string;
  public WMTS_requestEncoding: string;
  public WMTS_tileGrid: string;
  public WMTS_dimensions: string;
}
