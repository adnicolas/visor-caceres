import { Component, Input, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserModel } from '@cotvisor-admin/models/user.model';
import { UserMapsService } from '@cotvisor-admin/services/user-maps.service';
import { GlobalAuthService } from '@cotvisor-admin/services/global-auth.service';

@Component({
  selector: 'cot-users-detail-dashboard',
  templateUrl: './users-detail-dashboard.component.html',
  styleUrls: ['./users-detail-dashboard.component.scss'],
})
export class UsersDetailDashboardComponent extends ParentComponent implements OnInit {
  @Input() public user: UserModel;
  public userMapsRetrievalActive: boolean;
  public sharedMapsRetrievalActive: boolean;
  public favouritesRetrievalActive: boolean;

  public userMapsCount = {
    maps: null,
    shared: null,
    favourites: null,
  };

  constructor(private userMapsService: UserMapsService, private globalAuthService: GlobalAuthService) {
    super();
    // this.userMapsService.getCount().pipe(takeUntil(this.unSubscribe)).subscribe((count) => this.userMapsCount.maps = count);
    this.userMapsService.get(this.user.id);

  }

  public ngOnInit(): void {
    // if (!this.user) this.user={}

    // get counts
    this.userMapsService.getReadableMaps();
    this.userMapsRetrievalActive = true;
    /*        this.userMapsService.getSharedMaps(this.user.id);
           this.sharedMapsRetrievalActive = true; */
    this.userMapsService.getFavouriteMaps(this.user.id);
    this.favouritesRetrievalActive = true;
    this.userMapsService.userMapsCount$.subscribe((count) => {
      this.userMapsCount.maps = count; this.userMapsRetrievalActive = false;
    });
    /*         this.userMapsService.userMapsSharedCount$.subscribe((count) => {
                this.userMapsCount.shared = count; this.sharedMapsRetrievalActive = false;
            }); */
    this.userMapsService.userMapsFavouritesCount$.subscribe((count) => {
      this.userMapsCount.favourites = count; this.favouritesRetrievalActive = false;
    });
  }

  public gotoEdit() {
    alert('ir al detalle de usuario');
  }

  public gotoMaps() {

    alert('ir a mapa de usuario');

  }

  public logout() {
    this.globalAuthService.logOut();
  }

}
