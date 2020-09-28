import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'the-data-item',
  templateUrl: './data-item.component.html',
  styleUrls: ['./data-item.component.scss']
})
export class DataItemComponent implements OnInit {
  @Input() data: string;
  @Input() dataTitle: string;
  @Input() icon: string;
  @Input() wordBreak: boolean = false;


  constructor() { }

  ngOnInit() {
  }

}
