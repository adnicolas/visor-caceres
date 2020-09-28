import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserModel } from '@cotvisor-admin/models';

@Component({
  selector: 'gss-users-detail-page',
  templateUrl: './users-detail-page.component.html',
  styleUrls: ['./users-detail-page.component.scss']
})
export class UsersDetailPageComponent implements OnInit {

  userId: string = '';
  public user: UserModel;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });
  }

}
