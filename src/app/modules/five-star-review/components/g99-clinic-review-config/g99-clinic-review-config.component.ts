import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FiveStarViewService } from '../../services/five-star-view.service';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-g99-clinic-review-config',
  templateUrl: './g99-clinic-review-config.component.html',
  styleUrls: ['./g99-clinic-review-config.component.css']
})
export class G99ClinicReviewConfigComponent implements OnInit, OnChanges {
  clinicG99ReviewSettings!: FormGroup;
  ReviewUrlConfig!: FormGroup;
  @Input() clinicData: any;
  @Input() clinicId: any;
  @Input() clinicReviewData: any;
  clinicReviewId: any;
  numberOfReview = [25, 50, 75];
  googleMyBusiness: any;
  facebook: any;
  googlePlaceId: any;
  yelpUrl: any;
  iframeUrl: any;
  buttonIframeUrl: any;
  reviewsIframeUrl: any;
  buttonPreviewUrl: any;
  reviewsPreviewUrl: any;
  refreshReviewFromSource: any;
  faceBookReviewCount = 0;
  gmbReviewCount = 0;
  yelpReviewCount = 0;
  demandforceCount = 0;
  reviewLastRefreshedOn: any;
  showReviewStatus = false;
  showReviewCount = false;
  g99ReviewLandingPage: any;
  domain =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  publicQuestionnaireUrl: any = null;
  g99ReviewUrl: any = null;
  facebookReviewStatus: any;
  yelpReviewStatus: any;
  googleReviewStatus: any;
  demandforceStatus: any;
  floatingReviewsUrl: any;
  floatingReviewsPreviewUrl: any;
  carouselReviewsUrl: any;
  carouselReviewsPreviewUrl: any;
  multiLocationIframe: string;

  constructor(
    public formBuilder: FormBuilder,
    private toastMessageService: ToasTMessageService,
    private clinicService: FiveStarViewService,
    private router: Router,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.ReviewUrlConfig = this.formBuilder.group({
      facebook: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      googleMyBusiness: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      googlePlaceId: ['', [Validators.pattern(RegexEnum.textField_Spaces)]],
      yelpUrl: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      demandforceUrl: ['', [Validators.pattern(RegexEnum.httpUrl)]]
    });
    this.clinicG99ReviewSettings = this.formBuilder.group({
      //allowOnlineBooking: [false, []],

      // g99AppReviewCode: ['', []],
      // reviewButtonCode: ['', []],
      // googleMyBusiness: ['', []],
      // facebook: ['', []],
      reviewPerPage: [25, []],
      // g99OverrideButtonCode: ['', []],

      reviewUsButtonEnabled: [true, []],
      buttonText: ['Leave a Review', []],
      sortReviewType: [true, []],
      widgetHeader: ['Leave us a review!', []],
      widgetDescription: [
        'Please leave a review to let our team and others know about your experience. This helps our team give you and future clients the best customer service possible.',
        []
      ],
      positiveContent: ['My experience was great!', []],
      negativeContent: ['My experience was not good.'],
      showFiveStarReviewOnly: [false, []],
      disableNegativeComment: [true, []],
      maskLastName: [false, []],
      enableReviewManager: [false, []],
      maskFirstName: [false, []]
    });

    // this.loadClinicReviewDetail();
    this.loadClinicDetail();
    // if (Object.keys(this.clinicData).length === 0) {
    //   this.loadClinicDetail();
    // } else {
    //   this.googleMyBusiness = this.clinicData.googleMyBusiness;
    //   this.facebook = this.clinicData.facebook;
    //   this.yelpUrl = this.clinicData.yelpUrl;
    //   this.googlePlaceId = this.clinicData.googlePlaceId;
    // }
  }

  handleReveiwStatus(response: any) {
    console.log(response);
    if (!response.enableReviewManager) {
      this.showReviewStatus = false;
    }
    if (response.enableReviewManager) {
      this.clinicService
        .getClinicReviewStatus(this.clinicId)
        .then((response: any) => {
          console.log(response);
          this.showReviewStatus = true;
          // console.log(response);
          // this.refreshReviewFromSource = response.data?.status;
          this.googleReviewStatus = response.data?.googleStatus;
          this.gmbReviewCount = response.data?.googleCount ?? 0;
          this.facebookReviewStatus = response.data?.fbStatus;
          this.faceBookReviewCount = response.data?.facebookCount ?? 0;
          this.yelpReviewStatus = response.data?.yelpStatus;
          this.yelpReviewCount = response.data?.yelpCount ?? 0;
          this.demandforceStatus = response.data?.demandforceStatus;
          this.demandforceCount = response.data?.demandforceCount ?? 0;
          this.reviewLastRefreshedOn = response.data?.lastRefreshOn;
          this.showReviewCount = true;
        });
    }
  }

