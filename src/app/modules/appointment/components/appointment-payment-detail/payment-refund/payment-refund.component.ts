import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { PaymentService } from '../../../services/payment.service';

@Component({
  selector: 'app-payment-refund',
  templateUrl: './payment-refund.component.html',
  styleUrls: ['./payment-refund.component.css']
})
export class PaymentRefundComponent implements OnInit {
  @Input() showModal: any;
  @Input() appointmentId: any;
  @Output() modalClosed = new EventEmitter<any>();
  appointmentPayments: any;
  refundAmount: any;
  constructor(
    private alertService: ToasTMessageService,
    private paymentService: PaymentService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadTransactionSummary();
  }

  loadTransactionSummary() {
    this.paymentService.getAppointmentPayments(this.appointmentId).then(
      (response: any) => {
        this.appointmentPayments = response;
      },
      () => {
        this.alertService.error('Unable to load the provider services.');
      }
    );
  }

  hideModal() {
    this.modalClosed.emit({ from: 'refundModal', refreshPage: false });
    this.showModal = false;
  }

  submitRefund() {
    this.paymentService
      .refundManually(this.appointmentId, this.refundAmount)
      .then(
        () => {
          this.alertService.success('Payments refunded successfully.');
          this.modalClosed.emit({ from: 'refundModal', refreshPage: true });
          this.showModal = false;
          // this.initializeAppointmenForm();
          // this.appointmentId =
          //   this.activatedRoute.snapshot.params.appointmentId;
          // if (this.appointmentId) {
          //   this.loadAppointment();
          //   this.loadAppointmentPayments();
          // }
          // this.closeModal();
        },
        () => {
          this.alertService.error('Unable to refund payments.');
        }
      );
  }
}
