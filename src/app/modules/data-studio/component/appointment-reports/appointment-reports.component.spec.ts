import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReportsComponent } from './appointment-reports.component';

describe('AppointmentReportsComponent', () => {
  let component: AppointmentReportsComponent;
  let fixture: ComponentFixture<AppointmentReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentReportsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
