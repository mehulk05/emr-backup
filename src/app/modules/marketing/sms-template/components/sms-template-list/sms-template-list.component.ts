import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-sms-template-list',
  templateUrl: './sms-template-list.component.html',
  styleUrls: ['./sms-template-list.component.css']
})
export class SmsTemplateListComponent {
  first = 0;
  rows = 10;
  globalFilterColumn = ['id', 'name', 'templateFor', 'createdAt', 'updatedAt'];
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
  @Output() emitTableEvent = new EventEmitter<any>();
  userId: any;
  constructor(public formatTimeService: FormatTimeService) {}

  createeSmsTemplate() {
    this.emitTableEvent.emit({ eventType: 'CREATE' });
  }

  editTemplate(id: any) {
    this.emitTableEvent.emit({ eventType: 'EDIT', data: id });
  }

  cloneSMS(id: any) {
    this.emitTableEvent.emit({ eventType: 'CLONE', data: id });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  getTemplateValue(val: any) {
    console.log(val);
    if (val == 'MassSMS') {
      return 'Mass SMS';
    } else {
      return val;
    }
  }

  deactiveSms(data: any) {
    if (data.disabled) {
      this.emitTableEvent.emit({ eventType: 'ACTIVATE', data: data.id });
      return;
    }
    this.emitTableEvent.emit({ eventType: 'DEACTIVATE', data: data.id });
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  disabled(data: any): any {
    if (data?.disabled) {
      return 'disabled';
    }
    return '';
  }
}
