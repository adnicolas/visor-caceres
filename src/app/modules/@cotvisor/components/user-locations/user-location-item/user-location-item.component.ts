import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsUserLocation } from '@cotvisor/models/vs-user-location';

@Component({
  selector: 'cot-user-location-item',
  templateUrl: 'user-location-item.component.html',
  styleUrls: ['user-location-item.component.scss']
})
export class UserLocationItemComponent extends ParentComponent implements OnInit {

  @Input() userLocation: VsUserLocation;
  @Output() clicked: EventEmitter<VsUserLocation> = new EventEmitter();
  @Output() toggle: EventEmitter<VsUserLocation> = new EventEmitter();
  @Output() delete: EventEmitter<VsUserLocation> = new EventEmitter();
  public coordinates: number[];

  constructor() {
    super();
  }

  ngOnInit() {
    const coordinates = this.userLocation.wktPoint.match(/\(([^)]+)\)/)[1];
    this.coordinates = coordinates.split(' ').map(Number);
  }

  public toggleUserLocationFeature(userLocation) {
    this.toggle.emit(userLocation);
  }

  public userLocationClicked(userLocation) {
    this.clicked.emit(userLocation);
  }

  public deleteLocation(userLocation) {
    this.delete.emit(userLocation);
  }

}
