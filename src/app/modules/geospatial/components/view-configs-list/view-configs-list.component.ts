import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'gss-view-configs-list',
  templateUrl: './view-configs-list.component.html',
  styleUrls: ['./view-configs-list.component.scss']
})
export class ViewConfigsListComponent implements OnInit {
  // currentUser: UserModel;

  constructor(/*private globalAuthService: GlobalAuthService, */private router: Router) {
    // this.currentUser = this.globalAuthService.getCurrentUser();
  }

  ngOnInit() {
  }

  gotoView(viewId: number) {
    this.router.navigate(['/visores/', viewId]);
  }

}
