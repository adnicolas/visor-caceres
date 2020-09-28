import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'the-box-panel',
  templateUrl: './box-panel.component.html',
  styleUrls: ['./box-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoxPanelComponent implements OnInit {

  @Input() styleClass: string;
  @Input() title: string;
  @Input() icon: string = 'pi pi-circle-off';
  @Input() collapsed: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
