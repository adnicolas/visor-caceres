import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayersDetailComponent } from './layers-detail.component';

describe('LayersDetailComponent', () => {
  let component: LayersDetailComponent;
  let fixture: ComponentFixture<LayersDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LayersDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
