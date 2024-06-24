import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-email-sms-audit-list',
  templateUrl: './email-sms-audit-list.component.html',
  styleUrls: ['./email-sms-audit-list.component.css']
})
export class EmailSmsAuditListComponent {
  first = 0;
  rows = 50;
  @Output() afterClickDetailEvent = new EventEmitter<any>();
  @Input() rowData: any[];
  @Input() communicationType: any;
  globalFilterColumn = ['triggerId', 'triggerName', 'triggerCount'];
  columns = [
    { header: 'Trigger Id', field: 'triggerId' },
    { header: 'Trigger Name', field: 'triggerName' },
    { header: 'Trigger Count', field: 'triggerCount' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;

  constructor() {}
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
    console.log('col', this.rowData);
  }

  getTriggerAuditDetails(
    triggerId: number,
    triggerModule: string,
    triggerType: string
  ) {
    this.afterClickDetailEvent.emit({
      triggerId: triggerId,
      triggerModule: triggerModule,
      triggerType: triggerType
    });
  }
}
