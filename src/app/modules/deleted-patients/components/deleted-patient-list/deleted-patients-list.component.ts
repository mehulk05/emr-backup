import { Component, Input, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
// import { DeletedpatientService } from '../../services/deleted-lead.service';
import { DeletedPatientsService } from '../../services/deleted-patients.service';

@Component({
  selector: 'app-deleted-patients-list',
  templateUrl: './deleted-patients-list.component.html',
  styleUrls: ['./deleted-patients-list.component.css']
})
export class DeletedPatientsListComponent implements OnInit {
  paginatorConfig = {
    currentPage: 0,
    totalPage: 0,
    noOfRecord: 50,
    recordArray: [10, 50, 100],
    currentRecordIndex: 1
  };
  initialLoadCount: number = 50;
  searchedValue: any = '';
  totalDataCount: any = 0;
  allUncheck: boolean = false;
  showConvertPatientModal: boolean = false;
  patientIdsToDelete: any = [];
  isSearchPageChange: boolean = false;

  globalFilterColumn = [
    'id',
    'fullName',
    'email',
    'phone',
    'deletedAt',
    'patientsStatus',
    'deletedBy'
  ];
  columns = [
    { header: 'Checkbox', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'fullName' },
    { header: 'Email', field: 'email' },
    { header: 'Phone', field: 'phone' },
    { header: 'Patients Status', field: 'patientsStatus' },
    { header: 'Deleted Date', field: 'deletedAt' },
    { header: 'Deleted By', field: 'deletedBy' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private patientService: DeletedPatientsService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.loadPatients(0, this.initialLoadCount);
  }

  loadPatientsSearch(page?: number, size?: number, search?: string) {
    this.patientService
      .getPatientsWithSearchParam(page, size, search)
      .then((data: any) => {
        this.totalDataCount = data.totalCount; // Adjust according to your API response
        this.rowData = data.elements; // Adjust according to your API response
      })
      .catch((error: any) => {
        console.error('Error loading patients with search:', error);
        this.toastService.error('Error loading patients with search');
      });
  }

  loadPatients(page?: number, size?: number) {
    console.log('Loading patients. Page:', page, 'Size:', size);
    this.patientService
      .getPatientsWithFilterParams(page, size)
      .then((response: any) => {
        console.log('Response:', response); // Log the response to see its format
        if (response && Array.isArray(response.elements)) {
          this.totalDataCount = response.count ?? 0;
          this.rowData = response.elements;
          console.log('Total data count:', this.totalDataCount); // Log the total data count
          console.log('Row data:', this.rowData); // Log the row data
        } else {
          console.error('Invalid response format:', response);
          this.toastService.error('Invalid response from server');
        }
      })
      .catch((error: any) => {
        console.error('Error loading patients:', error);
        this.toastService.error('Unable to load patients');
      });
  }

  searchPatient(): void {
    if (this.searchedValue.trim().length === 0) {
      this.loadPatients(0, this.initialLoadCount);
    } else {
      this.loadPatientsSearch(
        0,
        this.initialLoadCount,
        this.searchedValue.trim()
      );
      this.isSearchPageChange = true;
    }
  }

  resetSearch(): void {
    this.searchedValue = '';
    this.isSearchPageChange = false;
    this.paginatorConfig.currentPage = 0;
    this.loadPatients(0, this.initialLoadCount);
  }

  paginate(event: any) {
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentRecordIndex = event.first;
    if (!this.isSearchPageChange) {
      this.loadPatients(
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      );
    }
  }

  selectPatients(id: any, event: any) {
    this.allUncheck = event.target.checked;
    if (event.target.checked) {
      this.patientIdsToDelete.push(id);
    } else {
      this.patientIdsToDelete = this.patientIdsToDelete.filter(
        (item: any) => item !== id
      );
    }
  }

  hideConvertPatientModal() {
    this.showConvertPatientModal = false;
  }

  convertToPatients() {
    if (this.patientIdsToDelete.length > 0) {
      this.showConvertPatientModal = true;
    } else {
      this.toastService.error(
        'Select a deleted patient to convert to a patient.'
      );
      this.loadPatients(
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      );
    }
  }

  deleteSelectedPatients() {
    if (this.patientIdsToDelete.length > 0) {
      const resultArr = this.patientIdsToDelete.filter(
        (data: any, index: number) => {
          return this.patientIdsToDelete.indexOf(data) === index;
        }
      );

      this.patientService.convertToPatients(resultArr).then(
        () => {
          this.toastService.success('Converted to Patients Successfully.');
          this.showConvertPatientModal = false;
          this.patientIdsToDelete = [];
          this.loadPatients(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord
          );
        },
        () => {
          this.toastService.error('Error Converting to Patients');
        }
      );
    } else {
      this.toastService.error(
        'Select a deleted patient to convert to a patient.'
      );
    }
    this.loadPatients(0, 50);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
