import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientQuestionarieAnsComponent } from './patient-questionarie-ans.component';

describe('PatientQuestionarieAnsComponent', () => {
  let component: PatientQuestionarieAnsComponent;
  let fixture: ComponentFixture<PatientQuestionarieAnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatientQuestionarieAnsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientQuestionarieAnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
