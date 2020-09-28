import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolNavigationHistoryComponent } from './tool-navigation-history.component';

describe('ToolNavigationHistoryComponent', () => {
  let component: ToolNavigationHistoryComponent;
  let fixture: ComponentFixture<ToolNavigationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolNavigationHistoryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolNavigationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
