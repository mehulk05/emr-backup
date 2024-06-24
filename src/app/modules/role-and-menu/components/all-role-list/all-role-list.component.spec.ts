import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRoleListComponent } from './all-role-list.component';

describe('AllRoleListComponent', () => {
  let component: AllRoleListComponent;
  let fixture: ComponentFixture<AllRoleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllRoleListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
