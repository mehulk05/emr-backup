import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment-payment',
  templateUrl: './appointment-payment.component.html',
  styleUrls: ['./appointment-payment.component.css']
})
export class AppointmentPaymentComponent implements OnInit {
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'patientFirstName',
    'patientLastName',
    'serviceList[0].serviceName',
    'appointmentType',
    'appointmentStatus',
    'paymentStatus'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Patient', field: 'patientFirstName' },
    { header: 'Services', field: 'serviceList' },
    { header: 'Appointment Date', field: 'appointmentStartDate' },
    { header: 'Payment Status', field: 'paymentStatus' },
    { header: 'Created Date', field: 'appointmentCreatedDate' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: AppointmentDto[] = [];
  userId!: string;
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadAppointment();
  }
  loadAppointment() {
    this.appointmentService
      .getAppointments()
      .then((data: any) => {
        this.rowData = data.appointmentDTOList;
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load appointments');
      });
  }

  editAppointment(id: Number) {
    this.router.navigate(['/appointment/booking-history/' + id + '/edit']);
  }

  deleteAppointmentModal(data: any) {
    this.appointmentService.deleteAppointment(data.id).then(
      () => {
        this.rowData = [];
        this.loadAppointment();
      },
      () => {
        this.toastMessageService.error('Unable to delete a appointment');
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
