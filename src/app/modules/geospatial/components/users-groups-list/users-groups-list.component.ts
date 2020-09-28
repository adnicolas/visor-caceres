import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'gss-users-groups-list',
  templateUrl: './users-groups-list.component.html',
  styleUrls: ['./users-groups-list.component.scss']
})
export class UsersGroupsListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoGroup(groupId: number) {
    this.router.navigate(['/grupos/', groupId]);
  }

  gotoNewGroup() {
    this.router.navigate(['/grupos', 'new']);
  }
}
