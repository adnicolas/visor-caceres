import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'the-box-container',
  templateUrl: './box-container.component.html',
  styleUrls: ['./box-container.component.scss']
})
export class BoxContainerComponent implements OnInit {
  @Input() header: string;
  @Input() styleClass: string;
  @Input() icon: string;
  constructor() { }

  ngOnInit() {
  }


}
