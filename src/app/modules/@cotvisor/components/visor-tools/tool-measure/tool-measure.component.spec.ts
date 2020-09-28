import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolMeasureComponent } from './tool-measure.component';

describe('ToolMeasureComponent', () => {
  let component: ToolMeasureComponent;
  let fixture: ComponentFixture<ToolMeasureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolMeasureComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
