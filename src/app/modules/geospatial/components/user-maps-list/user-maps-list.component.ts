import { Component, OnInit } from '@angular/core';
import { GlobalAuthService } from '@cotvisor-admin/services';
import { UserModel } from '@cotvisor-admin/models';
import { Router } from '@angular/router';

@Component({
  selector: 'gss-user-maps-list',
  templateUrl: './user-maps-list.component.html',
  styleUrls: ['./user-maps-list.component.scss']
})
export class UserMapsListComponent implements OnInit {
  currentUser: UserModel;


  constructor(private globalAuthService: GlobalAuthService, private router: Router) {
    this.currentUser = this.globalAuthService.getCurrentUser();
  }

  ngOnInit() {
  }

  gotoMap(mapId) {
    this.router.navigate(['/mapas/', mapId]);
  }

}
