import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WmsLayerLoaderComponent } from './wms-layer-loader.component';

describe('WmsLayerLoaderComponent', () => {
  let component: WmsLayerLoaderComponent;
  let fixture: ComponentFixture<WmsLayerLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WmsLayerLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WmsLayerLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
