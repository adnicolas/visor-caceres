import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AoisListComponent } from './aois-list.component';

describe('AoisListComponent', () => {
  let component: AoisListComponent;
  let fixture: ComponentFixture<AoisListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AoisListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AoisListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
