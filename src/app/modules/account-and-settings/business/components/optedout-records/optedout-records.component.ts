import { Component, Input, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-optedout-records',
  templateUrl: './optedout-records.component.html',
  styleUrls: ['./optedout-records.component.css']
})
export class OptedoutRecordsComponent implements OnInit {
  @Input() businessInfo: any;
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Email', field: 'email' },
    { header: 'User Type', field: 'userType' }
  ];

  globalFilterColumn = ['id', 'email', 'related'];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  constructor(
    private businessService: BusinessService,
    private toastMessageService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.loadOptedList();
  }
  loadOptedList() {
    this.businessService
      .getOptedOutEmailSMSListForBusiness(this.businessInfo.id)
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastMessageService.error(
          'Unable to load Opted out email/SMS List'
        );
      });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
