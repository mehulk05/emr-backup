import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientDashboardService } from '../../service/patient-dashboard.service';

@Component({
  selector: 'app-patient-payment',
  templateUrl: './patient-payment.component.html',
  styleUrls: ['./patient-payment.component.css']
})
export class PatientPaymentComponent implements OnChanges {
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'appointmentId',
    'createdBy',
    'appointmentDate',
    'amount',
    'paymentStatus',
    'source',
    'createdAt'
  ];
  columns = [
    { header: 'Appointment Id', field: 'appointmentId' },

    { header: 'Appointment Date', field: 'appointmentDate' },
    { header: 'Amount', field: 'amount' },

    { header: 'Payment Date', field: 'createdAt' },
    { header: 'Status', field: 'paymentStatus' },
    { header: 'Payment Source', field: 'source' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;

  @Input() currentPaitent: any;
  payments: any = [];
  constructor(
    private router: Router,
    private patientService: PatientDashboardService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnChanges(): void {
    if (this.currentPaitent) {
      this.loadPatientPayments();
    }
  }

  loadPatientPayments() {
    console.log('test');
    this.patientService.getayments(this.currentPaitent?.id).then(
      (response: any) => {
        response = response.map((data: any) => {
          (data['appointmentId'] = data.appointment.id),
            (data['appointmentDate'] = data.appointment.appointmentDate),
            (data['totalCost'] = data.appointment.totalCost);
          return data;
        });
        this.payments = response;
        console.log(this.payments);
      },
      () => {
        this.toastMessageService.error('Unable to load patient payments.');
      }
    );
  }

  editPayment(data: any) {
    this.router.navigate(
      ['/patient-portal/patient/appointment', data.appointmentId, 'payment'],
      {
        queryParams: {
          source: 'pateint'
        },
        queryParamsHandling: 'merge'
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

  formatTime(time: any) {
    return this.formatTimeService.formatTime(time);
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
