import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipanelComparatorComponent } from './multipanel-comparator.component';

describe('MultipanelComparatorComponent', () => {
  let component: MultipanelComparatorComponent;
  let fixture: ComponentFixture<MultipanelComparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipanelComparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipanelComparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
