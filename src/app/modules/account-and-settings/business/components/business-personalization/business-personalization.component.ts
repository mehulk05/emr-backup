import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonalizationService } from 'src/app/shared/services/personalization.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'app-business-personalization',
  templateUrl: './business-personalization.component.html',
  styleUrls: ['./business-personalization.component.css']
})
export class BusinessPersonalizationComponent implements OnInit {
  @Input() businessInfo: any;
  questionnaireForm!: FormGroup;
  index: any = null;
  focus = false;
  questionnaireId: any = null;
  questionnaire: any;
  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService,
    private personalizationService: PersonalizationService
  ) {}

  ngOnInit(): void {
    this.questionnaireForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      chatQuestionnaire: [false, []],
      isPublic: [false, []],
      showTitle: [false, []],
      buttonBackgroundColor: ['#003B6F', []],
      buttonForegroundColor: ['#fff', []],
      titleColor: ['#6b838e', []],

      appButtonBackgroundColor: ['#003B6F', []],
      appButtonForegroundColor: ['#fff', []],

      popupTitleColor: ['inherit', []],
      popupLabelColor: ['inherit', []],
      inputBoxShadowColor: ['#357ffa', []]
      //   activeSideColor: ['#003b6f', []],
    });

    this.personalizationService.getLeadCaptureFormId().then((response: any) => {
      this.questionnaireId = response.id;
      this.loadQuestionnaire();
    });
  }

  loadQuestionnaire() {
    this.personalizationService
      .getQuestionnaireOptimized(this.questionnaireId)
      .then(
        (response: any) => {
          localStorage.setItem('themeColors', JSON.stringify(response));
          this.questionnaireForm.patchValue({
            name: response.name ? response.name : 'lead-contact',
            chatQuestionnaire: response.chatQuestionnaire,
            isPublic: response.isPublic,
            showTitle: response.showTitle,
            buttonBackgroundColor: response.buttonBackgroundColor ?? '#003B6F',
            buttonForegroundColor: response.buttonForegroundColor ?? '#fff',
            titleColor: response.titleColor ?? '#000',

            appButtonBackgroundColor:
              response?.appButtonBackgroundColor ?? '#003B6F',
            appButtonForegroundColor:
              response?.appButtonForegroundColor ?? '#fff',

            popupTitleColor: response.popupTitleColor ?? '#000',
            popupLabelColor: response.popupLabelColor,
            inputBoxShadowColor: response.inputBoxShadowColor
            // activeSideColor: response.activeSideColor
          });

          this.questionnaire = response;
        },
        () => {
          // this.toastService.error('Unable to save the questionnaireForm.');
        }
      );
  }

  selectTheme(flag: any, bg: any, fg: any, title: any) {
    this.onBackgroundColorChange(flag, bg);
    this.onForegroundColorChange(flag, fg);
    this.ontitleColorChange(flag, title);
  }

  get qv() {
    return this.questionnaireForm.controls;
  }

  onBackgroundColorChange(flag: any, event: any) {
    if (flag == 'app-theme') {
      if (event.color) {
        this.questionnaireForm.patchValue({
          appButtonBackgroundColor: event.color.hex
        });
      } else {
        this.questionnaireForm.patchValue({
          appButtonBackgroundColor: event
        });
      }
    } else {
      if (event.color) {
        this.questionnaireForm.patchValue({
          buttonBackgroundColor: event.color.hex
        });
      } else {
        this.questionnaireForm.patchValue({
          buttonBackgroundColor: event
        });
      }
    }
  }

  onForegroundColorChange(flag: any, event: any) {
    if (flag == 'app-theme') {
      if (event.color) {
        this.questionnaireForm.patchValue({
          appButtonForegroundColor: event.color.hex
        });
        // this.questionnaireForm.setControl(this.themeFgColor, event.color.hex);
      } else {
        this.questionnaireForm.patchValue({
          appButtonForegroundColor: event
        });
      }
    } else {
      if (event.color) {
        this.questionnaireForm.patchValue({
          buttonForegroundColor: event.color.hex
        });
      } else {
        this.questionnaireForm.patchValue({
          buttonForegroundColor: event
        });
      }
    }
  }

  ontitleColorChange(flag: any, event: any) {
    if (flag == 'app-theme') {
    } else {
      if (event.color) {
        this.questionnaireForm.patchValue({
          titleColor: event.color.hex
        });
        // this.questionnaireForm.setControl(this.titleColor, event.color.hex);
      } else {
        this.questionnaireForm.patchValue({
          titleColor: event
        });
      }
    }
  }

  submitquestionnaireForm() {
    if (this.questionnaireForm.invalid) {
      return;
    }

    const formData = this.questionnaireForm.value;
    if (this.questionnaireId) {
      this.personalizationService
        .updateQuestionnairePersonalization(this.questionnaireId, formData)
        .then(
          () => {
            this.toastService.success('Updated successfully.');
            localStorage.removeItem('themeColors');
            // this.themeService.setDarkTheme(this.themeFgColor,this.themeBgColor,this.buttonBackgroundColor,this.buttonForegroundColor)
            // this.loadQuestionnaire()
          },
          () => {
            this.toastService.error('Unable to update.');
          }
        );
    } else {
      this.personalizationService.createQuestionnaire(formData).then(
        () => {
          this.toastService.success('Saved successfully.');
          //this.router.navigate(['/clinical-doc/questionnaire/' + response.id + '/edit']);
        },
        () => {
          this.toastService.error('Unable to save.');
        }
      );
    }
  }

  restoreDefaultPersonalization() {
    this.questionnaireForm.patchValue({
      // backgroundColor: event.color.hex,
      buttonBackgroundColor: '#003B6F',
      buttonForegroundColor: '#fff',
      titleColor: ''
    });
    this.submitquestionnaireForm();
  }

  restoreAppThemePersonalization() {
    this.questionnaireForm.patchValue({
      appButtonBackgroundColor: '#003B6F',
      appButtonForegroundColor: '#fff'
    });
  }

  focusFunction(index: any) {
    this.index = index;
    this.focus = true;
  }
}
