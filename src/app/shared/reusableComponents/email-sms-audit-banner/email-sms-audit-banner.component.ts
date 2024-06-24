import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';

@Component({
  selector: 'app-email-sms-audit-banner',
  templateUrl: './email-sms-audit-banner.component.html',
  styleUrls: ['./email-sms-audit-banner.component.css']
})
export class EmailSmsAuditBannerComponent implements OnInit {
  emailSmsAudit: any;
  subscription: any;
  @Input() layout: any = 1;
  message: any = null;
  @Output() quotaMessage = new EventEmitter<string>();
  readonly EMAIL_QUOTA_ERR_MSG =
    'Email limit for current month has been reached. To send Email please contact support@growth99.com';
  readonly SMS_QUOTA_ERR_MSG =
    'SMS limit for current month has been reached. To send SMS please contact support@growth99.com';
  readonly EMAIL_SMS_QUOTA_ERR_MSG =
    'Email and SMS limit for current month has been reached. To send Email and SMS please contact support@growth99.com';
  emailLimit: number = 0;
  smsLimit: number = 0;
  constructor(
    private authService: AuthService,
    private currentUserService: currentUserService
  ) {}

  ngOnInit(): void {
    this.currentUserService.headerSidebarExtraInfo
      .pipe(filter((results) => results !== null))
      .subscribe((results: any) => {
        const emailSmsAudit = {
          smsLimit: results?.quataInfo.smsLimit,
          emailLimit: results?.quataInfo.emailLimit,
          currentMonthSmsSent: results?.countInfo.smsCount,
          currentMonthEmailSent: results?.countInfo.emailCount
        };
        this.authService.emailSmsAudit.next(emailSmsAudit);
        if (0 >= emailSmsAudit?.emailLimit && 0 >= emailSmsAudit?.smsLimit) {
          this.message = this.EMAIL_SMS_QUOTA_ERR_MSG;
        } else if (0 >= emailSmsAudit?.emailLimit) {
          this.message = this.EMAIL_QUOTA_ERR_MSG;
        } else if (0 >= emailSmsAudit?.smsLimit) {
          this.message = this.SMS_QUOTA_ERR_MSG;
        } else {
          this.message = null;
        }
        this.sendMessageEvent();
      });
  }

  sendMessageEvent() {
    if (this.message === this.EMAIL_SMS_QUOTA_ERR_MSG)
      this.quotaMessage.emit(this.message);
  }
}
