import { PermissionModel } from './permission.model';
import { PermissionResourcePkModel } from './permission-resource-pk.model';
import { SubjectTypes } from '@cotvisor-admin/classes/subject-types.enum';
import { ResourceTypes } from '@cotvisor-admin/classes/resource-types.enum';

export class PermissionResourceModel {
  public keyId: PermissionResourcePkModel;
  public permission: PermissionModel;
  public subjectType: SubjectTypes.GROUP | SubjectTypes.USER;
  public resourceType: ResourceTypes.LAYER | ResourceTypes.MAP;
}
