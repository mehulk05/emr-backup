import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { TriggerExcelService } from 'src/app/modules/import-export-center/trigger-excel.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-leads-triggers-list',
  templateUrl: './leads-triggers-list.component.html',
  styleUrls: ['./leads-triggers-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeadsTriggersListComponent implements OnInit {
  @Output() emitTriggerEvent = new EventEmitter<any>();
  allUncheck: boolean = false;
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
  userId: any;
  rowData: any[];
  selectTriggerIds: any = [];
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
    private cdr: ChangeDetectorRef,
    public triggerExcelService: TriggerExcelService,
    public fileSaverService: FileSaverService,
    private toastMessageService: ToasTMessageService
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    console.log(this.rowData);
    //no method found
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  @Input() set triggers(val: any[]) {
    this.rowData = val;
    this.cdr.markForCheck();
  }

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

  openExportFile() {
    this.downloadFile();
  }

  downloadFile() {
    const data = { triggerId: this.selectTriggerIds, type: 'Leads' };
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
