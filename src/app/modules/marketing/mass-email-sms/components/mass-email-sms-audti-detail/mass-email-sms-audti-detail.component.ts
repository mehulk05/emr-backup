import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { TriggersService } from '../../services/triggers.service';

@Component({
  selector: 'app-mass-email-sms-audti-detail',
  templateUrl: './mass-email-sms-audti-detail.component.html',
  styleUrls: ['./mass-email-sms-audti-detail.component.css']
})
export class MassEmailSmsAudtiDetailComponent implements OnInit {
  triggerId: any;
  rowTriggerData: any = [];
  communicationType: string;

  static readonly SMS = 'SMS';
  static readonly EMAIL = 'EMAIL';
  triggerModule: any;
  triggerName: any;
  scheduledDateTime: any;
  triggerInfo: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private highLevelService: TriggersService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      this.triggerId = data.id;

      this.getTriggerData(this.triggerId);
    });
  }

  refreshListCallback(e: any) {
    if (e) {
      this.getTriggerAuditDetails(
        this.triggerInfo.id,
        this.triggerInfo.type,
        this.triggerInfo.moduleName
      );
    }
  }

  /* ------------------------- Get trigger data by id ------------------------- */
  getTriggerData(id: any) {
    this.highLevelService.getTriggerData(id).then((triggerObj: any) => {
      console.log(triggerObj);
      const triggerInfo: any = {};
      triggerInfo.id = triggerObj.id;
      triggerInfo.moduleName = triggerObj.moduleName;
      triggerInfo.type = triggerObj.triggerData[0].triggerType;
      this.triggerName = triggerObj?.name;
      this.scheduledDateTime = triggerObj.triggerData[0].scheduledDateTime;
      this.triggerInfo = triggerInfo;
      this.getTriggerAuditDetails(
        triggerInfo.id,
        triggerInfo.type,
        triggerInfo.moduleName
      );
    });
  }

  getTriggerAuditDetails(
    triggerId: number,
    triggerType: string,
    triggerModule: string
  ) {
    //console.log(triggerId);
    this.communicationType = triggerType;
    this.triggerId = triggerId;
    triggerType = 'MASS_' + triggerType;

    this.triggerModule = triggerModule;
    this.highLevelService
      .getMassTriggerAuditDetails(triggerId, triggerType, triggerModule)
      .then(
        (response: any) => {
          //console.log('triggerDetailsResponse', response);
          this.rowTriggerData = response;
          if (this.rowTriggerData && this.rowTriggerData.length) {
            this.rowTriggerData.forEach((e: any) => {
              //console.log(e);
              e.date = this.formatTimeService.formatTimeWithoutTimezone(e.date);
            });
          } else {
            this.toastService.error('Data Not Available');
          }
        },
        () => {
          this.toastService.error('Data Not Available');
        }
      );
  }

  get communicationSMS() {
    return MassEmailSmsAudtiDetailComponent.SMS;
  }

  get communicationEmail() {
    return MassEmailSmsAudtiDetailComponent.EMAIL;
  }
}
