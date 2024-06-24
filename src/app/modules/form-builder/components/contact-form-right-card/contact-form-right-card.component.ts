import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { QuestionarieService } from '../../services/questionarie.service';

@Component({
  selector: 'app-contact-form-right-card',
  templateUrl: './contact-form-right-card.component.html',
  styleUrls: ['./contact-form-right-card.component.css']
})
export class ContactFormRightCardComponent implements OnInit, OnChanges {
  @Input() iframeUrl: any;
  @Input() questionnaire: any;
  @Input() questionnaireId: any;
  @Input() publicQuestionnaireUrl: any;
  @Input() cssFormResponse: any;
  @Input() modernUiIframeUrl: any;
  @Input() modernUiUrl: any;
  cssForm!: FormGroup;
  trackingCodeForm!: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private questionnaireService: QuestionarieService,
    private alertService: ToasTMessageService
  ) {}
  ngOnChanges(): void {
    if (this.cssFormResponse) {
      this.cssForm.patchValue({
        css: this.cssFormResponse
      });
    }

    if (this.questionnaire) {
      this.trackingCodeForm.patchValue({
        trackCode: this.questionnaire.trackCode,
        googleAnalyticsGlobalCode: this.questionnaire.googleAnalyticsGlobalCode,
        googleAnalyticsGlobalCodeUrl:
          this.questionnaire.googleAnalyticsGlobalCodeUrl
      });
    }
  }

  ngOnInit(): void {
    this.cssForm = this.formBuilder.group({
      css: ['']
    });

    this.trackingCodeForm = this.formBuilder.group({
      trackCode: [''],
      googleAnalyticsGlobalCode: [''],
      googleAnalyticsGlobalCodeUrl: ['']
    });
  }

  submitCssForm() {
    if (this.cssForm.invalid) {
      return;
    }

    const formData = this.cssForm.value;
    this.questionnaireService.updateCss(this.questionnaireId, formData).then(
      () => {
        this.alertService.success('CSS updated successfully.');
      },
      () => {
        this.alertService.error('Unable to save the css.');
      }
    );
  }

  submitTrackingCodeForm() {
    if (this.trackingCodeForm.invalid) {
      return;
    }

    const formData = this.trackingCodeForm.value;
    this.questionnaireService
      .updateTrackingCode(this.questionnaireId, formData)
      .then(
        () => {
          this.alertService.success('Tracking code updated successfully.');
        },
        () => {
          this.alertService.error('Unable to save the tracking code.');
        }
      );
  }

  preview() {
    window.open(this.publicQuestionnaireUrl, '_blank');
  }
}
