import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionarieService } from '../../services/questionarie.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { Location } from '@angular/common';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-contact-form-notification-form',
  templateUrl: './contact-form-notification-form.component.html',
  styleUrls: ['./contact-form-notification-form.component.css']
})
export class ContactFormNotificationFormComponent implements OnInit {
  formId: any;
  questionnaireId: any;
  notificationTypeValue = ['EMAIL', 'SMS'];
  notificationForm: FormGroup;
  isEditNotification: boolean = false;
  selectedNotificationId: number;
  notificationId: any;
  submitted = false;
  notificationVal: any;
  notificationTypeVal = ['EMAIL', 'SMS'];
  setValue: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    private questionnaireService: QuestionarieService,
    public location: Location
  ) {}

  ngOnInit(): void {
    console.log('');

    this.questionnaireId = this.activatedRoute.snapshot.params.questionnaireId;
    this.notificationId = this.activatedRoute.snapshot.params.notificationId;
    if (this.notificationId) {
      this.isEditNotification = true;
    }
    this.setValue = true;
    this.initiliazeNotificationForm();
  }

  getNotificationType(event: any) {
    console.log('eve', event.target.value);
    this.notificationVal = event.target.value;
    this.initiliazeNotificationForm();
  }

  initiliazeNotificationForm() {
    this.isEditNotification = false;

    if (this.notificationVal === 'EMAIL') {
      this.notificationForm = this.formBuilder.group({
        notificationType: ['EMAIL', [Validators.required]],
        phoneNumber: [''],
        messageText: [''],
        toEmailAddress: [
          '',
          [Validators.required, Validators.pattern(RegexEnum.email)]
        ]
      });
    } else if (this.notificationVal === 'SMS') {
      this.notificationForm = this.formBuilder.group({
        notificationType: ['SMS', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        messageText: [''],
        toEmailAddress: ['']
      });
    } else {
      this.notificationForm = this.formBuilder.group({
        notificationType: ['', [Validators.required]],
        phoneNumber: [''],
        messageText: [''],
        toEmailAddress: ['']
      });
    }
    // this.notificationForm
    //   .get('notificationType')
    //   .valueChanges.subscribe((val) => {
    //     console.log(val);
    //     if (val == 'EMAIL') {
    //       //   this.notificationForm.controls['toEmailAddress'].setValidators([Validators.required]);
    //       this.notificationForm.controls['phoneNumber'].clearValidators();
    //     } else {
    //       console.log(val);
    //       this.notificationForm.controls['toEmailAddress'].clearValidators();
    //     }
    //     this.notificationForm.controls[
    //       'toEmailAddress'
    //     ].updateValueAndValidity();
    //     this.notificationForm.controls['phoneNumber'].updateValueAndValidity();
    //   });

    if (this.notificationId) {
      this.editNotification();
    }
  }

  get f() {
    return this.notificationForm.controls;
  }

  back = () => {
    this.location.back();
    // this.router.navigate([
    //   'clinical-doc/questionnaire/' +
    //     this.questionnaireId +
    //     '/edit?source=notification'
    // ]);
  };

  editNotification() {
    this.isEditNotification = true;
    console.log(this.notificationId);
    this.questionnaireService
      .getQuestionnaireNotificationOverId(
        this.questionnaireId,
        this.notificationId
      )
      .then(
        (response: any) => {
          console.log({ response });

          this.selectedNotificationId = this.notificationId;
          console.log('res', response);
          this.notificationVal = response.notificationType;
          if (this.setValue) {
            this.initiliazeNotificationForm();
            this.setValue = false;
          }
          // this.notificationForm = this.formBuilder.group({
          //   notificationType: response.notificationType,
          //   phoneNumber: response.phoneNumber,
          //   messageText: response.messageText,
          //   toEmailAddress: response.toEmail
          // });

          this.notificationForm.patchValue({
            notificationType: response.notificationType,
            phoneNumber: response.phoneNumber,
            messageText: response.messageText,
            toEmailAddress: response.toEmail
          });
        },
        (error) => {
          console.log({ error });
          this.alertService.error('Unable to Update the notification');
        }
      );
  }

  saveNotificationDetail() {
    console.log('this.notificationForm:', this.notificationForm.value);
    if (!this.notificationForm.valid) {
      return;
    }
    this.submitted = true;
    // formData.contactNumber = formData.contactNumber.replace(/\D/g, '');

    const body = {
      notificationType: this.notificationForm.value.notificationType,
      phoneNumber: this.notificationForm.value.phoneNumber.replace(/\D/g, ''),
      messageText: this.notificationForm.value.messageText,
      toEmail: this.notificationForm.value.toEmailAddress
    };

    this.questionnaireService
      .createQuestionnaireNotification(this.questionnaireId, body)
      .then(
        (response) => {
          console.log({ response });
          this.notificationForm.reset();
          this.alertService.success(
            'Questionnaire Notification saved successfully.'
          );
          this.location.back();
          // this.getAllNotifications();
          // this.router.navigate([
          //   'clinical-doc/questionnaire/' + this.questionnaireId + '/edit'
          // ]);
        },
        (error) => {
          console.log({ error });
          this.notificationForm.reset();
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
  }

  updateNotificationDetail() {
    // const emailTemp = {
    //     emailBody: this.notificationForm.value.emailBody,
    //     emailSubject: this.notificationForm.value.emailSubject
    // }
    if (!this.notificationForm.valid) {
      return;
    }
    if (this.notificationForm.value.notificationType === 'EMAIL') {
      if (this.notificationForm.value.toEmailAddress === null) {
        return;
      }
    }
    if (this.notificationForm.value.notificationType === 'SMS') {
      if (this.notificationForm.value.phoneNumber === null) {
        return;
      }
    }

    this.submitted = true;

    const body = {
      notificationType: this.notificationForm.value.notificationType,
      phoneNumber: this.notificationForm.value.phoneNumber,
      messageText: this.notificationForm.value.messageText,
      toEmail: this.notificationForm.value.toEmailAddress
      // emailTemplate: JSON.stringify(emailTemp)
    };

    console.log('this.notificationForm:', this.notificationForm.value);

    this.questionnaireService
      .updateQuestionnaireNotification(
        this.questionnaireId,
        this.selectedNotificationId,
        body
      )
      .then(
        (response) => {
          console.log({ response });
          this.notificationForm.reset();
          this.isEditNotification = false;
          this.alertService.success(
            'Questionnaire Notification saved successfully.'
          );
          // this.getAllNotifications();
          this.location.back();
          // this.router.navigate([
          //   'clinical-doc/questionnaire/' + this.questionnaireId + '/edit'
          // ]);
        },
        (error) => {
          console.log({ error });
          this.notificationForm.reset();
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
  }

  saveNotification(event: any) {
    console.log('eve', event);
    if (event) {
      this.updateNotificationDetail();
    } else {
      this.saveNotificationDetail();
    }
  }
}
