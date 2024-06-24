import { Component, Input, ViewChild } from '@angular/core';
import { PatientTaskComponent } from '../patient-task/patient-task.component';
import { PatientAppointmentComponent } from '../patient-appointment/patient-appointment.component';

@Component({
  selector: 'app-pateint-detail-single-page',
  templateUrl: './pateint-detail-single-page.component.html',
  styleUrls: ['./pateint-detail-single-page.component.css']
})
export class PateintDetailSinglePageComponent {
  @Input() patientId: number;
  @ViewChild(PatientTaskComponent) patientTask: PatientTaskComponent;
  @ViewChild(PatientAppointmentComponent)
  patientAppointment: PatientAppointmentComponent;
  constructor() {}

  changeTaskList(e: any) {
    if (e) {
      this.patientTask.loadTemplatList();
    }
  }

  changeAppointmentList(e: any) {
    if (e) {
      this.patientAppointment.loadPatientAppointments();
    }
  }
}
