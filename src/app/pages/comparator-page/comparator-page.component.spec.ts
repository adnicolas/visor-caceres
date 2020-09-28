import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparatorPageComponent } from './comparator-page.component';

describe('ComparatorPageComponent', () => {
  let component: ComparatorPageComponent;
  let fixture: ComponentFixture<ComparatorPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparatorPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparatorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
