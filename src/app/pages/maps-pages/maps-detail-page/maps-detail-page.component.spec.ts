import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsDetailPageComponent } from './maps-detail-page.component';

describe('MapsDetailPageComponent', () => {
  let component: MapsDetailPageComponent;
  let fixture: ComponentFixture<MapsDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapsDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