  setConfigUrsl(response: any) {
    this.publicQuestionnaireUrl =
      environment.OLD_EMR_DOMAIN +
      '/assets/static/form.html?bid=' +
      response.businessId +
      '&fid=' +
      response.questionnaireId;

    this.g99ReviewUrl =
      environment.G99_REVIEW_DOMAIN +
      'widget/?id=' +
      this.clinicReviewData.encryptedClinicId +
      '&bid=' +
      response?.businessId;

    this.g99ReviewLandingPage =
      environment.G99_REVIEW_DOMAIN +
      'clinicReviews/?id=' +
      this.clinicReviewData.encryptedClinicId;

    this.iframeUrl =
      '<script src="' +
      environment.G99_REVIEW_DOMAIN +
      'reviews.js"></script>' +
      '<iframe style="width: 100%;" frameborder="0;" className="myIframe" scrolling="no"  id="ReviewsWidget" src="' +
      this.g99ReviewUrl +
      '"></iframe>';

    this.multiLocationIframe =
      '<script src="' +
      environment.G99_REVIEW_DOMAIN +
      'reviews.js"></script>' +
      '<iframe style="width: 100%;" frameborder="0;" className="myIframe" scrolling="no"  id="ReviewsWidget" src="' +
      this.g99ReviewUrl +
      '&allowMultiLocation=true"></iframe>';

    this.buttonPreviewUrl = this.g99ReviewUrl + '&b=t';

    this.reviewsPreviewUrl = this.g99ReviewUrl + '&r=t';

    this.buttonIframeUrl =
      '<iframe style="width: 100%; height: 60px" frameborder="0;" className="ruButtonIframe" scrolling="no" id="ruButtonIframe" src="' +
      this.buttonPreviewUrl +
      '"></iframe>';
    this.reviewsIframeUrl =
      '<script src="' +
      environment.G99_REVIEW_DOMAIN +
      'reviews.js"></script>' +
      '<iframe style="width: 100%;" frameborder="0;" className="reviewsIframe" scrolling="no" id="ReviewsWidget" src="' +
      this.reviewsPreviewUrl +
      '"></iframe>';

    this.floatingReviewsUrl =
      `<div id="emr-review-div" data-id="${this.clinicReviewData.encryptedClinicId}"></div>` +
      `<script id="emr-reviews-integration-script" src="${environment.G99_REVIEW_DOMAIN}floating-reviews.js"></script>`;
    this.floatingReviewsPreviewUrl = `${environment.G99_REVIEW_DOMAIN}integration.html?id=${this.clinicReviewData.encryptedClinicId}`;

    this.carouselReviewsPreviewUrl = this.g99ReviewUrl + '&c=t';
    this.carouselReviewsUrl =
      '<script src="' +
      environment.G99_REVIEW_DOMAIN +
      'reviews.js"></script>' +
      '<iframe style="width: 100%;" frameborder="0;" className="reviewsIframe" scrolling="no" id="ReviewsWidget" src="' +
      this.carouselReviewsPreviewUrl +
      '"></iframe>';
  }

  loadClinicReviewDetail() {
    this.clinicService
      .getClinicReview(this.clinicId)
      .then((response: any) => {
        this.clinicReviewData = response;
        console.log(this.clinicReviewData);
        this.setFormValue(response);
        this.clinicReviewId = response.id;

        this.handleReveiwStatus(response);
        this.setConfigUrsl(response);
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load clinic Review.');
      });
  }

  loadClinicDetail() {
    this.clinicService
      .getSingleClinic(this.clinicId)
      .then((response) => {
        this.clinicData = response;
        // this.updateClinicForm();
        this.ReviewUrlConfig.patchValue({
          googleMyBusiness: this.clinicData.googleMyBusiness,
          facebook: this.clinicData.facebook,
          yelpUrl: this.clinicData.yelpUrl,
          googlePlaceId: this.clinicData.googlePlaceId,
          demandforceUrl: this.clinicData.demandforceUrl
        });
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load clinic.');
      });
  }

