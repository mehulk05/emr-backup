import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MassEmailSmsService } from '../../services/mass-email-sms.service';
import { SmsService } from '../../services/sms.service';

@Component({
  selector: 'app-mass-email-sms-tab',
  templateUrl: './mass-email-sms-tab.component.html',
  styleUrls: ['./mass-email-sms-tab.component.css']
})
export class MassEmailSmsTabComponent implements OnInit {
  selectedIndex: any;
  sources = ['mass-email', 'mass-sms'];
  source: any = 'mass-email';
  isDataLoaded: boolean = true;
  massEmailTemplate: any = [];
  massSmsTemplate: any = [];
  rowData: any;
  emailLimit: number = 0;
  smsLimit: number = 0;
  availableEmailQuota: number = 0;
  availableSmsQuota: number = 0;
  totalLeadsEmailCount: number = 0;
  totalLeadsSmsCount: number = 0;
  totalPatientsEmailCount: number = 0;
  totalPatientsSmsCount: number = 0;
  moduleNames: any = {
    Lead: 'MassLead',
    Patient: 'MassPatient',
    Both: 'All'
  };
  reloadTable = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private massEmailSms: MassEmailSmsService,
    private toastMessageService: ToasTMessageService,
    private smsService: SmsService
  ) {}

  ngOnInit(): void {
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
    }
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data?.source ?? 'mass-email';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
    this.getEmailSmsQuota();
    this.loadLeadPatientCount();
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['triggers/broadcast'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }

  onEventFromTable(e: any) {
    if (e.eventType === 'AUDIT') {
      this.viewCompletedTriggerAudit(e.data);
    } else if (e.eventType === 'EDIT') {
      this.editTemplate(e.data);
    } else if (e.eventType === 'CREATE') {
      this.createSmsTemplate(e.moduleName);
    } else if (e.eventType === 'DELETE') {
      this.deleteTemplate(e.data);
    } else if (e.eventType === 'TOGGLE_TRIGGER_STATUS') {
      this.onCheckBoxChange(e.data);
    } else if (e.eventType === 'BULK_DELETE') {
      this.deleteTemplates(e.data);
    }
  }

  createSmsTemplate(moduleName?: string) {
    // this.router.navigateByUrl('/triggers/broadcast/create');
    this.router.navigate(['/triggers/broadcast/create'], {
      queryParams: {
        source: this.source,
        moduleName: this.moduleNames[moduleName]
      },
      queryParamsHandling: 'merge'
    });
  }

  editTemplate(id: any) {
    this.router.navigateByUrl('/triggers/broadcast/' + id + '/edit');
  }

  viewCompletedTriggerAudit(id: any) {
    this.router.navigateByUrl('/triggers/broadcast/' + id + '/audit');
  }

  deleteTemplate(id: any) {
    this.reloadTable = false;
    this.massEmailSms
      .deleteTemplate(id)
      .then(() => {
        this.toastMessageService.success('Trigger Deleted Successfully');
        this.isDataLoaded = false;
        this.reloadTable = true;
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting template');
      });
  }

  deleteTemplates(ids: any) {
    this.reloadTable = false;
    this.massEmailSms
      .deleteTemplates(ids)
      .then(() => {
        this.toastMessageService.success('Triggers Deleted Successfully');
        this.isDataLoaded = false;
        this.reloadTable = true;
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting templates');
      });
  }

  onCheckBoxChange(data: any) {
    var status = '';
    if (data.status == 'ACTIVE') {
      status = 'INACTIVE';
    } else {
      status = 'ACTIVE';
    }
    this.reloadTable = false;
    this.massEmailSms.updateTriggerStatus(data.id, status).then(() => {
      var alertMessage = '';
      if (status == 'ACTIVE') {
        alertMessage = 'Trigger enabled successfully';
      } else {
        alertMessage = 'Trigger disabled successfully';
      }
      this.isDataLoaded = false;
      this.reloadTable = true;
      this.toastMessageService.success(alertMessage);
    });
  }

  getEmailSmsQuota() {
    // let smsSent;
    // let emailSent;
    // this.smsService.getEmailSmsQuota().then((response: any) => {
    //   this.emailLimit = response.emailLimit;
    //   this.smsLimit = response.smsLimit;
    //   this.smsService.getEmailSmsCount().then((response1: any) => {
    //     emailSent = response1.emailCount;
    //     smsSent = response1.smsCount;
    //     this.availableEmailQuota = this.emailLimit - emailSent;
    //     this.availableSmsQuota = this.smsLimit - smsSent;
    //   });
    // });

    this.smsService.getEmailSmsQuota().then((response: any) => {
      this.emailLimit = response.emailLimit;
      this.smsLimit = response.smsLimit;
      this.availableEmailQuota = this.emailLimit;
      this.availableSmsQuota = this.smsLimit;
    });
  }

  loadLeadPatientCount() {
    Promise.all([
      this.massEmailSms.getMassLeadsCount(['All'], 'All'),
      this.massEmailSms.getMassPatientsCount(['All'], 'All')
    ]).then((responses: any) => {
      this.totalLeadsEmailCount = responses[0].emailCount;
      this.totalLeadsSmsCount = responses[0].smsCount;

      this.totalPatientsEmailCount = responses[1].emailCount;
      this.totalPatientsSmsCount = responses[1].smsCount;
    });
  }

  refreshEvent(e: any) {
    if (e && e.type) {
      if (e.type === 'Lead') {
        this.massEmailSms
          .getMassLeadsCount(['All'], 'All')
          .then((response: any) => {
            this.totalLeadsEmailCount = response.emailCount;
            this.totalLeadsSmsCount = response.smsCount;
          });
      } else if (e.type === 'Patient') {
        this.massEmailSms
          .getMassPatientsCount(['All'], 'All')
          .then((response: any) => {
            this.totalPatientsEmailCount = response.emailCount;
            this.totalPatientsSmsCount = response.smsCount;
          });
      } else if (e.type === 'Both') {
        this.loadLeadPatientCount();
      }
    }
  }
}
