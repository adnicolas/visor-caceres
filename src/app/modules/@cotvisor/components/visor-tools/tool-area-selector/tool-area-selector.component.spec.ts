import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSelectorComponent } from './area-selector.component';

describe('AreaSelectorComponent', () => {
  let component: AreaSelectorComponent;
  let fixture: ComponentFixture<AreaSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
