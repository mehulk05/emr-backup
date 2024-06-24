import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { EmailUnsubscribeService } from '../../services/email-unsubscribe.service';

@Component({
  selector: 'app-email-unsubscribe',
  templateUrl: './email-unsubscribe.component.html',
  styleUrls: ['./email-unsubscribe.component.css']
})
export class EmailUnsubscribeComponent implements OnInit {
  email: any = '';
  submitted: boolean = false;
  failed: boolean = false;
  tenantId: any;
  userType: string;
  constructor(
    private toastService: ToasTMessageService,
    private emailUnsubscribeService: EmailUnsubscribeService,
    private activatedRoute: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service
  ) {}
  ngOnInit(): void {
    this.tenantId = this.activatedRoute.snapshot.params.tenantId;
    this.userType = this.activatedRoute.snapshot.params.userType;
    console.log(this.tenantId + '-' + this.userType);
  }

  onSubmit(): void {
    //console.log(emailForm.form.value.email);
    console.log(this.email);
    //const email = emailForm.form.value.email;
    if (this.email && this.tenantId && this.userType) {
      this.recaptchaV3Service.execute('importantAction').subscribe(() => {
        //console.log(`Token [${token}] generated`);
        this.emailUnsubscribeService
          .unsubscribeEmail(this.email, this.tenantId, this.userType)
          .then(
            (response: any) => {
              if (response == 'SUCCESS') this.submitted = true;
              else if (response == 'FAIL') this.failed = true;
              //this.toastService.success('Email Unsubscribed Successfully!');
            },
            () => {
              this.toastService.error('Unable to unsubscribe');
            }
          );
      });
    }
  }
}
