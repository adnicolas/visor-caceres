import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsLoaderComponent } from './wms-loader.component';

describe('WmsLoaderComponent', () => {
  let component: WmsLoaderComponent;
  let fixture: ComponentFixture<WmsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
