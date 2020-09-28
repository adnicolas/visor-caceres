import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'the-box-title',
  templateUrl: './box-title.component.html',
  styleUrls: ['./box-title.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoxTitleComponent implements OnInit {

  @Input() styleClass: string;
  @Input() icon: string = 'pi pi-circle-off';

  constructor() { }

  ngOnInit() {
  }

}
