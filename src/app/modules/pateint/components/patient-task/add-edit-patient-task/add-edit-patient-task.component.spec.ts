import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPatientTaskComponent } from './add-edit-patient-task.component';

describe('AddEditPatientTaskComponent', () => {
  let component: AddEditPatientTaskComponent;
  let fixture: ComponentFixture<AddEditPatientTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditPatientTaskComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPatientTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
