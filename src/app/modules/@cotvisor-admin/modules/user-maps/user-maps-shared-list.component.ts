import { Component, Input, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UserMapSharedModel, UserMapModel } from '@cotvisor-admin/models';
import { UserMapsService } from '@cotvisor-admin/services';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

// import { UserMapsSharedUsersPopoverComponent } from "./user-maps-shared-users-popover.component";

@Component({
  selector: 'cot-user-maps-shared-list',
  templateUrl: './user-maps-shared-list.component.html',
  styleUrls: ['./user-maps-shared-list.component.scss'],
})
export class UserMapsSharedListComponent extends ParentComponent implements OnInit {

  @Input() public userId: number;
  public userMapsShared: UserMapSharedModel[] = [];
  public groupedUserMapsShared: any[];
  public sharedRetrievalActive: boolean;

  constructor(private userMapsService: UserMapsService, private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.userMapsService.getSharedMaps(this.userId);
    this.sharedRetrievalActive = true;
    this.userMapsService.userMapShared$.subscribe(
      (userMapsShared) => {
        this.userMapsShared = userMapsShared;
        this.sharedRetrievalActive = false;
      }
    );
  }

  public showUserMap(userMap: UserMapModel) {
    this.router.navigate([environment.pages.visor], { queryParams: { map: userMap.id } });
  }
  /**
   * Abre popover con los usuarios con los que se ha compartido un mapa
   *
   * @param {UserMapModel} userMap
   * @memberof UserMapsSharedListComponent
   */
  public showUserSharedList(ev: any, users: any) {
    // this.popoverCtrl.create('UserMapsSharedUsersPopoverComponent', { users }).present({ ev });

  }

  public deleteSharedMap(userSharedMap: UserMapSharedModel) {
    // const alert = this.alertController.create({
    //     title: this.getLiteral('delete_title'),
    //     message: this.getLiteral('delete_msg'),
    //     buttons: [
    //         {
    //             text: this.getLiteral('delete_no'),
    //             role: 'cancel',
    //             cssClass: '',
    //         },
    //         {
    //             text: this.getLiteral('delete_yes'),
    //             cssClass: '',
    //             handler: () => {
    //                 this.userMapsService.deleteSharedMap(this.userId,
    //                     userSharedMap.usermap.id, userSharedMap.userSharedTo.id);
    //             },
    //         },
    //     ],
    // });
    // alert.present();

  }

}
