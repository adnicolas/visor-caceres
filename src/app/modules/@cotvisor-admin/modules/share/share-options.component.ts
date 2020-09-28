import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { PermissionModel, PermissionResourceModel, UserGroupModel, UserModel } from '@cotvisor-admin/models';
import { UsersService, UserGroupsService, PermissionsService, ShareService } from '@cotvisor-admin/services';
import { takeUntil, take } from 'rxjs/operators';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { SubjectTypes } from '@cotvisor-admin/classes/subject-types.enum';
import { SelectItem } from 'primeng/api';
import { ResourceTypes } from '@cotvisor-admin/classes/resource-types.enum';
import { combineLatest } from 'rxjs';
import { ToastService } from '@theme/services/toast.service';
import { ResourceActions } from '@cotvisor-admin/classes/resource-actions.enum';

interface IShareRow {
  id: number;
  subjectName: string;
  read: boolean;
  write: boolean;
  admin: boolean;
}
export interface IShare {
  subjectIds?: number[];
  subjectTypes?: string[];
  permissionIds?: number[];
  resourceType: string;
  resourceId: number;
}
@Component({
  selector: 'cot-share-options',
  templateUrl: './share-options.component.html',
  styleUrls: ['./share-options.component.scss']
})
export class ShareOptionsComponent extends ParentComponent implements OnInit {
  @Input() resourceType: ResourceTypes.LAYER | ResourceTypes.MAP;
  @Input() resourceId: number;
  public shareForm: FormGroup;
  public users: SelectItem[] = [];
  public groups: SelectItem[] = [];
  // public permissionsOptions: SelectItem[] = [];
  public subjectsOptions: SelectItem[] = [];
  // private selectedUsers: number[] = [];
  // private selectedGroups: number[] = [];
  public permissionsResources: IShareRow[];
  private transformedUsers: IShareRow[];
  private transformedGroups: IShareRow[];
  private permissionsTypes: PermissionModel[];
  private addRequests: IShare[] = [];
  private removeRequests: IShare[] = [];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private userGroupsService: UserGroupsService,
    private permissionsService: PermissionsService,
    private shareService: ShareService,
    private toastService: ToastService
  ) {
    super();
  }

  ngOnInit() {
    this.shareForm = this.createForm();
    this.usersService.getAll();
    this.userGroupsService.getAll();
    this.permissionsService.getAll();
    this.shareService.getPermissionsResourcesByResourceId(this.resourceId.toString());
    combineLatest(
      this.usersService.users$,
      this.userGroupsService.userGroups$,
      this.permissionsService.permissions$,
      this.shareService.permissionsResources$
    ).pipe(
      take(1),
      takeUntil(this.unSubscribe),
    ).subscribe(([users, usersGroups, permissions, permissionsResources]) => {
      users.forEach(user => {
        this.users.push({
          value: user.id,
          label: user.userName
        });
      });
      usersGroups.forEach(group => {
        this.groups.push({
          value: group.id,
          label: group.name
        });
      });
      this.permissionsTypes = permissions;
      this.subjectsOptions = [{ value: SubjectTypes.USER, label: 'Usuarios' }, { value: SubjectTypes.GROUP, label: 'Grupos' }];
      this.shareForm.get('subjectsOption').setValue(this.subjectsOptions[0].value);
      this.transformData(permissionsResources, users, usersGroups);
      this.feedForm();
    });
  }

  trackByFn(index, row) {
    return index;
  }

  transformData(permissionsResources: PermissionResourceModel[], users: UserModel[], groups: UserGroupModel[]) {
    this.transformedUsers = [];
    this.transformedGroups = [];

    // Primer (en función del tipo de recurso)
    const filteredPermissionsByResourceType = permissionsResources.filter(permissionResource => {
      return permissionResource.resourceType === this.resourceType;
    });

    // Segundo filtro (si es para USUARIOS  o GRUPOS)
    const filteredPermissionsByUser = filteredPermissionsByResourceType.filter(permissionResource => {
      return permissionResource.subjectType === SubjectTypes.USER;
    });

    const filteredPermissionsByGroup = filteredPermissionsByResourceType.filter(permissionResource => {
      return permissionResource.subjectType === SubjectTypes.GROUP;
    });

    users.forEach(user => {
      const filteredByUserId: PermissionResourceModel[] = filteredPermissionsByUser.filter(permission => permission.keyId.subjectId === user.id);
      this.transformedUsers.push({
        id: user.id,
        subjectName: user.userName,
        read: filteredByUserId.filter(permission => permission.permission.name === ResourceActions.READ).length > 0,
        write: filteredByUserId.filter(permission => permission.permission.name === ResourceActions.WRITE).length > 0,
        admin: filteredByUserId.filter(permission => permission.permission.name === ResourceActions.ADMIN).length > 0,
      });
    });

    groups.forEach(group => {
      const filteredByGroupId: PermissionResourceModel[] = filteredPermissionsByGroup.filter(permission => permission.keyId.subjectId === group.id);
      this.transformedGroups.push({
        id: group.id,
        subjectName: group.name,
        read: filteredByGroupId.filter(permission => permission.permission.name === ResourceActions.READ).length > 0,
        write: filteredByGroupId.filter(permission => permission.permission.name === ResourceActions.WRITE).length > 0,
        admin: filteredByGroupId.filter(permission => permission.permission.name === ResourceActions.ADMIN).length > 0,
      });
    });
  }

  permissions(): FormArray {
    return this.shareForm.get('permissions') as FormArray;
  }

  newPermissionResource(subject: IShareRow): FormGroup {
    return this.fb.group({
      id: subject.id,
      subjectName: subject.subjectName,
      read: subject.read,
      write: subject.write,
      admin: subject.admin
    });
  }

  clearFormArray() {
    while (this.permissions().length) {
      this.permissions().removeAt(0);
    }
  }

  feedForm() {
    let data;
    switch (this.shareForm.get('subjectsOption').value) {
      case SubjectTypes.USER:
        data = {
          permissions: this.transformedUsers
        };
        this.permissionsResources = this.transformedUsers;
        break;
      case SubjectTypes.GROUP:
        data = {
          permissions: this.transformedGroups
        };
        this.permissionsResources = this.transformedGroups;
        break;
    }
    this.clearFormArray();
    data.permissions.forEach(p => {
      const permission: FormGroup = this.newPermissionResource(p);
      this.permissions().push(permission);
    });
    this.shareForm.patchValue(data);
  }

  // Listboxes approach
  /*refreshUsersAndGroups() {
    this.shareForm.markAsPristine();
    this.selectedGroups = [];
    this.selectedUsers = [];
    const filteredPermissions = this.filteredPermissions.filter(permissionResource => {
      if (permissionResource.keyId.permissionId === this.shareForm.get('permissionsOption').value) {
        return true;
      }
      return false;
    });
    filteredPermissions.forEach(permission => {
      switch (permission.subjectType) {
        case SubjectTypes.USER:
          this.selectedUsers.push(permission.keyId.subjectId);
          break;
        case SubjectTypes.GROUP:
          this.selectedGroups.push(permission.keyId.subjectId);
          break;
      }
    });
    this.shareForm.get('usersToShare').setValue(this.selectedUsers);
    this.shareForm.get('groupsToShare').setValue(this.selectedGroups);
  }*/

  private createForm() {
    return this.fb.group({
      subjectsOption: '',
      permissions: new FormArray([])
    });
  }

  public share() {
    const permissionsForm = this.shareForm.get('permissions').value;
    let modified: IShareRow[];
    switch (this.shareForm.get('subjectsOption').value) {
      case SubjectTypes.USER:
        modified = permissionsForm.filter(o1 => {
          return !this.transformedUsers.some(o2 => {
            return o1.id === o2.id && o1.read === o2.read && o1.write === o2.write && o1.admin === o2.admin;
          });
        }).map(o => {
          return ['id', 'admin', 'read', 'write', 'admin'].reduce((newo, name) => {
            newo[name] = o[name];
            return newo;
          }, {});
        });
        this.buildObjRequests(this.transformedUsers, modified, false);
        break;
      case SubjectTypes.GROUP:
        modified = permissionsForm.filter(o1 => {
          return !this.transformedGroups.some(o2 => {
            return o1.id === o2.id && o1.read === o2.read && o1.write === o2.write && o1.admin === o2.admin;
          });
        }).map(o => {
          return ['id', 'admin', 'read', 'write', 'admin'].reduce((newo, name) => {
            newo[name] = o[name];
            return newo;
          }, {});
        });
        this.buildObjRequests(this.transformedGroups, modified, true);
    }

    this.removeRequests.forEach(req => {
      /*const objToRemove: IShare = {
        subjectIds: req.subjectIds,
        resourceType: this.resourceType,
        resourceId: this.resourceId,
        subjectTypes: req.subjectTypes,
        permissionIds: req.permissionIds
      };
      this.shareService.deleteResource(objToRemove).pipe(takeUntil(this.unSubscribe))
        .subscribe(shared => {
          this.toastService.showInfo({ detail: `Recurso compartido correctamente`, summary: 'Compartido' });
        });*/
    });
    this.addRequests.forEach((req: IShare) => {
      this.shareService.shareResource(req).pipe(takeUntil(this.unSubscribe))
        .subscribe(shared => {
          this.toastService.showInfo({ detail: `Recurso compartido correctamente`, summary: 'Compartido' });
        });
    });

  }

  buildObjRequests(oldSelection: IShareRow[], newSelection: IShareRow[], group: boolean) {
    const subjectIdRemoveRead = [];
    const subjectTypeRemoveRead = [];
    const subjectIdRemoveWrite = [];
    const subjectTypeRemoveWrite = [];
    const subjectIdRemoveAdmin = [];
    const subjectTypeRemoveAdmin = [];
    const subjectIdAddRead = [];
    const subjectTypeAddRead = [];
    const subjectIdAddWrite = [];
    const subjectTypeAddWrite = [];
    const subjectIdAddAdmin = [];
    const subjectTypeAddAdmin = [];

    let removeReadPermission: IShare;
    let removeWritePermission: IShare;
    let removeAdminPermission: IShare;
    let addReadPermission: IShare;
    let addAdminPermission: IShare;
    let addWritePermission: IShare;

    const reqPermission: IShare = {
      resourceType: this.resourceType,
      resourceId: this.resourceId,
      subjectIds: [],
      subjectTypes: []
    };
    const readPermission: IShare = {
      ...reqPermission,
      permissionIds: [this.permissionsTypes.find(permission => permission.name === ResourceActions.READ).id]
    };
    const writePermission: IShare = {
      ...reqPermission,
      permissionIds: [this.permissionsTypes.find(permission => permission.name === ResourceActions.WRITE).id]
    };
    const adminPermission: IShare = {
      ...reqPermission,
      permissionIds: [this.permissionsTypes.find(permission => permission.name === ResourceActions.ADMIN).id]
    };

    oldSelection.filter(subject => {
      newSelection.filter(mo => {
        if (subject.id === mo.id) {
          if (subject.read && !mo.read) {
            subjectIdRemoveRead.push(subject.id);
            subjectTypeRemoveRead.push(group ? SubjectTypes.GROUP : SubjectTypes.USER);
            removeReadPermission = {
              ...readPermission,
              subjectIds: subjectIdRemoveRead,
              subjectTypes: subjectTypeRemoveRead
            };
          }
          if (subject.write && !mo.write) {
            subjectIdRemoveWrite.push(subject.id);
            subjectTypeRemoveWrite.push(group ? SubjectTypes.GROUP : SubjectTypes.USER);
            removeWritePermission = {
              ...writePermission,
              subjectIds: subjectIdRemoveWrite,
              subjectTypes: subjectTypeRemoveWrite
            };
          }
          if (subject.admin && !mo.admin) {
            subjectIdRemoveAdmin.push(subject.id);
            subjectTypeRemoveAdmin.push(group ? SubjectTypes.GROUP : SubjectTypes.USER);
            removeAdminPermission = {
              ...adminPermission,
              subjectIds: subjectIdRemoveAdmin,
              subjectTypes: subjectTypeRemoveAdmin
            };
          }
          if (!subject.read && mo.read) {
            subjectIdAddRead.push(subject.id);
            subjectTypeAddRead.push(group ? SubjectTypes.GROUP : SubjectTypes.USER);
            addReadPermission = {
              ...readPermission,
              subjectIds: subjectIdAddRead,
              subjectTypes: subjectTypeAddRead
            };
          }
          if (!subject.write && mo.write) {
            subjectIdAddWrite.push(subject.id);
            subjectTypeAddWrite.push(group ? SubjectTypes.GROUP : SubjectTypes.USER);
            addWritePermission = {
              ...writePermission,
              subjectIds: subjectIdAddWrite,
              subjectTypes: subjectTypeAddWrite
            };
          }
          if (!subject.admin && mo.admin) {
            subjectIdAddAdmin.push(subject.id);
            subjectTypeAddAdmin.push(group ? SubjectTypes.GROUP : SubjectTypes.USER);
            addAdminPermission = {
              ...adminPermission,
              subjectIds: subjectIdAddAdmin,
              subjectTypes: subjectTypeAddAdmin
            };
          }
        }
      });
    });
    this.addRequests.push(addReadPermission, addWritePermission, addAdminPermission);
    this.removeRequests.push(removeReadPermission, removeWritePermission, removeAdminPermission);
    this.addRequests = this.addRequests.filter(el => el != null);
    this.removeRequests = this.removeRequests.filter(el => el != null);
  }

}
