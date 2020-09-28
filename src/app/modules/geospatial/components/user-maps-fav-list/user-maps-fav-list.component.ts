import { Component, OnInit } from '@angular/core';
import { UserModel } from '@cotvisor-admin/models/user.model';
import { GlobalAuthService } from '@cotvisor-admin/services';
import { Router } from '@angular/router';

@Component({
  selector: 'gss-user-maps-fav-list',
  templateUrl: './user-maps-fav-list.component.html',
  styleUrls: ['./user-maps-fav-list.component.scss']
})
export class UserMapsFavListComponent implements OnInit {
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
