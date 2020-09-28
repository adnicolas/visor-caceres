import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'the-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss']
})
export class ChipComponent implements OnInit {

  @Input() chipText: string;
  @Input() chipIcon: string;
  @Input() styleClass: string;


  constructor() { }

  ngOnInit() {
  }

}
