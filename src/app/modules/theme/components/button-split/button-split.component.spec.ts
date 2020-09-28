import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSplitComponent } from './button-split.component';

describe('ButtonSplitComponent', () => {
  let component: ButtonSplitComponent;
  let fixture: ComponentFixture<ButtonSplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonSplitComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonSplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
