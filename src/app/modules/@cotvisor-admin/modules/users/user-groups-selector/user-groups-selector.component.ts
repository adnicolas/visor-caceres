import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserGroupModel } from '@cotvisor-admin/models/user-group.model';
import { UserGroupsService } from '@cotvisor-admin/services/user-groups.service';
import { takeUntil } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cot-user-groups-selector',
  templateUrl: './user-groups-selector.component.html',
  styleUrls: ['./user-groups-selector.component.scss']
})
export class UserGroupsSelectorComponent extends ParentComponent implements OnInit, OnDestroy {

  private _userGroups: UserGroupModel[] = [];
  private pristine = true;
  @Output() userGroupsChange: EventEmitter<UserGroupModel[]> = new EventEmitter();
  public userGroupsForm: FormGroup;
  public userGroupsOptions: SelectItem[] = [];
  private selectedGroups: number[] = [];
  private groups: UserGroupModel[] = [];
  private changesSub: Subscription;
  @Input()
  get userGroups() {
    return this._userGroups;
  }

  set userGroups(val) {
    this._userGroups = val;
    if (!this.pristine) this.userGroupsChange.emit(this._userGroups);
    this.pristine = false;
  }

  // @Output() onchanges: EventEmitter<UserGroupModel[]> = new EventEmitter();

  constructor(
    public userGroupsService: UserGroupsService,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.userGroupsService.getAll();
    this.userGroupsService.userGroups$.pipe(takeUntil(this.unSubscribe)).subscribe((groups) => {
      this.groups = groups;
      groups.forEach(group => {
        this.userGroupsOptions.push({
          label: group.name,
          value: group.id
        });
      });
    });
    this.userGroupsForm = this.fb.group({
      selectedGroupsForm: ['', Validators.nullValidator] // [{ value: '', label: '' }, Validators.required]
    });
    if (this.userGroups && this.userGroups.length > 0) {
      this.userGroups.forEach(group => {
        this.selectedGroups.push(group.id);
      });
    }
    this.userGroupsForm.get('selectedGroupsForm').setValue(this.selectedGroups);
    this.changesSub = this.userGroupsForm.get('selectedGroupsForm').valueChanges.subscribe(val => {
      const newGroupsSelection = this.groups.filter(group => val.includes(group.id));
      this.userGroupsChange.emit(newGroupsSelection);
    });
  }

  ngOnDestroy() {
    this.changesSub.unsubscribe();
  }
}
