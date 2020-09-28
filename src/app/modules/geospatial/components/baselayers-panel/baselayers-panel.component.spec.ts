import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselayersPanelComponent } from './baselayers-panel.component';

describe('BaselayersPanelComponent', () => {
  let component: BaselayersPanelComponent;
  let fixture: ComponentFixture<BaselayersPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselayersPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselayersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
