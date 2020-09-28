import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '@cotvisor-admin/models';

@Component({
  selector: 'gss-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoUser(user: UserModel) {
    this.router.navigate(['/usuarios', user.id]);
  }

  gotoNewUser() {
    this.router.navigate(['/usuarios', 'new']);
  }

}
