import { Component, Input } from '@angular/core';

@Component({
  selector: 'the-overview-box',
  templateUrl: './overview-box.component.html',
  styleUrls: ['./overview-box.component.scss']
})
export class OverviewBoxComponent {

  @Input() header: string;
  @Input() title: string;
  @Input() value: string;
  @Input() styleClass: string;
  @Input() icon: string;
  @Input() routerLink: string;



  constructor() { }



}
