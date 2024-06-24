import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-appointment',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.css']
})
export class PatientAppointmentComponent implements OnInit, OnChanges {
  @Input() patientId: any;
  first = 0;
  rows = 10;
  showAddAppointment = false;
  businessId: any;
  patientData: any;
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
    private patientService: PatientService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private authenticationService: AuthService
  ) {}
  ngOnInit(): void {
    this.getUser();
  }

  ngOnChanges(): void {
    if (this.patientId) {
      this.loadPatientInfo();
      this.loadPatientAppointments();
    }
  }

  getUser() {
    this.authenticationService.currentUserSubject.subscribe((data) => {
      this.businessId = data?.businessId;
    });
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

  editAppointment(id: Number) {
    this.router.navigate(['/appointment/booking-history/' + id + '/edit']);
  }

  async loadPatientInfo() {
    this.patientData = (await this.patientService.getPatientOptimized(
      this.patientId
    )) as any;

    this.patientData = this.patientData;
  }

  loadPatientAppointments() {
    this.patientService.getPatientAppointmentsOptimized(this.patientId).then(
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
        this.toastMessageService.error('Unable to load patient appointments.');
      }
    );
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  afterAppointmentCreated(event: any) {
    console.log(event);
    this.showAddAppointment = false;
    if (this.patientId) {
      this.loadPatientAppointments();
    }
  }

  addAppointment() {
    this.showAddAppointment = true;
  }
}