  get f() {
    return this.clinicG99ReviewSettings.controls;
  }

  ngOnChanges(): void {
    console.log(this.clinicId);
    if (
      this.clinicId != null &&
      this.clinicG99ReviewSettings &&
      this.clinicG99ReviewSettings.controls
    ) {
      this.loadClinicReviewDetail();
      this.loadClinicDetail();
    }

    console.log(this.clinicReviewData);
    if (this.clinicReviewData) {
      setTimeout(() => {
        this.setFormValue(this.clinicReviewData);
        this.handleReveiwStatus(this.clinicReviewData);
        this.setConfigUrsl(this.clinicReviewData);
      }, 200);
    }
  }

  setFormValue(response: any) {
    this.clinicG99ReviewSettings.patchValue({
      reviewPerPage: response.reviewPerPage,
      reviewUsButtonEnabled: response.reviewUsButtonEnabled,
      buttonText: response.buttonText,
      sortReviewType: response.sortReviewType,
      widgetHeader: response.widgetHeader,
      widgetDescription: response.widgetDescription,
      positiveContent: response.positiveContent,
      negativeContent: response.negativeContent,
      showFiveStarReviewOnly: response.showFiveStarReviewOnly,
      disableNegativeComment: response.disableNegativeComment,
      maskLastName: response.maskLastName,
      enableReviewManager: response.enableReviewManager,
      maskFirstName: response.maskFirstName
    });
  }

  onCancelForm() {
    this.router.navigate(['clinics']);
  }

  updateClinicReviewSettings() {
    console.log(this.clinicG99ReviewSettings.controls.value);
    this.clinicG99ReviewSettings.patchValue({
      // g99AppReviewCode: this.clinicData?.g99AppReviewCode,
      // reviewButtonCode: this.clinicData?.reviewButtonCode,
      // facebook: this.clinicData.facebook,
      // googleMyBusiness: this.clinicData.googleMyBusiness,
      reviewPerPage: this.clinicData.reviewPerPage,
      g99ReviewButtonCode: this.clinicData.g99ReviewButtonCode,
      g99OverrideButtonCode: this.clinicData.g99OverrideButtonCode
    });
  }

  scrapReview() {
    if (!this.showReviewStatus) {
      this.toastMessageService.error(
        'Please enable Review Manager to fetch latest reviews.'
      );
      return;
    }
    this.showReviewCount = false;
    this.clinicService
      .scrapClinic(this.clinicId)
      .then(() => {
        this.loadClinicReviewDetail();
      })
      .catch(() => {
        this.toastMessageService.error('Unable to Scrap clinic.');
      });
  }

  get r() {
    return this.ReviewUrlConfig.controls;
  }

  submitForm() {
    const rformData = this.ReviewUrlConfig.value;
    const formData = this.clinicG99ReviewSettings.value;
    console.log('In submit form data>>>>', formData);
    this.clinicService
      .updateClinicG99ReviewSetting(this.clinicReviewData?.id, formData)
      .then(
        (response: any) => {
          if (response.isReviewPublished) {
            this.toastMessageService.success(
              'Review settings updated successfully And queue get published.'
            );
          } else {
            this.toastMessageService.success(
              'Review configuration updated successfully'
            );
          }

          this.loadClinicReviewDetail();
        },
        () => {
          this.toastMessageService.error('Unable to save Review configuration');
        }
      );

    this.clinicData.googlePlaceId = rformData.googlePlaceId;
    this.clinicData.googleMyBusiness = rformData.googleMyBusiness;
    this.clinicData.facebook = rformData.facebook;
    this.clinicData.yelpUrl = rformData.yelpUrl;
    this.clinicData.demandforceUrl = rformData.demandforceUrl;
    this.clinicService.updateClinic(this.clinicId, this.clinicData).then(
      (response: any) => {
        console.log(response);
        if (response.isReviewPublished) {
          this.toastMessageService.success(
            'Clinic updated successfully And queue get published.'
          );
        } else {
          // this.toastMessageService.success('Clinic updated successfully.');
        }
        this.loadClinicDetail();
      },
      () => {
        this.toastMessageService.error('Unable to save clinic.');
      }
    );
  }
}
