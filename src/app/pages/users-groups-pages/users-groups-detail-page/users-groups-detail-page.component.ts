import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserGroupModel } from '@cotvisor-admin/models';

@Component({
  selector: 'gss-users-groups-detail-page',
  templateUrl: './users-groups-detail-page.component.html',
  styleUrls: ['./users-groups-detail-page.component.scss']
})
export class UsersGroupsDetailPageComponent implements OnInit {

  groupId: string = '';
  public group: UserGroupModel;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.groupId = params.get('id');
    });
  }

}
