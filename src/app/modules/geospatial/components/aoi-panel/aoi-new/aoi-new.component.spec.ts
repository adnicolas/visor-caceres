import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AoiNewComponent } from './aoi-new.component';

describe('AoiNewComponent', () => {
  let component: AoiNewComponent;
  let fixture: ComponentFixture<AoiNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AoiNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AoiNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
