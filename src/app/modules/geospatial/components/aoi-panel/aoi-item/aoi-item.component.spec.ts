import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AoiItemComponent } from './aoi-item.component';

describe('AoiItemComponent', () => {
  let component: AoiItemComponent;
  let fixture: ComponentFixture<AoiItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AoiItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AoiItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
