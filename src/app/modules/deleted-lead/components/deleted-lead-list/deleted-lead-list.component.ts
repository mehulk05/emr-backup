import { Component, Input, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { DeletedLeadService } from '../../services/deleted-lead.service';

@Component({
  selector: 'app-deleted-lead-list',
  templateUrl: './deleted-lead-list.component.html',
  styleUrls: ['./deleted-lead-list.component.css']
})
export class DeletedLeadListComponent implements OnInit {
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 50, //rows,
    recordArray: [10, 50, 100],
    currentRecordIndex: 1
  };
  initialLoadCount: number = 50;
  searchedValue: any = '';
  totalDataCount: any = 0;
  allUncheck: boolean = false;
  showConvertLeadModal: boolean = false;
  leadIdsToDelete: any = [];
  isSearchPageChange: boolean = false;

  globalFilterColumn = [
    'id',
    'fullName',
    'email',
    'phoneNumber',
    'deletedAt',
    'leadStatus',
    'leadSource',
    'deletedBy'
  ];
  columns = [
    { header: 'Checkbox', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'fullName' },
    { header: 'Email', field: 'email' },
    { header: 'Phone', field: 'phoneNumber' },
    { header: 'Source', field: 'leadSource' },
    { header: 'Lead Status', field: 'leadStatus' },
    { header: 'Landing Page', field: 'landingPage' },
    { header: 'Deleted Date', field: 'deletedAt' },
    { header: 'Deleted By', field: 'deletedBy' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private leadService: DeletedLeadService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService
  ) {}
  ngOnInit(): void {
    this.loadLeads(0, this.initialLoadCount);
  }

  loadLeadsSearch(page?: number, size?: number, search?: string) {
    this.leadService
      .getLeadsWithSearchParam(page, size, search)
      .then((data: any) => {
        this.totalDataCount = data.shift();
        this.rowData = data;
      });
  }

  loadLeads(page?: number, size?: number) {
    this.leadService
      .getLeadsWithFilterParams(page, size)
      .then((data: any) => {
        this.totalDataCount = data.shift();
        this.rowData = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load leads');
      });
  }
  editLeads(id: any) {
    console.log(id);
  }

  searchLead(): void {
    if (this.searchedValue.length === 0) {
      console.log(this.searchedValue.length === 0);
      this.loadLeads(0, this.initialLoadCount);
    } else {
      this.loadLeadsSearch(0, this.initialLoadCount, this.searchedValue);
      this.isSearchPageChange = true;
    }
  }

  resetSearch(): void {
    this.searchedValue = '';
    this.isSearchPageChange = false;
    this.paginatorConfig.currentPage = 0;
    this.loadLeads(0, this.initialLoadCount);
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;

    this.paginatorConfig.currentRecordIndex = event.first;
    console.log(event);
    if (!this.isSearchPageChange) {
      this.loadLeads(
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      );
    }
  }

  selectLeads(id: any, event: any) {
    this.allUncheck = event.target.checked;
    if (event.target.checked) {
      this.leadIdsToDelete.push(id);
    } else {
      this.leadIdsToDelete = this.leadIdsToDelete.filter(
        (item: any) => item !== id
      );
    }
    console.log(this.leadIdsToDelete);
  }
  hideConvertLeadModal() {
    this.showConvertLeadModal = false;
  }

  convertToLeads() {
    if (this.leadIdsToDelete.length > 0) {
      this.showConvertLeadModal = true;
    } else {
      this.toastService.error('Select a deleted lead to convert to a lead.');
      this.loadLeads(
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      );
    }
  }

  deleteSelectedLeads() {
    if (this.leadIdsToDelete.length > 0) {
      /* -------------------------------------------------------------------------- */
      /*                         Removing duplicate leadIds                         */
      /* -------------------------------------------------------------------------- */
      const resultArr = this.leadIdsToDelete.filter(
        (data: any, index: number) => {
          return this.leadIdsToDelete.indexOf(data) === index;
        }
      );

      console.log('result arr', resultArr);
      this.leadService.convertToLeads(resultArr).then(
        () => {
          this.toastService.success('Converted to Lead Successfully.');
          this.showConvertLeadModal = false;
          this.leadIdsToDelete = [];
          this.loadLeads(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord
          );
        },
        () => {
          this.toastService.error('Error Converting to Leads');
        }
      );
    } else {
      this.toastService.error('Select a deleted lead to convert to a lead.');
    }
    this.loadLeads(0, 50);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
