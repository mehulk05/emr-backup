import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { TriggerExcelService } from 'src/app/modules/import-export-center/trigger-excel.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-appointment-triggers-list',
  templateUrl: './appointment-triggers-list.component.html',
  styleUrls: ['./appointment-triggers-list.component.css']
})
export class AppointmentTriggersListComponent {
  allUncheck: boolean = false;
  selectTriggerIds: any = [];
  @Output() emitTriggerEvent = new EventEmitter<any>();
  rowData: any[];
  @Input() set triggers(val: any[]) {
    this.rowData = val;
  }
  @Input() triggerName = 'Appointment';
  showModal: boolean = false;
  modalData: any;
  modalMessage: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'moduleName',
    'triggerActionName',
    'triggerConditions',
    'status',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: '', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Trigger Name', field: 'name' },
    { header: 'Source', field: 'triggerActionName' },
    { header: 'Module', field: 'moduleName' },
    { header: 'Status', field: 'status' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  statuses = [
    {
      label: 'Active',
      value: 'ACTIVE'
    },
    {
      label: 'Inactive',
      value: 'INACTIVE'
    }
  ];
  constructor(
    public formatTimeService: FormatTimeService,
    public triggerExcelService: TriggerExcelService,
    public fileSaverService: FileSaverService,
    private toastMessageService: ToasTMessageService
  ) {}

  createTrigger() {
    this.emitTriggerEvent.emit({ eventType: 'CREATE' });
  }

  onCheckBoxChange(e: any, data: any) {
    this.emitTriggerEvent.emit({ eventType: 'TOGGLE', data: data, event: e });
  }

  editTemplate(id: any) {
    this.emitTriggerEvent.emit({ eventType: 'EDIT', data: id });
  }

  deleteTemplateModal(data: any) {
    this.emitTriggerEvent.emit({ eventType: 'DELETE', data: data });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  openExportFile() {
    this.downloadFile();
  }

  downloadFile() {
    const data = { triggerId: this.selectTriggerIds, type: this.triggerName };
    this.triggerExcelService
      .downloadTriggerExcel(data)
      .then((data: any) => {
        this.fileSaverService.save(data, 'trigger.xlsx');
      })
      .catch(() => {
        this.toastMessageService.error('Unable to download trigger xlsx.');
      });
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

  shoAuditTrigger(id: any) {
    this.emitTriggerEvent.emit({ eventType: 'SHOW_AUDIT', data: id });
  }
}
