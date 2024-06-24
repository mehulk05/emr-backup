import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../services/patient.service';

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

  @Input() patientId: any;
  payments: any = [];
  constructor(
    private router: Router,
    private patientService: PatientService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}
  ngOnChanges(): void {
    if (this.patientId) {
      this.loadPatientPayments();
    }
  }

  loadPatientPayments() {
    this.patientService.getayments(this.patientId).then(
      (response: any) => {
        response = response.map((data: any) => {
          (data['appointmentId'] = data.appointment.id),
            (data['appointmentDate'] = data.appointment.appointmentDate),
            (data['totalCost'] = data.appointment.totalCost);
          return data;
        });
        this.payments = response;
      },
      () => {
        this.toastMessageService.error('Unable to load patient payments.');
      }
    );
  }

  editPayment(data: any) {
    this.router.navigate(['appointment', data.appointmentId, 'payment'], {
      queryParams: {
        source: 'pateint'
      },
      queryParamsHandling: 'merge'
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
