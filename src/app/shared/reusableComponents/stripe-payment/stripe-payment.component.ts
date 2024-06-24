import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { StripeCardComponent, StripeService } from 'ngx-stripe';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PackagePaymentService } from 'src/app/modules/account-and-settings/business/services/package-payment.service';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class StripePayment implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() package: any;
  @Input() type: any;
  @Output() afteronPaymentSuccess = new EventEmitter<any>();
  @Output() afteronPaymentCancel = new EventEmitter<any>();

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

  displayError: string = '';
  stripeTest: FormGroup;
  stripeLoaded = false;
  stripeAccountId: any = null;
  transactionId: any;
  isPaymentInProgress: boolean = false;
  currency: any = JSON.parse(localStorage.getItem('defaultClinic'));
  businessId: any;
  constructor(
    private fb: FormBuilder,
    private alertService: ToasTMessageService,
    private stripeService: StripeService,
    private paymentService: PackagePaymentService,
    private localStore: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.businessId = this.localStore.readStorage('businessInfo')?.id;
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
    this.paymentService.getStripeAccount().then(
      (response: any) => {
        console.log(response);
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
          this.alertService.error('You can make payment at desk.');
        }
      },
      () => {
        this.alertService.error('Error while fetching stripe details');
      }
    );
  }

  onChange = (ev: StripeCardElementChangeEvent) =>
    (this.displayError = ev.error ? ev.error.message : '');

  async submit() {
    if (!this.cardholdername) {
      this.alertService.info("Please enter cardholder's name");
      return;
    }

    if (this.displayError) {
      this.alertService.info(this.displayError);
      return;
    }

    this.type === 'recurring'
      ? this.createSubscription()
      : await this.createPaymentIntent();
  }

  createSubscription() {
    console.log('Inside createSubscription');
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
                  else throw 'Subscription crreation failed!';
                })
                .catch((error: any) => {
                  console.log(error?.message);
                  this.alertService.error('Error creating subscription!');
                });
            })
            .catch((error: any) => {
              console.log(error?.message);
              this.alertService.error('Error creating subscription!');
            });
        } else if (result?.error) {
          // Error creating the token
          console.log(result.error?.message);
          this.alertService.error('Error creating card token!');
        }
      });
  }

  async createPaymentIntent() {
    try {
      this.isPaymentInProgress = true;
      const createPaymentMethodResult = await this.stripeService
        .createPaymentMethod({
          type: 'card',
          card: this.card.element,
          billing_details: { name: this.cardholdername }
        })
        .toPromise();

      if (createPaymentMethodResult?.paymentMethod) {
        // Send the payment method to your server
        console.log(JSON.stringify(createPaymentMethodResult.paymentMethod));
        const paymentId: any = createPaymentMethodResult.paymentMethod.id;
        this.paymentService
          .createStripeCustomerAndAssignPaymentDetails(
            paymentId,
            this.businessId
          )
          .then((response: any) => {
            console.log(JSON.stringify(response));
            const paymentData = {
              cost: 99,
              transactionId: this.transactionId ?? ''
            };
            this.paymentService
              .createPaymentIntent(paymentData)
              .then(async (response: any) => {
                this.transactionId = response.transactionId;
                const stripePaymentResult = await this.stripeService
                  .confirmCardPayment(response.intentSecret, {
                    payment_method: { card: this.card.element }
                  })
                  .toPromise();

                if (stripePaymentResult.error) {
                  const failedPaymentData = {
                    paymentFor: 'upgrade',
                    transactionId: this.transactionId,
                    errorMessage: stripePaymentResult.error?.message ?? ''
                  };
                  this.paymentService
                    .updateFailedPayment(failedPaymentData)
                    .then(() => {
                      this.afteronPaymentCancel.emit({
                        type: 'failed',
                        errorMessage: failedPaymentData.errorMessage
                      });
                    });
                } else {
                  const confirmPaymentData = {
                    response: JSON.stringify(stripePaymentResult),
                    paymentFor: 'upgrade',
                    stripeAccountId: this.stripeAccountId,
                    transactionId: this.transactionId
                  };

                  this.paymentService.confirmPayment(confirmPaymentData).then(
                    () => {
                      this.paymentService
                        .createTwilioUpgradeSubscrption(this.businessId)
                        .then((response: any) => {
                          console.log(response);
                          this.afteronPaymentSuccess.emit({ paid: true });
                        })
                        .catch((error) => {
                          console.log(error);
                        });
                    },
                    () => {
                      // this needs to handle correctly
                      this.isPaymentInProgress = false;
                      this.alertService.error(
                        'We have received your payment but unable to store on server.'
                      );
                    }
                  );
                }
              })
              .catch((e: any) => {
                this.isPaymentInProgress = false;
                console.log('Error creating payment intent ==> ' + e.message);
              });
          })
          .catch((error: any) => {
            this.isPaymentInProgress = false;
            console.log(error?.error);
            this.alertService.error(
              error?.error ?? 'Error Occured Please try again later!'
            );
          });
      } else if (createPaymentMethodResult?.error) {
        // Error creating the token
        this.isPaymentInProgress = false;
        console.log(createPaymentMethodResult.error?.message);
        this.alertService.error('Error creating card token!');
      }
    } catch (error) {
      console.error('error while creating payment method', error);
      this.isPaymentInProgress = false;
    }
  }
  cancel() {
    this.afteronPaymentCancel.emit({ type: 'cancel' });
  }
}
