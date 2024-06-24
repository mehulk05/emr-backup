import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { TriggerExcelService } from 'src/app/modules/import-export-center/trigger-excel.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MassEmailSmsService } from '../../services/mass-email-sms.service';
import { Paginator } from 'primeng/paginator';
@Component({
  selector: 'app-mass-email-sms-list',
  templateUrl: './mass-email-sms-list.component.html',
  styleUrls: ['./mass-email-sms-list.component.css']
})
export class MassEmailSmsListComponent implements OnChanges, OnInit {
  @ViewChild('fileDropRef') fileDropRef: ElementRef;
  @Output() emitTableEvent = new EventEmitter<any>();
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'moduleName',
    'executionStatus',
    'status',
    'createdAt'
  ];
  columns = [
    { header: 'Checkbox', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Module', field: 'moduleName' },
    { header: 'Status', field: 'executionStatus' },
    { header: 'Trigger Status', field: 'status' },
    { header: 'Scheduled Date', field: 'scheduledAt' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  @Input() rowData: any[] = [];
  @Input() type: any;
  @Input() limit: number = 0;
  @Input() availableLimit: number = 0;
  @Input() leadCount: number = 0;
  @Input() patientCount: number = 0;
  @Input() isEmail = true;
  @Input() set reloadTable(value: boolean) {
    if (value) {
      this.paginator.changePage(0);
    }
  }
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();
  quotaValue: number = 0;
  userId: any;
  readonly STATUS_SCHEDULED: string = 'SCHEDULED';
  readonly STATUS_COMPLETED: string = 'COMPLETED';
  readonly STATUS_INPROGRESS: string = 'INPROGRESS';
  readonly STATUS_FAILED: string = 'FAILED';
  isQuotaAvailable: boolean = true;
  selectTriggerIds: any = [];
  allUncheck: boolean = false;
  activeDropDownId: any;
  fileTypes: string[] = [
    '.xls',
    '.xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  selectedRows: any[] = [];
  isTwilioDisabled: Boolean = true;

  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 20, //rows,
    recordArray: [10, 20, 50, 100],
    currentRecordIndex: 1
  };

  @ViewChild('patientPaginator', { static: false }) paginator: Paginator;
  searchText = '';
  totalDataCount = 0;
  constructor(
    public formatTimeService: FormatTimeService,
    public triggerExcelService: TriggerExcelService,
    public fileSaverService: FileSaverService,
    private toastMessageService: ToasTMessageService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private massEmailSms: MassEmailSmsService
  ) {}
  ngOnInit(): void {
    this.loadTemplatList();
    // Call the method to periodically check for completed scheduled triggers
    setInterval(() => {
      this.checkAndUpdateScheduledTriggers();
    }, 60000); // Check every minute (adjust as needed)
  }

  // Method to check for completed scheduled triggers and update their status
  checkAndUpdateScheduledTriggers(): void {
    this.rowData.forEach((trigger) => {
      if (
        trigger.executionStatus === this.STATUS_SCHEDULED &&
        this.isScheduledTimeCompleted(trigger)
      ) {
        trigger.executionStatus = this.STATUS_COMPLETED;
      }
    });
  }

  ngOnChanges(): void {
    if (this.limit && this.availableLimit) {
      this.quotaValue = ((this.limit - this.availableLimit) * 100) / this.limit;
    }
    if (
      this.type === 'sms' &&
      !this.localStorageService.readStorage('hideTwoWayTextInfo')
    ) {
      this.isTwilioDisabled =
        this.localStorageService.readStorage('businessInfo')?.getTwilioNumber ??
        true;
    }
  }

  loadTemplatList() {
    this.massEmailSms
      .getBroadCastListFilter(
        this.searchText,
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord,
        this.isEmail
      )
      .then(
        (data: any) => {
          this.rowData = data?.elements;
          this.totalDataCount = data?.count;
        },
        () => {
          this.toastMessageService.error('Unable to load email template.');
        }
      );
  }

  createSmsTemplate(modulesName: string) {
    // this.router.navigateByUrl('/triggers/broadcast/create');
    this.emitTableEvent.emit({ eventType: 'CREATE', moduleName: modulesName });
  }

  editTemplate(id: any) {
    // this.router.navigateByUrl('/triggers/broadcast/' + id + '/edit');
    this.emitTableEvent.emit({ eventType: 'EDIT', data: id });
  }

  viewCompletedTriggerAudit(id: any) {
    // this.router.navigateByUrl('/triggers/broadcast/' + id + '/audit');
    this.emitTableEvent.emit({ eventType: 'AUDIT', data: id });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id,
      type: 'DELETE'
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Mass Email and SMS';
  }

  deleteTemplatesModal() {
    if (
      !this.selectedRows.every(
        (row) => row.executionStatus == this.STATUS_SCHEDULED
      )
    ) {
      this.toastMessageService.error(
        'Invalid Rows selected. Only Scheduled Triggers can be deleted.'
      );
      return;
    }
    const ids = this.selectedRows.map((row) => row.id);
    this.modalData = {
      feildName: `${ids.length} ${ids.length > 1 ? 'Rows' : 'Row'}`,
      titleName: 'Mass Email and SMS',
      type: 'BULK_DELETE',
      id: ids
    };
    this.showModal = true;
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.emitTableEvent.emit({
        eventType: this.modalData.type,
        data: this.modalData.id
      });
    }
    this.activeDropDownId = undefined;
  }

  // onCheckBoxChange(e: any, data: any) {
  //   this.emitTableEvent.emit({
  //     eventType: 'TOGGLE_TRIGGER_STATUS',
  //     data: data
  //   });
  // }
  onCheckBoxChange(e: any, data: any) {
    if (this.isScheduledTimeCompleted(data)) {
      // If scheduled time is completed, disable the toggle
      this.toastMessageService.error(
        'Scheduled time has already passed. Cannot change trigger status.'
      );
      return;
    }

    // Enable the toggle if scheduled time is not completed
    this.emitTableEvent.emit({
      eventType: 'TOGGLE_TRIGGER_STATUS',
      data: data
    });
  }

  isScheduledTimeCompleted(data: any): boolean {
    const scheduledDate = new Date(data.scheduledAt);
    const currentDate = new Date();
    return scheduledDate <= currentDate;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  getQuotaMessage(message: string) {
    if (message) this.isQuotaAvailable = false;
  }

  openExportFile() {
    this.downloadFile();
  }

  downloadFile() {
    const triggerType = 'MassLeadPatient';
    let data = {};
    if (this.selectedRows.length > 0) {
      const ids = this.selectedRows.map((row: any) => row.id);
      data = { triggerId: ids, type: 'Leads' };
    } else {
      data = { triggerId: [], type: triggerType };
    }
    this.triggerExcelService
      .downloadTriggerExcel(data)
      .then((data: any) => {
        this.fileSaverService.save(data, 'trigger.xlsx');
      })
      .catch(() => {
        this.toastMessageService.error('Unable to download trigger xlsx.');
      });
    this.selectedRows = [];
  }

  showPacks(): void {
    this.router.navigate(['show-packs']);
  }

  selectTrigger(id: any, event: any) {
    this.allUncheck = event.target.checked;
    if (event.target.checked) {
      this.selectTriggerIds.push(id);
    } else {
      this.selectTriggerIds = this.selectTriggerIds.filter(
        (item: any) => item !== id
      );
    }
  }

  refreshLeadPatient(moduleName: string) {
    this.refreshEvent.emit({
      type: moduleName
    });
  }

  toggleDropdown(id: any) {
    this.activeDropDownId = this.activeDropDownId != id ? id : undefined;
  }

  exportTrigger(id: any) {
    const data = { triggerId: [id], type: 'Leads' };
    this.triggerExcelService
      .downloadTriggerExcel(data)
      .then((data: any) => {
        this.fileSaverService.save(data, 'trigger.xlsx');
      })
      .catch(() => {
        this.toastMessageService.error('Unable to download trigger xlsx.');
      });
    this.activeDropDownId = undefined;
  }

  fileBrowseHandler(files: any) {
    const file = files?.files[0];
    if (!file) {
      return;
    }
    if (this.fileTypes.includes(file.type)) {
      this.uploadFile(file);
    } else {
      this.toastMessageService.error(
        'Invalid file. Only xls and xlsx file supported.'
      );
    }
  }

  uploadFile(file: any) {
    const currentUser = this.localStorageService.readStorage('currentUser');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', currentUser?.id);

    this.triggerExcelService.uploadFile(formData).then(
      () => {
        this.toastMessageService.success(
          'File upload under process and an Email will be sent once it is completed'
        );
        this.fileDropRef.nativeElement.value = '';
      },
      () => {
        this.toastMessageService.error('Unable to upload file.');
      }
    );
  }

  unselectTriggers() {
    this.selectedRows = [];
  }

  forwardToTwoWayText() {
    this.router.navigate(['two-way-text', 'subscribe']);
  }

  dismissTwoWayText() {
    this.localStorageService.storeItem('hideTwoWayTextInfo', true);
    this.isTwilioDisabled = true;
  }

  paginatation(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentRecordIndex = event.first;
    this.loadTemplatList();
  }

  searchTemaplete() {
    if (this.paginator.getPage() != 0) {
      this.paginator.changePage(0);
    } else {
      this.loadTemplatList();
    }
  }
}
