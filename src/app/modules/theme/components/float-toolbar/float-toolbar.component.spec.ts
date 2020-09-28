import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FloatToolbarComponent } from './float-toolbar.component';

describe('ToolbarComponent', () => {
  let component: FloatToolbarComponent;
  let fixture: ComponentFixture<FloatToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FloatToolbarComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FloatToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
