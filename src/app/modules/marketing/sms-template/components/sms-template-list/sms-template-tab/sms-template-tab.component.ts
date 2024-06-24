import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { SmsService } from '../../../services/sms.service';

@Component({
  selector: 'app-sms-template-tab',
  templateUrl: './sms-template-tab.component.html',
  styleUrls: ['./sms-template-tab.component.css']
})
export class SmsTemplateTabComponent implements OnInit {
  selectedIndex: any;
  sources = ['leads', 'patient', 'appointment', 'massSMS'];
  source: any = 'appointment';

  leadTemplates: any = [];
  appontmentTemplates: any = [];
  massSMSTemplates: any = [];
  patientSMSTemplates: any = [];
  eventTemplates: any = [];
  isDataLoaded: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private smsService: SmsService,
    private toastMessageService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.source = this.activatedRoute.snapshot.queryParams?.source ?? 'leads';
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
    }
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source;
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
    this.loadSmsList();
  }

  loadSmsList() {
    this.smsService.getAllSmsListOptimized().then(
      (data: any) => {
        const rowData = data;
        this.appontmentTemplates = [];
        this.massSMSTemplates = [];
        this.leadTemplates = [];
        this.patientSMSTemplates = [];
        rowData.forEach((value: any) => {
          if (value.templateFor === templatForeEnum.APPOINTMENT) {
            this.appontmentTemplates.push(value);
          } else if (value.templateFor === templatForeEnum.MASSSMS) {
            this.massSMSTemplates.push(value);
          } else if (value.templateFor === templatForeEnum.PATIENT) {
            this.patientSMSTemplates.push(value);
          } else {
            this.leadTemplates.push(value);
          }
        });
        this.appontmentTemplates = this.filterArrayByDisabled(
          this.appontmentTemplates
        );
        this.massSMSTemplates = this.filterArrayByDisabled(
          this.massSMSTemplates
        );
        this.leadTemplates = this.filterArrayByDisabled(this.leadTemplates);
        this.patientSMSTemplates = this.filterArrayByDisabled(
          this.patientSMSTemplates
        );
        this.isDataLoaded = true;
      },
      () => {
        this.toastMessageService.error('Unable to load email template.');
      }
    );
  }

  filterArrayByDisabled(data: any[]) {
    const filterDataDisabled: any[] = data.filter((it: any) => it.disabled);
    const filterDataActive: any[] = data
      .filter((it: any) => !it.disabled)
      .sort((a, b) => b.id - a.id);
    return [...filterDataActive, ...filterDataDisabled];
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['smstemplate'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }

  createeSmsTemplate() {
    this.router.navigate(['/smstemplate/create'], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge'
    });
  }

  editTemplate(id: any) {
    this.router.navigate(['smstemplate', id, 'edit'], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge'
    });
  }

  deActivateSmsTemplate(id: any) {
    this.smsService.deactivateSmsTemplate(id).then(
      () => {
        this.toastMessageService.success('Template DeActivated successfully.');
        this.leadTemplates = [];
        this.patientSMSTemplates = [];
        this.appontmentTemplates = [];
        this.eventTemplates = [];
        this.loadSmsList();
      },
      (error: any) => {
        if (error?.message) {
          this.toastMessageService.error(error?.error?.message);
          return;
        }
        this.toastMessageService.error('Unable to DeActivated email template.');
      }
    );
  }

  activateSmsTemplate(id: any) {
    this.smsService.activateSmsTemplate(id).then(
      () => {
        this.toastMessageService.success('Template Activated successfully.');
        this.leadTemplates = [];
        this.patientSMSTemplates = [];
        this.appontmentTemplates = [];
        this.eventTemplates = [];
        this.loadSmsList();
      },
      (error: any) => {
        if (error?.message) {
          this.toastMessageService.error(error?.error?.message);
          return;
        }
        this.toastMessageService.error('Unable to Activated email template.');
      }
    );
  }

  cloneSMSTemplate(id: any) {
    this.smsService.cloneSMSTemplate(id).then(
      () => {
        this.toastMessageService.success('Template cloned successfully.');
        this.isDataLoaded = false;
        this.leadTemplates = [];
        this.patientSMSTemplates = [];
        this.appontmentTemplates = [];
        this.loadSmsList();
      },
      () => {
        this.toastMessageService.error('Unable to clone email template.');
      }
    );
  }

  onEventFromTable(e: any) {
    if (e.eventType === 'DELETE') {
      //this.deleteTemplateModal(e.data);
    } else if (e.eventType === 'CREATE') {
      this.createeSmsTemplate();
    } else if (e.eventType === 'EDIT') {
      this.editTemplate(e.data);
    } else if (e.eventType === 'CLONE') {
      this.cloneSMSTemplate(e.data);
    } else if (e.eventType === 'DEACTIVATE') {
      this.deActivateSmsTemplate(e.data);
    } else if (e.eventType === 'ACTIVATE') {
      this.activateSmsTemplate(e.data);
    }
  }
}

export enum templatForeEnum {
  APPOINTMENT = 'Appointment',
  LEADS = 'Lead',
  EVENT = 'Event',
  MASSSMS = 'MassSMS',
  PATIENT = 'Patient'
}
