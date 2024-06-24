import { Component, Input, OnInit } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { TriggersService } from '../../../services/triggers.service';

@Component({
  selector: 'app-completed-email-audit-list',
  templateUrl: './completed-email-audit-list.component.html',
  styleUrls: ['./completed-email-audit-list.component.css']
})
export class CompletedEmailAuditListComponent implements OnInit {
  @Input() triggerModule: any;
  @Input() rowData: any;
  @Input() triggerName: any;
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'leadId',
    'contentId',
    'templateName',
    'phoneNumber',
    'email',
    'date'
  ];
  /* columns = [
    { header: 'Lead ID', field: 'leadId' },
    { header: 'Email', field: 'email' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns; */
  columns: any[] = [];
  leadColumns = [
    { header: 'Lead ID', field: 'leadId' },
    { header: 'Email', field: 'email' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
    //{ header: 'Actions', field: 'actions' }
  ];
  appointmentColumns = [
    { header: 'Appointment ID', field: 'leadId' },
    { header: 'Patient ID', field: 'patientId' },
    { header: 'Email', field: 'email' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
    //{ header: 'Actions', field: 'actions' }
  ];
  allColumns = [
    { header: 'Lead/Patient ID', field: 'leadId' },
    { header: 'Email', field: 'email' },
    { header: 'Template Name', field: 'templateName' },
    { header: 'Body', field: 'contentId' },
    { header: 'Date', field: 'date' }
    //{ header: 'Actions', field: 'actions' }
  ];
  //_selectedColumns: any[] = this.columns;
  _selectedColumns: any[];
  showPreviewModal: boolean;
  body: any;
  constructor(
    private highLevelService: TriggersService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService
  ) {}
  ngOnInit(): void {
    if (
      this.triggerModule === LEAD ||
      this.triggerModule === MASS_LEAD ||
      this.triggerModule === LEADS ||
      this.triggerModule === NOT_APPLICABLE
    )
      this.columns = this.leadColumns;
    else if (
      this.triggerModule === APPOINTMENT ||
      this.triggerModule === MASS_PATIENT
    )
      this.columns = this.appointmentColumns;
    else if (this.triggerModule === ALL_MODULE) this.columns = this.allColumns;

    this._selectedColumns = this.columns;
  }

  getBody(id: any, label: string) {
    if (
      this.triggerModule === LEAD ||
      this.triggerModule === MASS_LEAD ||
      this.triggerModule === LEADS ||
      (this.triggerModule === ALL_MODULE && label === LEAD)
    ) {
      this.highLevelService.emailTemplate(id).then(
        (data: any) => {
          //
          this.body = data;
          if (this.body) {
            this.showPreviewModal = true;
          }
        },
        () => {
          this.toastService.error('Data Not Available');
        }
      );
    } else if (
      this.triggerModule === APPOINTMENT ||
      this.triggerModule === MASS_PATIENT ||
      (this.triggerModule === ALL_MODULE && label === APPOINTMENT)
    ) {
      this.highLevelService.getEmailSmsBody(id).then(
        (data: any) => {
          //
          this.body = data;
          if (this.body) this.showPreviewModal = true;
        },
        () => {
          this.toastService.error('Data Not Available');
        }
      );
    }
  }

  onCloseModal() {
    this.showPreviewModal = false;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}

const LEAD: string = 'Lead';
const LEADS: string = 'leads';
const APPOINTMENT: string = 'Appointment';
const MASS_LEAD: string = 'MassLead';
const MASS_PATIENT: string = 'MassPatient';
const ALL_MODULE: string = 'All';
const NOT_APPLICABLE: string = 'NA';
