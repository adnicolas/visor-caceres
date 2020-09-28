import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPanelComponent } from './print-panel.component';

describe('PrintPanelComponent', () => {
  let component: PrintPanelComponent;
  let fixture: ComponentFixture<PrintPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrintPanelComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
