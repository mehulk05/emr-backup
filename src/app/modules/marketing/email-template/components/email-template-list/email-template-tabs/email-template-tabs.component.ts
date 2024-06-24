import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { EmailTemplateService } from '../../../services/email-template.service';

@Component({
  selector: 'app-email-template-tabs',
  templateUrl: './email-template-tabs.component.html',
  styleUrls: ['./email-template-tabs.component.css']
})
export class EmailTemplateTabsComponent implements OnInit {
  selectedIndex: any;
  sources = ['leads', 'patient', 'appointment', 'event', 'massemail'];
  source: any = 'leads';

  leadTemplates: any = [];
  appontmentTemplates: any = [];
  eventTemplates: any = [];
  massEmailTemplates: any = [];
  patientTemplates: any = [];
  isDataLoaded: boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private emailService: EmailTemplateService,
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

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['emailtemplates'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }

  loadSmsList() {
    this.isDataLoaded = false;
    this.emailService.getAllEmailListOptimized().then(
      (data: any) => {
        this.appontmentTemplates = [];
        this.eventTemplates = [];
        this.massEmailTemplates = [];
        this.leadTemplates = [];

        const rowData = data;
        rowData.forEach((value: any) => {
          if (value.templateFor === templatForeEnum.APPOINTMENT) {
            this.appontmentTemplates.push(value);
          } else if (value.templateFor === templatForeEnum.EVENT) {
            this.eventTemplates.push(value);
          } else if (value.templateFor === templatForeEnum.MASSEMAIL) {
            this.massEmailTemplates.push(value);
          } else if (value.templateFor === templatForeEnum.PATIENT) {
            this.patientTemplates.push(value);
          } else {
            this.leadTemplates.push(value);
          }
        });
        this.appontmentTemplates = this.filterArrayByDisabled(
          this.appontmentTemplates
        );
        this.patientTemplates = this.filterArrayByDisabled(
          this.patientTemplates
        );
        this.eventTemplates = this.filterArrayByDisabled(this.eventTemplates);
        this.massEmailTemplates = this.filterArrayByDisabled(
          this.massEmailTemplates
        );
        this.leadTemplates = this.filterArrayByDisabled(this.leadTemplates);
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

  createeSmsTemplate() {
    this.router.navigate(['/emailtemplates/create'], {
      queryParams: {
        source: this.sources[this.selectedIndex]
      },
      queryParamsHandling: 'merge'
    });
  }

  editTemplate(id: any) {
    this.router.navigate(['emailtemplates', id, 'edit'], {
      queryParams: {
        source: this.sources[this.selectedIndex]
      },
      queryParamsHandling: 'merge'
    });
  }

  cloneEmailTemplate(id: any) {
    this.emailService.cloneEmailTemplate(id).then(
      () => {
        this.toastMessageService.success('Template cloned successfully.');
        this.leadTemplates = [];
        this.patientTemplates = [];
        this.appontmentTemplates = [];
        this.eventTemplates = [];
        this.loadSmsList();
      },
      () => {
        this.toastMessageService.error('Unable to clone email template.');
      }
    );
  }

  deActivateEmailTemplate(id: any) {
    this.emailService.deactivateEmailTemplate(id).then(
      () => {
        this.toastMessageService.success('Template DeActivated successfully.');
        this.leadTemplates = [];
        this.patientTemplates = [];
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

  activateEmailTemplate(id: any) {
    this.emailService.activateEmailTemplate(id).then(
      () => {
        this.toastMessageService.success('Template Activated successfully.');
        this.leadTemplates = [];
        this.patientTemplates = [];
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

  onEventFromTable(e: any) {
    if (e.eventType === 'DELETE') {
      //this.deleteTemplateModal(e.data);
    } else if (e.eventType === 'CREATE') {
      this.createeSmsTemplate();
    } else if (e.eventType === 'EDIT') {
      this.editTemplate(e.data);
    } else if (e.eventType === 'CLONE') {
      this.cloneEmailTemplate(e.data);
    } else if (e.eventType === 'DEACTIVATE') {
      this.deActivateEmailTemplate(e.data);
    } else if (e.eventType === 'ACTIVATE') {
      this.activateEmailTemplate(e.data);
    }
  }
}

export enum templatForeEnum {
  APPOINTMENT = 'Appointment',
  LEADS = 'Lead',
  EVENT = 'Event',
  MASSEMAIL = 'MassEmail',
  PATIENT = 'Patient'
}
