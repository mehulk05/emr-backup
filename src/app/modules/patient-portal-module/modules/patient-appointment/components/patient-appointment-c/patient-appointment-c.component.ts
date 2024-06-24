import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PateintAppointmentService } from '../../service/pateint-appointment.service';

@Component({
  selector: 'app-patient-appointment-c',
  templateUrl: './patient-appointment-c.component.html',
  styleUrls: ['./patient-appointment-c.component.css']
})
export class PatientAppointmentCComponent implements OnInit {
  currentPaitent: any;
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
    private patientService: PateintAppointmentService,
    private localStorageService: LocalStorageService
  ) {
    this.currentPaitent = localStorageService.readStorage('currentUser');
  }
  ngOnInit(): void {
    this.loadPatientAppointments();
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
