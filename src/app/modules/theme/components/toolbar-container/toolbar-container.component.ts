import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'the-toolbar-container',
  templateUrl: './toolbar-container.component.html',
  styleUrls: ['./toolbar-container.component.scss']
})
export class ToolbarContainerComponent implements OnChanges {

  @Input() itemsAlign: string = 'right';
  public toolbarStyle: string;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.toolbarStyle = `ui-toolbar-${this.itemsAlign}`;
  }
}
