import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { TriggersService } from '../../../services/triggers.service';

@Component({
  selector: 'app-triggers-tab',
  templateUrl: './triggers-tab.component.html',
  styleUrls: ['./triggers-tab.component.css']
})
export class TriggersTabComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  modalMessage: any;
  isDataLoaded: boolean = false;
  triggers: any = [];
  appointmentTriggers: any = [];
  leadTriggers: any = [];
  reviewFormsTriggers: any = [];
  patientTriggers: any = [];
  selectedIndex: any;
  sources = ['leads', 'patient', 'appointment', 'forms'];
  source: any = 'leads';
  showSideBar: boolean = false;
  auditTriggerId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private triggerService: TriggersService,
    private toastMessageService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.source = this.activatedRoute.snapshot.queryParams?.source ?? 'leads';
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
    }
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source ?? 'leads';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });

    this.loadTemplatList();
  }

  loadTemplatList() {
    this.isDataLoaded = false;
    this.appointmentTriggers = [];
    this.leadTriggers = [];
    this.reviewFormsTriggers = [];
    this.patientTriggers = [];
    this.triggerService.getTriggerList().then(
      (data: any) => {
        this.triggers = data;
        this.triggers.forEach((value: any) => {
          if (value.triggerActionName === '') {
            value.triggerActionName = value.triggerConditions;
          }
          if (value.moduleName === triggerForEnum.APPOINTMENT) {
            this.appointmentTriggers.push(value);
          } else if (value.moduleName === triggerForEnum.REVIEW_FORM) {
            this.reviewFormsTriggers.push(value);
          } else if (value.moduleName === triggerForEnum.PATIENT) {
            this.patientTriggers.push(value);
          } else {
            this.leadTriggers.push(value);
          }
        });
        this.isDataLoaded = true;
      },
      () => {
        this.isDataLoaded = true;
        this.toastMessageService.error('Unable to load email template.');
      }
    );
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['triggers'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }

  OnTriggerEvent(e: any) {
    console.log(e);
    if (e.eventType === 'DELETE') {
      this.deleteTemplateModal(e.data);
    } else if (e.eventType === 'CREATE') {
      this.createTrigger();
    } else if (e.eventType === 'EDIT') {
      this.editTemplate(e.data);
    } else if (e.eventType === 'TOGGLE') {
      this.onCheckBoxChange(e.event, e.data);
    } else if (e.eventType === 'SHOW_AUDIT') {
      this.auditTriggerId = e.data;
      this.showSideBar = true;
    }
  }

  createTrigger() {
    this.router.navigate(['/triggers/create'], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge'
    });
  }

  editTemplate(id: any) {
    this.router.navigate(['triggers', id], {
      queryParams: {
        source: this.source
      },
      queryParamsHandling: 'merge'
    });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalMessage =
      'If you delete an active trigger all your work will be deleted. Also, any active leads on this trigger will not get any communication from here on.';
    this.modalData.titleName = 'Trigger';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.triggerService
      .deleteTemplate(id)
      .then(() => {
        this.toastMessageService.success('Trigger deleted successfully');
        this.loadTemplatList();
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting template');
      });
  }

  onCheckBoxChange(e: any, data: any) {
    var status = '';
    if (data.status == 'ACTIVE') {
      status = 'INACTIVE';
    } else {
      status = 'ACTIVE';
    }

    this.triggerService.updateTriggerStatus(data.id, status).then(() => {
      var alertMessage = '';
      if (status == 'ACTIVE') {
        alertMessage = 'Trigger enabled successfully';
      } else {
        alertMessage = 'Trigger disabled successfully';
      }
      this.loadTemplatList();
      this.toastMessageService.success(alertMessage);
    });
  }
}

export enum triggerForEnum {
  APPOINTMENT = 'Appointment',
  LEADS = 'leads',
  REVIEW_FORM = 'forms',
  PATIENT = 'patient'
}
