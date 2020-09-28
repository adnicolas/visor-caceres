import { Component, OnInit, Input } from '@angular/core';
import { UserModel } from '@cotvisor-admin/models';

@Component({
  selector: 'the-overview-user-box',
  templateUrl: './overview-user-box.component.html',
  styleUrls: ['./overview-user-box.component.scss']
})
export class OverviewUserBoxComponent implements OnInit {
  @Input() user: UserModel;
  @Input() styleClass: string;


  constructor() { }

  ngOnInit() {
  }

}
