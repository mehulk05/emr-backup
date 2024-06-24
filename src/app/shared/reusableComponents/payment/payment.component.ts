import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PaymentService } from 'src/app/modules/appointment/services/payment.service';
import { RoutingStateService } from '../../services/routing-state.service';
import moment from 'moment-timezone';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnChanges {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() booking: any; // { "businessId": 123, "appointment": {123}}
  @Output() afteronPaymentSuccess = new EventEmitter<any>();
  @Output() afteronPaymentCancel = new EventEmitter<any>();
  btnStyle = {
    backgroundColor: '',
    color: '',
    border: ''
  };

  btnTextStyle = {
    color: ''
  };

  titleStyle = {
    color: '',
    textTransform: 'uppercase'
  };
  cardOptions: StripeCardElementOptions = {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#009EDE',
        color: '#009EDE',
        fontWeight: 500,
        fontFamily: 'sans-serif',
        fontSize: '14px',
        fontSmoothing: 'antialiased',
        fontStyle: 'normal',
        ':-webkit-autofill': {
          color: '#fce883'
        },
        '::placeholder': {
          color: '#009EDE'
        }
      },
      invalid: {
        iconColor: '#eb1c26',
        color: '#eb1c26'
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;
  stripeLoaded = false;
  stripeAccountId: any = null;
  landingPageId: any;
  pageSource: any;
  paymentSource: any = 'Desk';
  currency: any = JSON.parse(localStorage.getItem('defaultClinic'));
  businessId: any;
  preBookingOnly: boolean = false;
  amountToPaid: number = 0;
  patientForm: FormGroup;
  bid: any;
  disablePaymentButton: boolean;
  hidePayLater: boolean;

  constructor(
    private fb: FormBuilder,
    private alertService: ToasTMessageService,
    private stripeService: StripeService,
    private paymentService: PaymentService,
    private routingStateService: RoutingStateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    console.log(this.booking);
    this.hidePayLater = this.booking.selectedClinic.hidePayLater;
    console.log('Hide Pay Later : ' + this.hidePayLater);
    this.getCurrency();
    this.activatedRoute.queryParams.subscribe((d) => {
      if (Object.keys(d).length > 0) {
        this.landingPageId = d?.lpid;
        this.bid = d?.bid;
        console.log(d, this.bid);
      }
    });

    if (this.booking?.appointment) {
      // let totalCost: number = 0;
      if (this.booking.appointment != null) {
        // totalCost = this.booking.appointment.totalCost;
        this.amountToPaid =
          this.booking.appointment.totalCost -
          this.booking.appointment.amountPaid;
      }

      console.log(this.booking);
      console.log(this.amountToPaid);
      // let preBookingCost: number = 0;
      if (
        this.booking.appointment != null &&
        (this.booking.appointment.preBookingOnly ||
          this.booking.appointment.hidePayLater)
      ) {
        // preBookingCost = this.booking.appointment.preBookingCost;
        this.preBookingOnly = true;
      }
      // this.booking = this.booking.appointment;
      this.booking.amountToPaid = this.amountToPaid;
    }
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.pageSource = data?.from;
      if (this.router.url.includes('/patient-portal/')) {
        this.paymentSource = 'Patient';
      }

      if (
        !this.router.url.includes('/patient-portal/') &&
        !this.router.url.includes('/ap-booking/') &&
        data?.from &&
        data?.from != 'pateint' &&
        data?.from != 'patient'
      ) {
        this.paymentSource = 'Desk';
      }
    });

    if (
      !this.router.url.includes('/patient-portal/') &&
      this.router.url.includes('/ap-booking/')
    ) {
      this.paymentSource = 'Public';
    }
  }

  private getCurrency(): void {
    this.paymentService
      .getPublicDefaultCinic(this.booking?.businessId)
      .then((data: any) => {
        this.currency = data;
      });
  }

  ngOnChanges(): void {
    console.log(this.booking);
    if (this.booking && (this.booking?.tenantId || this.booking?.businessId)) {
      this.businessId = this.booking?.tenantId ?? this.booking?.businessId;
      this.handleAmountToPy();
      this.handlePersonalization();
      this.paymentService.getStripeAccount(this.businessId).then(
        (response: any) => {
          if (response.stripeAccountId != null) {
            this.stripeAccountId = response.stripeAccountId;
            this.stripeService.changeKey(response.stripeApiKey, {
              stripeAccount: response.stripeAccountId
            });
            this.stripeLoaded = true;
          } else if (response.stripeApiKey != null) {
            this.stripeService.changeKey(response.stripeApiKey);
            this.stripeLoaded = true;
          } else {
            // TODO - this is test credentials
            //this.stripeService.changeKey(environment.STRIPE_KEY);
            this.alertService.error('You can make payment at desk.');
          }
        },
        () => {
          this.alertService.error('Error while fetching stripe details');
        }
      );
    }
  }

  handlePersonalization() {
    let response: any;
    if (this.landingPageId) {
      response = JSON.parse(localStorage.getItem('websitePersonalization'));
    } else {
      response = JSON.parse(localStorage.getItem('personalization'));
    }
    if (
      response != null &&
      (response.buttonBackgroundColor != null ||
        response.buttonBackgroundColor != '')
    ) {
      this.setPersonalizationColors(response);
    } else {
      this.paymentService.getPublicQuestionnaire(this.booking.businessId).then(
        (response: any) => {
          this.setPersonalizationColors(response);
        },
        () => {
          this.alertService.error('Unable to load questionnnaire.');
        }
      );
    }
    this.patientForm = this.fb.group({
      firstName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]
      ],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_-]+)\\.([a-z]{2,10})(\\.[a-z]{2,10})?$'
          )
        ]
      ],
      phone: ['', [Validators.required, Validators.pattern('^[1-9][0-9]{9}$')]],
      notes: ['', []],
      source: ['Public'],
      appointmentType: ['InPerson', [Validators.required]]
    });

    console.log(this.booking);
    this.patientForm.patchValue({
      firstName: this.booking?.appointment?.patient?.firstName,
      lastName: this.booking?.appointment?.patient?.lastName,
      phone: this.booking?.appointment?.patient?.phone,
      email: this.booking?.appointment?.patient?.email,
      notes: this.booking?.appointment?.patient?.notes,
      appointmentType: this.booking?.appointment?.appointmentType
    });
  }
  handleAmountToPy() {
    if (this.booking.appointment != null) {
      this.amountToPaid =
        this.booking.appointment.totalCost -
        this.booking.appointment.amountPaid;
    }
    if (
      this.booking.appointment != null &&
      (this.booking.appointment.preBookingOnly ||
        this.booking.appointment.hidePayLater)
    ) {
      this.preBookingOnly = true;
    }
  }
  createPaymentIntent() {
    this.disablePaymentButton = true;
    let paymentData;
    if (this.router.url.includes('/ap-booking/')) {
      paymentData = { appointmentId: this.booking.appointment.id };
    } else {
      paymentData = { appointmentId: this.booking.id };
    }
    // const paymentData = { appointmentId: this.booking.id };
    this.paymentService
      .createPaymentIntent(this.businessId, paymentData)
      .then((response: any) => {
        this.stripeService
          .confirmCardPayment(response.intentSecret, {
            payment_method: { card: this.card.element }
          })
          .subscribe((result) => {
            if (result.error) {
              this.handleError(
                'Unable to capture the payment. You can pay at desk.'
              );
            } else {
              const appointmentId = this.router.url.includes('/ap-booking/')
                ? this.booking.appointment.id
                : this.booking.id;

              const confirmPaymentData = {
                appointmentId,
                response: JSON.stringify(result),
                stripeAccountId: this.stripeAccountId,
                source: this.paymentSource
              };

              this.paymentService
                .confirmPayment(this.businessId, confirmPaymentData)
                .then(() => {
                  this.afteronPaymentSuccess.emit({ paid: true });
                })
                .catch(() => {
                  this.handleError(
                    'We have received your payment but unable to store on the server.'
                  );
                });
            }
          });
      })
      .catch(() => {
        this.handleError('An error occurred while processing your payment.');
      });
  }

  cancel() {
    this.afteronPaymentCancel.emit({ cancel: true });
  }

  handleError = (errorMessage: any) => {
    this.alertService.error(errorMessage);

    this.disablePaymentButton = false;
  };

  createPreBookingPaymentIntent() {
    this.disablePaymentButton = true;
    console.log(this.booking);
    let paymentData;
    if (this.hidePayLater) {
      paymentData = {
        clinicId: this.booking.appointment.clinic.id,
        preBookingCost: this.booking.appointment.amountToPaid
      };
    } else {
      paymentData = {
        clinicId: this.booking.appointment.clinic.id,
        preBookingCost: this.booking.appointment.preBookingCost
      };
    }

    console.log(paymentData);
    this.paymentService
      .createPreBookingPaymentIntent(this.booking.businessId, paymentData)
      .then((response: any) => {
        this.stripeService
          .confirmCardPayment(response.intentSecret, {
            payment_method: { card: this.card.element }
          })
          .subscribe((result: any) => {
            if (result.error) {
              this.alertService.error('Unable to capture the payment.');
            } else {
              const formData = this.patientForm.value;
              formData.clinicId = this.booking.appointment.clinic.id;
              formData.providerId = this.booking.provider.id;
              formData.preBookingConfirmed = true;
              formData.serviceIds = [];
              formData.notes = this.booking.appointment.notes;
              formData.appointmentType =
                this.booking.appointment.appointmentType;

              // this.booking.selectedServices.map((service: any) => {
              //   formData.serviceIds.push(service.id);
              // });
              console.log(this.booking);
              for (var i = 0; i < this.booking.selectedServices.length; i++) {
                formData.serviceIds.push(this.booking.selectedServices[i].id);
              }

              const timeZone = localStorage.getItem('clinicTimeZone');
              console.log('clinicTimeZone ' + timeZone);
              var clearUTCDate = moment(this.booking.time)
                .utcOffset(this.booking.time)
                .format('YYYY-MM-DD HH:mm:00');
              console.log(this.booking);
              var zonedDateTime = moment.tz(clearUTCDate, timeZone);
              formData.appointmentDate = zonedDateTime.format(
                'YYYY-MM-DD HH:mm:00 ZZ'
              );
              console.log(
                'formData.appointmentDate ' + formData.appointmentDate
              );
              this.paymentService
                .createNewAppointment(this.booking.businessId, formData)
                .then(
                  (response: any) => {
                    if (response.statusCode == 200) {
                      const appointmentData = response.data;
                      this.booking.appointment = response.data;
                      const confirmPaymentData = {
                        appointmentId: response.data.id,
                        response: JSON.stringify(result),
                        stripeAccountId: this.stripeAccountId,
                        source: this.paymentSource
                      };
                      if (this.hidePayLater) {
                        this.paymentService
                          .confirmPayment(this.businessId, confirmPaymentData)
                          .then(() => {
                            this.afteronPaymentSuccess.emit({
                              paid: true,
                              appointmentData: appointmentData
                            });
                          })
                          .catch(() => {
                            this.handleError(
                              'We have received your payment but unable to store on the server.'
                            );
                          });
                      } else {
                        this.paymentService
                          .confirmPreBookingPayment(
                            this.booking.businessId,
                            confirmPaymentData
                          )
                          .then(
                            (data) => {
                              console.log(data);
                              this.afteronPaymentSuccess.emit({
                                paid: true,
                                appointmentData: appointmentData
                              });
                            },
                            () => {
                              // this needs to handle correctly
                              this.alertService.error(
                                'We have received your payment but unable to store on server.'
                              );
                            }
                          );
                      }

                      localStorage.removeItem('personalization');
                      localStorage.removeItem('selectedTimezone');
                    } else {
                      this.disablePaymentButton = false;

                      this.alertService.error(response.message);
                    }
                  },
                  () => {
                    this.disablePaymentButton = false;

                    this.alertService.error(
                      'Unable to create the appointment.'
                    );
                  }
                );
            }
          });
      });
  }

  onCancel() {
    // this.location.back();
    console.log('page', this.pageSource);
    if (this.pageSource) {
      this.router.navigate([this.pageSource]);
    } else {
      const previousUrl = this.routingStateService.getPreviousUrl();
      console.log('previoous', previousUrl);
      if (this.router.url.includes('/ap-booking/')) {
        this.cancel();
      } else if (previousUrl.includes('edit')) {
        this.router.navigate(
          ['patients', this.booking.appointment.patient.id, 'edit'],
          {
            queryParams: { currentTab: 'payments' },
            skipLocationChange: true
          }
        );
      } else {
        // this.router.navigateByUrl(previousUrl);
        this.location.back();
      }
    }
  }

  setPersonalizationColors(response: any) {
    if (response && this.bid) {
      if (
        response.buttonForegroundColor != null &&
        response.buttonForegroundColor != ''
      ) {
        this.handleStripeStyle(
          response.buttonForegroundColor,
          response.buttonBackgroundColor
        );
        this.btnStyle = {
          backgroundColor: response.buttonBackgroundColor,
          color: response.buttonForegroundColor,
          border: response.buttonBackgroundColor
        };
      }

      if (response.titleColor != null && response.titleColor != '') {
        this.titleStyle = {
          color: response.titleColor,
          textTransform: 'uppercase'
        };
      }
    } else {
      this.btnStyle = {
        backgroundColor: '#fff',
        color: '#009EDE',
        border: '#009EDE'
      };
    }
  }

  handleStripeStyle(fgColor: any, bgColor: any) {
    if (bgColor && this.bid) {
      this.cardOptions.style.base.iconColor = bgColor;
      this.cardOptions.style.base['::placeholder'].color = bgColor;
      this.cardOptions.style.base.color = bgColor;
    }
  }
}
