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
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PackagePaymentService } from 'src/app/modules/account-and-settings/business/services/package-payment.service';
import { RoutingStateService } from '../../services/routing-state.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-pachage-payment',
  templateUrl: './pachage-payment.component.html',
  styleUrls: ['./pachage-payment.component.css']
})
export class PachagePaymentComponent implements OnInit, OnChanges {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() package: any; // { "businessId": 123, "appointment": {123}}
  @Output() afteronPaymentSuccess = new EventEmitter<any>();
  @Output() afteronPaymentCancel = new EventEmitter<any>();
  intervals: string[] = ['monthly', 'quarterly', 'half-yearly', 'yearly'];
  selectedInterval: string = null;
  isPayBtnDisabled: boolean = false;
  subscriptionAlreadyPresent: boolean;
  businessId: any;
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
  cardholdername: string = '';
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
  isRecurring: boolean = false;
  displayError: string = '';
  stripeTest: FormGroup;
  stripeLoaded = false;
  stripeAccountId: any = null;
  landingPageId: any;
  pageSource: any;
  currency: any = JSON.parse(localStorage.getItem('defaultClinic'));
  constructor(
    private fb: FormBuilder,
    private alertService: ToasTMessageService,
    private stripeService: StripeService,
    private paymentService: PackagePaymentService,
    private routingStateService: RoutingStateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private localStore: LocalStorageService
  ) {}

  ngOnInit(): void {
    console.log('In Package payment');
    this.businessId = this.localStore.readStorage('businessInfo')?.id;
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.activatedRoute.queryParams.subscribe((data: any) => {
      console.log('Package data');

      this.pageSource = data?.from;
    });
  }

  makeOneTimePayment = () => (this.isRecurring = false);
  makeRecurringPayment = () => {
    if (this.subscriptionAlreadyPresent) {
      this.alertService.info(
        'Subscription is already active please cancel to create new one!'
      );
      return;
    }
    this.isRecurring = true;
  };

  ngOnChanges(): void {
    console.log(this.package);
    if (this.package) {
      this.paymentService.getStripeAccount().then(
        (response: any) => {
          if (response.stripeAccountId != null) {
            this.stripeAccountId = response.stripeAccountId;
            this.stripeService.changeKey(response.stripeApiKey, {
              stripeAccount: response.stripeAccountId
            });
            this.stripeLoaded = true;

            this.paymentService
              .getSubscriptions()
              .then(() => {
                this.subscriptionAlreadyPresent = true;
              })
              .catch((error: any) => {
                this.subscriptionAlreadyPresent = false;
                console.log(error.message);
              });
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

  changeClient(selection: any): void {
    this.selectedInterval = selection;
  }

  onChange = (ev: StripeCardElementChangeEvent) =>
    (this.displayError = ev.error ? ev.error.message : '');

  submit(): void {
    if (!this.cardholdername) {
      this.alertService.info("Please enter cardholder's name");
      return;
    }

    if (this.displayError) {
      this.alertService.info(this.displayError);
      return;
    }
    if (this.isRecurring && this.subscriptionAlreadyPresent) {
      this.alertService.info(
        'Subscription is already active please cancel to create new!'
      );
      return;
    }
    this.isRecurring ? this.createSubscription() : this.createPaymentIntent();
  }

  createSubscription() {
    console.log('Inside createSubscription');
    this.isPayBtnDisabled = true;
    this.stripeService
      .createPaymentMethod({
        type: 'card',
        card: this.card.element,
        billing_details: { name: this.cardholdername }
      })
      .subscribe((result) => {
        if (result?.paymentMethod) {
          // Send the payment method to your server
          console.log(JSON.stringify(result?.paymentMethod));

          const paymentId: any = result?.paymentMethod.id;
          this.paymentService
            .createStripeCustomerAndAssignPaymentDetails(
              paymentId,
              this.businessId
            )
            .then((response: any) => {
              console.log(JSON.stringify(response));
              const payload = {
                packageId: this.package.id,
                stripeCustomerId: response.stripeCustomerId,
                interval: 'monthly'
              };
              this.paymentService
                .subscribeToProduct(payload)
                .then((response: any) => {
                  if (response?.subScriptionId)
                    this.afteronPaymentSuccess.emit();
                  else
                    throw 'Subscription creation failed because of server issues!';
                })
                .catch((error: any) => {
                  console.log(error?.message);
                  this.isPayBtnDisabled = false;
                  this.alertService.error(
                    result.error.message + ', Error creating subscription!'
                  );
                });
            })
            .catch((error: any) => {
              console.log(error.message);
              this.isPayBtnDisabled = false;
              this.alertService.error(
                error?.error ? error.error : error.message
              );
            });
        } else if (result?.error) {
          // Error creating the token
          this.isPayBtnDisabled = false;
          console.log(result.error?.message);
          this.alertService.error(result.error?.message);
        }
      });
  }

  createPaymentIntent() {
    this.isPayBtnDisabled = true;
    const paymentData = { emailSmsPackageId: this.package.id };
    this.paymentService
      .createPaymentIntent(paymentData)
      .then((response: any) => {
        this.stripeService
          .confirmCardPayment(response.intentSecret, {
            payment_method: { card: this.card.element }
          })
          .subscribe((result: any) => {
            if (result.error) {
              this.isPayBtnDisabled = false;
              this.alertService.error(result.error.message);
              setTimeout(
                () =>
                  this.alertService.info(
                    'Unable to capture the payment. You can pay at desk.'
                  ),
                1000
              );
            } else {
              const confirmPaymentData = {
                emailSmsPackageId: this.package.id,
                response: JSON.stringify(result),
                stripeAccountId: this.stripeAccountId
              };

              this.paymentService.confirmPayment(confirmPaymentData).then(
                () => {
                  this.afteronPaymentSuccess.emit({ paid: true });
                },
                () => {
                  // this needs to handle correctly
                  this.isPayBtnDisabled = false;
                  this.alertService.error(
                    'We have received your payment but unable to store on server.'
                  );
                }
              );
            }
          });
      })
      .catch((err: any) => {
        console.error(err);
        this.isPayBtnDisabled = false;
      });
  }
  cancel() {
    this.afteronPaymentCancel.emit({ cancel: true });
  }

  onCancel() {
    this.location.back();
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
          ['patients', this.package.appointment.patient.id, 'edit'],
          {
            queryParams: { currentTab: 'payments' },
            skipLocationChange: true
          }
        );
      } else {
        this.router.navigateByUrl(previousUrl);
      }
    }
  }
}
