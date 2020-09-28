import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenesPaginatorComponent } from './scenes-paginator.component';

describe('ScenesPaginatorComponent', () => {
  let component: ScenesPaginatorComponent;
  let fixture: ComponentFixture<ScenesPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenesPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenesPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
