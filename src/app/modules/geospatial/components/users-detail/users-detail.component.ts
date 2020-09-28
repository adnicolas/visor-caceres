import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from '@cotvisor-admin/models';
import { takeUntil } from 'rxjs/operators';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { UsersService } from '@cotvisor-admin/services';

@Component({
  selector: 'gss-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.scss']
})
export class UsersDetailComponent extends ParentComponent implements OnInit {


  @Input() userId: number | string;
  public addMode: boolean = false;
  public user: UserModel;
  public userError: boolean;
  public userErrorMessage: string = null;

  constructor(private usersService: UsersService) {
    super();
  }

  ngOnInit(): void {
    if (this.userId === 'new') {
      this.addMode = true;
      this.user = new UserModel();
    } else {
      this.usersService.get(this.userId as number)
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(
          user => this.user = user,
          error => {
            this.userError = true;
            this.userErrorMessage = error.message;
          });
    }
  }
}


