/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StripeCardComponent } from 'ngx-stripe';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-payment-information',
  templateUrl: './payment-information.component.html',
  styleUrls: ['./payment-information.component.css']
})
export class PaymentInformationComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Input() booking: any;
  @Output() onPaymentSuccess = new EventEmitter<any>();
  @Output() onPaymentCancel = new EventEmitter<any>();
  payNowOption = false;
  btnStyle = {
    backgroundColor: '',
    color: '',
    border: '',
    textTransform: 'uppercase'
  };

  btnTextStyle = {
    color: '',
    textTransform: 'uppercase'
  };

  titleStyle = {
    color: '',
    textTransform: 'uppercase'
  };

  activeLinkStyle = {
    color: '',
    textTransform: 'uppercase'
  };

  activeLinkBorder = {
    borderColor: ''
  };
  alertService: any;
  landingPageId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionnaireService: BusinessService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((d) => {
      if (Object.keys(d).length > 0) {
        this.landingPageId = d?.lpid;
      }
    });

    //this.loadPersonalizationColors()
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
    }
    this.payNowOption = true;
  }

  loadPersonalizationColors() {
    if (this.landingPageId) {
      this.questionnaireService
        .getPublicQuestionnaireFromLandingPageId(
          this.booking.businessId,
          this.landingPageId
        )
        .then((response) => {
          if (response) {
            this.setPersonalizationColors(response);
          }
        });
    } else {
      this.questionnaireService
        .getPublicQuestionnaireOptimized(this.booking.businessId)
        .then(
          (response: any) => {
            this.setPersonalizationColors(response);
          },
          () => {
            this.alertService.error('Unable to load questionnnaire.');
          }
        );
    }
  }

  setPersonalizationColors(response: any) {
    if (response) {
      this.btnStyle = {
        backgroundColor: response.buttonBackgroundColor,
        color: response.buttonForegroundColor,
        border: response.buttonBackgroundColor,
        textTransform: 'uppercase'
      };
      this.btnTextStyle.color = response.buttonForegroundColor;
      this.titleStyle.color = response.titleColor;
      this.activeLinkStyle.color = response.activeSideColor;
      this.activeLinkBorder.borderColor = response.activeSideColor;
    }
  }
  paymentOnPaymentSuccess($event: any) {
    this.onPaymentSuccess.emit($event);
  }

  paymentOnPaymentCancel() {
    this.onPaymentCancel.emit({ cancel: true });
  }
}
