import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorLayoutComponent } from './visor-layout.component';

describe('VisorLayoutComponent', () => {
  let component: VisorLayoutComponent;
  let fixture: ComponentFixture<VisorLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisorLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
