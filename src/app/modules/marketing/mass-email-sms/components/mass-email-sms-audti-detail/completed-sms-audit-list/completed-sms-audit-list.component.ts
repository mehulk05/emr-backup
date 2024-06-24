import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { TriggersService } from '../../../services/triggers.service';
import { DoghnutChat } from 'src/app/shared/models/charts';
import { SmsService } from '../../../services/sms.service';

@Component({
  selector: 'app-completed-sms-audit-list',
  templateUrl: './completed-sms-audit-list.component.html',
  styleUrls: ['./completed-sms-audit-list.component.css']
})
export class CompletedSmsAuditListComponent implements OnInit, OnChanges {
  @Input() triggerModule: any;
  @Input() triggerName: any;
  @Input() rowData: any[];
  @Input() scheduledDateTime: any;
  @Output() refreshListCallback: EventEmitter<any> = new EventEmitter<any>();
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'leadId',
    'phoneNumber',
    'email',
    'deliverStatus',
    'deliverDate',
    'patientId'
  ];
  statuses = [
    {
      label: 'Delivered',
      value: 'delivered'
    },
    {
      label: 'Undelivered',
      value: 'undelivered'
    },
    {
      label: 'Queued',
      value: 'queued'
    },
    {
      label: 'Failed',
      value: 'failed'
    }
  ];
  columns: any[] = [];
  leadColumns = [
    { header: 'Lead ID', field: 'leadId' },
    { header: 'Recipient Number', field: 'phoneNumber' },
    { header: 'Status', field: 'deliverStatus' },
    { header: 'Delivery Time', field: 'deliverDate' },
    { header: 'Actions', field: 'actions' }
  ];
  appointmentColumns = [
    { header: 'Appointment ID', field: 'leadId' },
    { header: 'Patient ID', field: 'patientId' },
    { header: 'Recipient Number', field: 'phoneNumber' },
    { header: 'Status', field: 'deliverStatus' },
    { header: 'Delivery Time', field: 'deliverDate' },
    { header: 'Actions', field: 'actions' }
  ];
  allColumns = [
    { header: 'Lead/Patient ID', field: 'leadId' },
    { header: 'Recipient Number', field: 'phoneNumber' },
    { header: 'Status', field: 'deliverStatus' },
    { header: 'Delivery Time', field: 'deliverDate' },
    { header: 'Actions', field: 'actions' }
  ];
  //_selectedColumns: any[] = this.columns;
  _selectedColumns: any[];
  showPreviewModal: boolean;
  body: any;
  SMSStatusPieChart: DoghnutChat = new DoghnutChat();
  statusColors: any = {
    queued: '#ff7d01',
    undelivered: '#c51900',
    delivered: '#01b700',
    failed: '#fe0000'
  };
  templateName: any;
  templateContent: any;
  segments: any;
  totalCount: number = 0;
  deliveredCount: number = 0;
  undeliveredCount: number = 0;
  queuedCount: number = 0;
  failedCount: number = 0;
  constructor(
    private highLevelService: TriggersService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService,
    private smsService: SmsService
  ) {}
  ngOnInit(): void {
    if (
      this.triggerModule === LEAD ||
      this.triggerModule === MASS_LEAD ||
      this.triggerModule === LEADS ||
      this.triggerModule === NOT_APPLICABLE
    ) {
      this.columns = this.leadColumns;
    } else if (
      this.triggerModule === APPOINTMENT ||
      this.triggerModule === MASS_PATIENT
    ) {
      this.columns = this.appointmentColumns;
    } else if (this.triggerModule === ALL_MODULE)
      this.columns = this.allColumns;

    this._selectedColumns = this.columns;
  }

  ngOnChanges(): void {
    if (this.rowData && this.rowData.length > 0) {
      let pieChartPercentageVal: any = [];
      this.SMSStatusPieChart.pieChartColors[0].backgroundColor = [];
      this.templateName = this.rowData[0].templateName;
      this.templateContent = this.rowData[0].content;
      this.segments = this.rowData[0].smsSegments;

      this.totalCount = this.rowData.length;
      let deliveredCount = 0;
      let unDeliveredCount = 0;
      let queuedCount = 0;
      let failedCount = 0;
      this.rowData.forEach((data: any) => {
        if (data.deliverStatus?.toLowerCase() === 'delivered') {
          deliveredCount++;
        } else if (data.deliverStatus?.toLowerCase() === 'undelivered') {
          unDeliveredCount++;
        } else if (
          data.deliverStatus?.toLowerCase() === 'queued' ||
          data.deliverStatus === 'sent'
        ) {
          data.deliverStatus = 'queued';
          queuedCount++;
        } else if (data.deliverStatus?.toLowerCase() === 'failed') {
          data.deliverStatus = 'failed';
          failedCount++;
        }
      });
      this.deliveredCount = deliveredCount;
      this.undeliveredCount = unDeliveredCount;
      this.queuedCount = queuedCount;
      this.failedCount = failedCount;
      this.SMSStatusPieChart.pieChartData = [
        this.deliveredCount,
        this.undeliveredCount,
        this.queuedCount,
        this.failedCount
      ];
      pieChartPercentageVal = [
        ((this.deliveredCount / this.totalCount) * 100).toFixed(2),
        ((this.undeliveredCount / this.totalCount) * 100).toFixed(2),
        ((this.queuedCount / this.totalCount) * 100).toFixed(2),
        ((this.failedCount / this.totalCount) * 100).toFixed(2)
      ];
      this.SMSStatusPieChart.pieChartPercentageVal = pieChartPercentageVal;
      this.SMSStatusPieChart.pieChartColors[0].backgroundColor = [
        this.statusColors['delivered'],
        this.statusColors['undelivered'],
        this.statusColors['queued'],
        this.statusColors['failed']
      ];
      this.SMSStatusPieChart.pieChartLabels = [
        'Delivered',
        'Undelivered',
        'Queued',
        'Failed'
      ];
    }
  }

  retryMessage(id: any, label: string) {
    const moduleName = label === 'Lead' ? 'LEADS' : 'PATIENT';
    this.smsService.retryFailedMessage(id, moduleName).then(
      () => {
        this.toastService.success('Message resent successfully');
        this.refreshListCallback.emit(true);
      },
      (err: any) => {
        const errorMessage =
          err.error?.errorMessage ?? 'Error while resending sms';
        this.toastService.error(errorMessage);
      }
    );
  }

  getBody(id: any, label: string) {
    if (
      this.triggerModule === LEAD ||
      this.triggerModule === MASS_LEAD ||
      this.triggerModule === LEADS ||
      this.triggerModule === NOT_APPLICABLE ||
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

  showErrorReason(data: any) {
    this.body = data;
    if (this.body) {
      this.showPreviewModal = true;
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
const APPOINTMENT: string = 'Appointment';
const MASS_LEAD: string = 'MassLead';
const MASS_PATIENT: string = 'MassPatient';
const NOT_APPLICABLE: string = 'NA';
const LEADS: string = 'leads';
const ALL_MODULE: string = 'All';
