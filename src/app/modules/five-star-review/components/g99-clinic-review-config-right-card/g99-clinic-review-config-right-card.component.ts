import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FiveStarViewService } from '../../services/five-star-view.service';

import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-g99-clinic-review-config-right-card',
  templateUrl: './g99-clinic-review-config-right-card.component.html',
  styleUrls: ['./g99-clinic-review-config-right-card.component.css']
})
export class G99ClinicReviewConfigRightCardComponent
  implements OnInit, OnChanges
{
  @Input() multiLocationIframe: any;
  @Input() clinicReviewData: any;
  @Input() g99ReviewLandingPage: any;
  @Input() clinicReviewId: any;
  @Input() iframeUrl: any;
  @Input() publicQuestionnaireUrl: any;
  @Input() g99ReviewUrl: any;
  @Input() buttonIframeUrl: any;
  @Input() reviewsIframeUrl: any;
  @Input() buttonPreviewUrl: any;
  @Input() reviewsPreviewUrl: any;
  @Input() floatingReviewsUrl: any;
  @Input() floatingReviewsPreviewUrl: any;
  @Input() carouselReviewsUrl: any;
  @Input() carouselReviewsPreviewUrl: any;

  cssFormResponse: any;
  cssForm!: FormGroup;
  cssLandingPage!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private toastMessageService: ToasTMessageService,
    private clinicService: FiveStarViewService
  ) {}

  ngOnChanges(): void {
    console.log(this.iframeUrl);
    if (this.clinicReviewData) {
      this.cssForm.patchValue({
        cssForIframePage: this.clinicReviewData.cssForIframePage
      });

      this.cssLandingPage.patchValue({
        cssForLandingPage: this.clinicReviewData.cssForLandingPage
      });
    }
  }

  ngOnInit(): void {
    this.cssForm = this.formBuilder.group({
      cssForIframePage: ['']
    });
    this.cssLandingPage = this.formBuilder.group({
      cssForLandingPage: ['']
    });
  }

  submitCssForm() {
    if (this.cssForm.invalid) {
      return;
    }

    const formData = this.cssForm.value;
    this.clinicService.updateIframeCss(this.clinicReviewId, formData).then(
      () => {
        this.toastMessageService.success('CSS updated successfully.');
      },
      () => {
        this.toastMessageService.error('Unable to save the css.');
      }
    );
  }

  submitLandingPageCssForm() {
    if (this.cssForm.invalid) {
      return;
    }

    const formData = this.cssLandingPage.value;
    this.clinicService.updateLandingPageCss(this.clinicReviewId, formData).then(
      () => {
        this.toastMessageService.success('CSS updated successfully.');
      },
      () => {
        this.toastMessageService.error('Unable to save the css.');
      }
    );
  }
}
