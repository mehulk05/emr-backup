import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-two-way-text-audit-table',
  templateUrl: './two-way-text-audit-table.component.html',
  styleUrls: ['./two-way-text-audit-table.component.css']
})
export class TwoWayTextAuditTableComponent implements OnInit {
  @Input() rowData: any[] = [];
  @Input() totalCount: number = 0;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onPaginate: EventEmitter<any> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onActionClicked: EventEmitter<any> = new EventEmitter();
  globalFilterColumn = [
    'sourceId',
    'sourceName',
    'source',
    'recipientName',
    'recipient',
    'messageCount',
    'communication'
  ];
  columns = [
    { header: 'Source Id', field: 'sourceId' },
    { header: 'Source Name', field: 'sourceName' },
    { header: 'Source', field: 'source' },
    { header: 'Recipient Name', field: 'recipientName' },
    { header: 'Recipient Number', field: 'recipient' },
    { header: 'Message Count', field: 'messageCount' },
    { header: 'Communication', field: 'communication' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  paginatorConfig = {
    currentPage: 0,
    totalPage: 0,
    noOfRecord: 25,
    recordArray: [10, 25, 50],
    currentRecordIndex: 1
  };

  constructor() {}

  ngOnInit(): void {
    this.rowData = this.rowData.map((row) => {
      if (!row.source || row.source === '-') {
        row.source = 'Business';
      }
      if (!row.sourceName || row.sourceName === '-') {
        row.sourceName = 'Business';
      }
      return row;
    });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  paginate(event: any) {
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentRecordIndex = event.first;
    this.onPaginate.emit(this.paginatorConfig);
  }

  onActionClick(actionType: string, data?: any) {
    this.onActionClicked.emit({
      type: actionType,
      data: data
    });
  }
}
