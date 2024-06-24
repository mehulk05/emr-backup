import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientDashboardService } from '../../service/patient-dashboard.service';

@Component({
  selector: 'app-patient-appointment',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.css']
})
export class PatientAppointmentComponent implements OnChanges {
  @Input() currentPaitent: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'patientName',
    'ClinicName',
    'providerName',
    'serviceList',
    'appointmentType',
    'paymentStatus',
    'appointmentDate',
    'createdAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Client', field: 'patientName' },
    { header: 'Clinic', field: 'ClinicName' },
    { header: 'Provider', field: 'providerName' },
    { header: 'Services', field: 'serviceList' },
    { header: 'Type', field: 'appointmentType' },
    { header: 'Appointment Date', field: 'appointmentDate' },
    { header: 'Payment Status', field: 'paymentStatus' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: AppointmentDto[] = [];
  constructor(
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private patientService: PatientDashboardService
  ) {}

  ngOnChanges(): void {
    if (this.currentPaitent) {
      this.loadPatientAppointments();
    }
  }
  editAppointment(id: Number) {
    this.router.navigate([
      '/patient-portal/patient/appointment/',
      id,
      'preview'
    ]);
  }

  loadPatientAppointments() {
    this.patientService
      .getPatientAppointmentsOptimized(this.currentPaitent.id)
      .then(
        (response: any) => {
          //console.log('repo', response);
          response = response.map((data: any) => {
            data['serviceList'] = data.service
              .map((e: any) => e.serviceName)
              .join(',');
            return data;
          });

          this.rowData = response;
        },
        () => {
          this.toastMessageService.error(
            'Unable to load patient appointments.'
          );
        }
      );
  }

  formatWord(word: string) {
    if (word === 'PartiallyRefunded') {
      return 'Partially Refunded';
    }
    if (word === 'PartiallyPaid') {
      return 'Partially Paid';
    }
    if (word === 'PartiallyDeposit') {
      return 'Partially Deposit';
    }
    if (word === 'DepositPaid') {
      return 'Deposit Paid';
    } else {
      return word;
    }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
