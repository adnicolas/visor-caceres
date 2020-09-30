import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapGalleryPanelComponent } from './map-gallery-panel.component';

describe('MapGalleryPanelComponent', () => {
  let component: MapGalleryPanelComponent;
  let fixture: ComponentFixture<MapGalleryPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapGalleryPanelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapGalleryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
