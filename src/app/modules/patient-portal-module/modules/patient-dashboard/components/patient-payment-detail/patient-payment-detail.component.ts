import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientDashboardService } from '../../service/patient-dashboard.service';

@Component({
  selector: 'app-patient-payment-detail',
  templateUrl: './patient-payment-detail.component.html',
  styleUrls: ['./patient-payment-detail.component.css']
})
export class PatientPaymentDetailComponent implements OnInit {
  appointmentId: any = null;
  appointment: any;
  service: any;
  appointmentPayments: any = [];
  currency: any = null;
  defaultImg = 'https://g99plus.b-cdn.net/AEMR/assets/images/avtar.jpeg';
  amount: any;
  pageSource: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private appointmentService: PatientDashboardService,
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

    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.pageSource = data?.from;
    });
  }

  loadAppointment() {
    this.appointmentService.getSingleAppointment(this.appointmentId).then(
      (response: any) => {
        this.appointment = response;
        this.amount = response.totalCost;
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

  onPaymentSuccess() {
    this.alertService.success('Payment completed successfully.');
    // this.loadAppointment();
    // this.loadAppointmentPayments();
    this.goBack();
    // this.router.navigate(['/appointment/booking-history']);
  }

  onPaymentCancel() {
    // this.router.navigate(['/payments'], {
    //   state: { isDataModified: false }
    // });
    this.goBack();
  }

  goBack() {
    // this.location.back();
    // this.router.navigate(['/patients']);
    // this.router.navigate(['/patient-portal/patient/dashboard'], {
    //   queryParams: { source: 'payments' }
    // });
    // this.location.back();
    console.log('page', this.pageSource);
    if (this.pageSource) {
      this.router.navigate([this.pageSource]);
    } else {
      this.location.back();
    }
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
}
