import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSocialProfileComponent } from './add-edit-social-profile.component';

describe('AddEditSocialProfileComponent', () => {
  let component: AddEditSocialProfileComponent;
  let fixture: ComponentFixture<AddEditSocialProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditSocialProfileComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSocialProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
