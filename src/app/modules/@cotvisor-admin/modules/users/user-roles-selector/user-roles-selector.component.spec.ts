import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesSelectorComponent } from './user-roles-selector.component';

describe('UserRolesSelectorComponent', () => {
  let component: UserRolesSelectorComponent;
  let fixture: ComponentFixture<UserRolesSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserRolesSelectorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
