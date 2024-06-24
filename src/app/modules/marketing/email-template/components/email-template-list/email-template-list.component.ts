import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-email-template-list',
  templateUrl: './email-template-list.component.html',
  styleUrls: ['./email-template-list.component.css']
})
export class EmailTemplateListComponent {
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'templateFor',
    'emailTemplateName',
    'active',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Module', field: 'templateFor' },
    { header: 'Active', field: 'disabled' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Actions', field: 'actions' },
    { header: 'Clone', field: 'Clone' }
  ];
  _selectedColumns: any[] = this.columns;
  @Input() rowData: any[] = [];
  userId: any;
  @Output() emitTableEvent = new EventEmitter<any>();
  constructor(public formatTimeService: FormatTimeService) {
    console.log(this.rowData);
    console.log('In Constructor');
  }

  createeSmsTemplate() {
    this.emitTableEvent.emit({ eventType: 'CREATE' });
  }

  editTemplate(id: any) {
    this.emitTableEvent.emit({ eventType: 'EDIT', data: id });
  }

  cloneEmail(id: any) {
    this.emitTableEvent.emit({ eventType: 'CLONE', data: id });
  }

  deactiveEmail(data: any) {
    if (data.disabled) {
      this.emitTableEvent.emit({ eventType: 'ACTIVATE', data: data.id });
      return;
    }
    this.emitTableEvent.emit({ eventType: 'DEACTIVATE', data: data.id });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  getTemplateValue(val: any) {
    if (val == 'MassEmail') {
      return 'Mass Email';
    } else {
      return val;
    }
  }

  disabled(data: any): any {
    if (data?.disabled) {
      return 'disabled';
    }
    return '';
  }
}
