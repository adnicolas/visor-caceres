import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleModel } from '@cotvisor-admin/models/role.model';
import { RolesService } from '@cotvisor-admin/services/roles.service';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { SelectItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cot-user-roles-selector',
  templateUrl: './user-roles-selector.component.html',
  styleUrls: ['./user-roles-selector.component.scss']
})
export class UserRolesSelectorComponent extends ParentComponent implements OnInit, OnDestroy {

  private _userRoles: RoleModel[] = [];
  // private userRoles: RoleModel[] = [];
  public rolesOptions: SelectItem[] = [];
  private pristine = true;
  private roles: RoleModel[] = [];
  public userRolesForm: FormGroup;
  private changesSub: Subscription;
  @Output() rolesChange: EventEmitter<RoleModel[]> = new EventEmitter();

  @Input()
  get userRoles() {
    return this._userRoles;
  }

  set userRoles(val) {
    this._userRoles = val;
    if (!this.pristine) {
      this.rolesChange.emit(this._userRoles);
    }
    this.pristine = false;
  }

  // @Output() onchanges: EventEmitter<UserGroupModel[]> = new EventEmitter();

  constructor(
    private rolesService: RolesService,
    private fb: FormBuilder) {
    super();
  }

  ngOnInit() {
    this.rolesService.getAll();
    this.rolesService.roles$.pipe(takeUntil(this.unSubscribe)).subscribe((roles) => {
      this.roles = roles;
      roles.forEach(role => {
        this.rolesOptions.push({
          label: role.name,
          value: role.id,
        });
      });
    });
    this.userRolesForm = this.fb.group({
      rolesForm: ['', Validators.required]
    });
    const selectedRoles: number[] = [];
    if (this.userRoles && this.userRoles.length > 0) {
      this.userRoles.forEach(role => {
        selectedRoles.push(role.id);
      });
    }
    this.userRolesForm.get('rolesForm').setValue(selectedRoles);
    this.changesSub = this.userRolesForm.get('rolesForm').valueChanges.subscribe(val => {
      const newRolesSelection = this.roles.filter(role => val.includes(role.id));
      this.rolesChange.emit(newRolesSelection);
    });
  }

  ngOnDestroy() {
    this.changesSub.unsubscribe();
  }
}
