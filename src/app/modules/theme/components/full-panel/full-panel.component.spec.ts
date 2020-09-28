import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPanelComponent } from './full-panel.component';

describe('FullPanelComponent', () => {
  let component: FullPanelComponent;
  let fixture: ComponentFixture<FullPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
