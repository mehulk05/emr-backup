import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email-sms-quota',
  templateUrl: './email-sms-quota.component.html',
  styleUrls: ['./email-sms-quota.component.css']
})
export class EmailSmsQuotaComponent implements OnChanges {
  @Input() emailSmsQuotaResponse: any;
  @Input() totalEmail: any;
  @Input() totalSms: any;
  @Output() emitTriggerType = new EventEmitter<any>();
  progressColor = {
    low: '#15c875',
    medium: '#ffef07',
    moderate: '#efba19',
    high: '#dc3545'
  };
  constructor(private router: Router) {}

  getTriggerAudit(flag: any) {
    this.emitTriggerType.emit(flag);
  }

  ngOnChanges(): void {
    if (
      this.emailSmsQuotaResponse &&
      Object.keys(this.emailSmsQuotaResponse).length > 0
    ) {
      //calculatePercentage(email);

      const emailPercent =
        (this.emailSmsQuotaResponse?.emailCount /
          (this.totalEmail + this.emailSmsQuotaResponse?.emailCount)) *
        100;

      const smsPercennt =
        (this.emailSmsQuotaResponse.smsCount /
          (this.totalSms + this.emailSmsQuotaResponse.smsCount)) *
        100;

      const emailBgColor = this.getBgColor(emailPercent);
      const smsBgColor = this.getBgColor(smsPercennt);
      this.emailSmsQuotaResponse['emailBgColor'] = emailBgColor;
      this.emailSmsQuotaResponse['smsBgColor'] = smsBgColor;
      this.emailSmsQuotaResponse['smsPercent'] = smsPercennt;
      this.emailSmsQuotaResponse['emailPercent'] = emailPercent;
    }
  }

  getBgColor(count: any) {
    let color: any;
    if (count <= 24) {
      color = this.progressColor.low;
    } else if (count >= 25 && count < 50) {
      color = this.progressColor.medium;
    } else if (count >= 51 && count < 75) {
      color = this.progressColor.moderate;
    } else {
      color = this.progressColor.high;
    }
    return color;
  }

  showPacks() {
    this.router.navigate(['show-packs']);
  }
}
