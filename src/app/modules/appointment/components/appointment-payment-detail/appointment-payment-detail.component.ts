import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { AppointmentService } from '../../services/appointment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-appointment-payment-detail',
  templateUrl: './appointment-payment-detail.component.html',
  styleUrls: ['./appointment-payment-detail.component.css']
})
export class AppointmentPaymentDetailComponent implements OnInit {
  appointmentId: any = null;
  appointment: any;
  service: any;
  modalData: any;
  appointmentPayments: any = [];
  currency: any = null;
  defaultImg = 'https://g99plus.b-cdn.net/AEMR/assets/images/avtar.jpeg';
  editCost: boolean = false;
  showModal: boolean = false;
  showServiceModal: boolean = false;
  showEditServiceModal: boolean = false;
  showDeleteModal: boolean = false;
  amount: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private appointmentService: AppointmentService,
    private localStorage: LocalStorageService,
    private router: Router,
    public formatTimeService: FormatTimeService,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.activatedRoute.snapshot.params.appointmentId;
    console.log(this.appointmentId, this.activatedRoute.snapshot.params);
    if (this.appointmentId) {
      this.loadAppointment();
      this.loadAppointmentPayments();
    } else {
      this.appointmentId = this.activatedRoute.snapshot.params.id;
      if (this.appointmentId) {
        this.loadAppointment();
        this.loadAppointmentPayments();
      }
    }
    const userData = this.localStorage.readStorage('currentUser');
    console.log(userData);
    if (userData && userData?.businessId) {
      this.loadBuisnessInfo(userData.businessId);
    }
  }

  loadAppointment() {
    this.appointmentService.getSingleAppointment(this.appointmentId).then(
      (response: any) => {
        this.appointment = response;
        this.amount = response?.totalCost;
        this.currency = response.clinic?.currency;
        this.currency = this.currency?.toUpperCase();
      },
      () => {
        this.alertService.error(
          'Unable to load the appointment. Please try again later.'
        );
      }
    );
  }

  loadAppointmentPayments() {
    this.appointmentService.getAppointmentPayments(this.appointmentId).then(
      (response: any) => {
        this.appointmentPayments = response;
      },
      () => {
        this.alertService.error('Unable to load the provider services.');
      }
    );
  }

  loadBuisnessInfo(bid: any) {
    this.appointmentService.getBusinessOptimized(bid).then((response: any) => {
      this.defaultImg =
        response?.logoUrl ??
        'https://g99plus.b-cdn.net/AEMR/assets/images/avtar.jpeg';
    });
  }

  editTotalCost() {
    this.editCost = true;
  }

  editService(service: any) {
    console.log(service);
    this.service = service;
    this.showEditServiceModal = true;
  }

  submitPaymentForm1() {
    this.editCost = false;
    const formData = {
      totalCost: this.appointment.totalCost
    };
    this.appointmentService
      .updateAppointmentTotalCost(this.appointmentId, formData)
      .then(
        () => {
          this.ngOnInit();
          this.alertService.success('Payment updated successfully.');
        },
        () => {
          this.alertService.error('Unable to update payment.');
        }
      );
  }

  openRefundModal() {
    this.showModal = true;
  }

  openServiceModal() {
    this.showServiceModal = true;
  }
  onCloseModal(e: any) {
    console.log(e);
    this.showModal = false;
    this.showServiceModal = false;
    this.showEditServiceModal = false;
    if (e && e?.refreshPage) {
      // this.loadAppointment();
      // this.loadAppointmentPayments();
      location.reload();
      //this.ngOnInit();
    }
  }

  deleteAppointmentServiceModal(data: any) {
    console.log('In deleteAppointmentServiceModal');

    var name = data.name;
    this.modalData = {
      name: name,
      id: data.id
    };
    this.showDeleteModal = true;
    this.modalData.feildName = name;
    this.modalData.titleName = 'Appointment Service';
    console.log('Out deleteAppointmentServiceModal ');
  }

  onCloseAppointmentServiceModal(e: any) {
    console.log('In onCloseAppointmentServiceModal');
    this.showDeleteModal = false;
    if (e.isDelete) {
      this.deleteAppointmentService(this.modalData.id);
    }
  }

  deleteAppointmentService(id: number) {
    this.appointmentService
      .deleteAppointmentService(this.appointmentId, id)
      .then(
        () => {
          this.loadAppointment();
          this.loadAppointmentPayments();
          this.alertService.success(
            'Appointment Service deleted successfully.'
          );
        },
        (error) => {
          if (error?.error?.errorMessage) {
            this.alertService.error(error?.error?.errorMessage);
            return;
          }
          this.alertService.error('Unable to delete Appointment Service.');
        }
      );
  }

  cancelTotalCost() {
    this.editCost = false;
  }

  onPaymentSuccess() {
    this.alertService.success('Payment completed successfully.');
    this.loadAppointment();
    this.loadAppointmentPayments();
    // this.router.navigate(['/appointment/booking-history']);
  }

  onPaymentCancel() {
    this.router.navigate(['/payments'], {
      state: { isDataModified: false }
    });
  }

  goBack() {
    this.location.back();
    this.router.navigate(['/patients']);
  }
  formatWord(word: string) {
    if (word === 'PartiallyRefunded') {
      return 'Partially refunded';
    }
    if (word === 'PartiallyPaid') {
      return 'Partially paid';
    }
    if (word === 'PartiallyDeposit') {
      return 'Partially deposit';
    }
    if (word === 'DepositPaid') {
      return 'Deposit Paid';
    } else {
      return word;
    }
  }

  sendInvoice() {
    this.appointmentService.sendInvoiceEmail(this.appointmentId).then(
      (response: any) => {
        if (response === 'SUCCESS')
          this.alertService.success('Email sent successfully.');
        else this.alertService.error('Unable to send email.');
      },
      () => {
        this.alertService.error('Unable to send email.');
      }
    );
  }
}
