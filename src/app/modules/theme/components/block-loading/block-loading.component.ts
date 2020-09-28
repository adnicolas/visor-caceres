import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'the-block-loading',
  templateUrl: './block-loading.component.html',
  styleUrls: ['./block-loading.component.scss']
})
export class BlockLoadingComponent implements OnInit {

  @Input() loading: boolean = false;
  @Input() target: any;

  constructor() { }

  ngOnInit() {
  }

}

