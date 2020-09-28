import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'the-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() title: string;
  @Input() subTitle: string;
  @Input() icon: string;
  @Input() small: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
