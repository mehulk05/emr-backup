import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPatientConsentComponent } from './assign-patient-consent.component';

describe('AssignPatientConsentComponent', () => {
  let component: AssignPatientConsentComponent;
  let fixture: ComponentFixture<AssignPatientConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignPatientConsentComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPatientConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
