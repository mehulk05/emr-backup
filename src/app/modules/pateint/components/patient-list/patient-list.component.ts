import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppointmentService } from 'src/app/modules/appointment/services/appointment.service';
import { AppointmentPatientDto } from 'src/app/shared/models/appointment/AppointmentPatientDto';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../services/patient.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileSaverService } from 'ngx-filesaver';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Paginator } from 'primeng/paginator';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { PreviousUrlService } from '../../services/previous-url.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  checkboxValue: any = '';
  leadIdsToDelete: any = [];
  allUncheck: boolean = false;
  patientTag: any = null;
  pateintTagList: any[] = [];
  patientId: any;
  showImportModal: boolean = false;
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  uploadForm: FormGroup;
  totalDataCount = 0;
  selectedFilter: any;
  showTagModal = false;
  filterArray: any = [];
  sourceFilterValue: any;
  leadTagFilter: any = null;
  leadTagFilterVal: any = null;
  leadTagsResponse: any = [];
  statusFilter: string;
  isFilterByStatus: boolean;
  activeDateFilter: string = '';
  activePriorityFilter: string = '';
  minDate: string;
  maxDate: string;
  showEditLeadModal: boolean;
  filterCount = {
    sourceFilterCount: 0,
    statusFilterCount: 0
  };
  filter: any;
  selectedRows: any[] = [];
  userList: any[] = [];
  patientList: any[] = [];
  deleteModelMessage: any = null;
  globalFilterColumn = [
    'id',
    'firstName',
    'lastName',
    'name',
    'phone',
    'email',
    'createdBy',
    'createdAt',
    'updatedAt',
    'updatedBy'
  ];
  LEADSTATUS: any = ['NEW', 'EXISTING'];

  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 50, //rows,
    recordArray: [10, 50, 100],
    currentRecordIndex: 1
  };

  @ViewChild('patientPaginator', { static: false }) paginator: Paginator;
  columns = [
    { header: 'Checkbox', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Phone', field: 'phone' },
    { header: 'Email', field: 'email' },
    { header: 'Status', field: 'patientStatus' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  afterDate: any = moment('0001-01-01').endOf('day').format('YYYY-MM-DD HH:mm'); // default after date for after filter
  beforeDate: any = moment('9999-12-31')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm'); // default before date for before filter
  startDate: any = null; //start date for date filter 'between'
  endDate: any = null; // end date for date filter 'between'
  startDateValLoad: any = moment('0001-01-01')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm'); //start date while loading the leads
  endDateValLoad: any = moment('9999-12-31')
    .endOf('day')
    .format('YYYY-MM-DD HH:mm'); //end date while loading the leads
  startDateVal: any = moment('0001-01-01')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm'); //start date for filters
  endDateVal: any = moment('9999-12-31')
    .endOf('day')
    .format('YYYY-MM-DD HH:mm'); //end date for filters
  _selectedColumns: any[] = this.columns;
  rowData: AppointmentPatientDto[] = [];
  userId: any;
  showEditPatientModal: boolean;
  isSingleClick: boolean;
  showExportModal: boolean = false;
  inlineLeadUtils = {
    feildName: '',
    currentRowIndex: -1,
    isEdit: false,
    isInputChanged: false
  };

  inlineEditLeadObj: any = {
    id: null,
    email: '',
    name: ''
  };

  @ViewChild('inputFeild') inputFeild: ElementRef;
  searchText = '';
  isSingleDelete: boolean;
  businessInfo: any;
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    public patientService: PatientService,
    public formBuilder: FormBuilder,
    public fileSaverService: FileSaverService,
    private localStorgaeService: LocalStorageService,
    public alertService: ToasTMessageService,
    private toastService: ToasTMessageService,
    private previousUrlService: PreviousUrlService
  ) {}

  ngOnInit(): void {
    this.previousUrlService.setPreviousUrl(this.router.url);
    this.uploadForm = this.formBuilder.group({
      file: ['', [Validators.required]]
    });
    this.LoadPatients();
    this.businessInfo = this.localStorgaeService.readStorage('businessData');
    this.loadPatientTags();
  }
  openImportModal() {
    this.showImportModal = true;
  }
  filterByStatus(filter: any) {
    const sourceFilter = this.sourceFilterValue;
    if (this.filterCount.statusFilterCount >= 1) {
      this.filterArray = this.filterArray.filter(
        (obj: any) => obj.filterBy !== 'status'
      );
      this.filterCount.statusFilterCount = 0;
    }
    if (filter === 'All') {
      this.statusFilter = '';
      this.sourceFilterValue = sourceFilter;
      this.filterCount.statusFilterCount = 0;
      this.onPatientFilterSelection({
        sourceFilter: this.sourceFilterValue,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal
      });
    } else {
      const filterObj = {
        filter: filter,
        filterBy: 'status'
      };
      this.filterCount.statusFilterCount++;
      this.filterArray.push(filterObj);
      this.filter = filter;
      this.isFilterByStatus = true;
      this.statusFilter = filter;
      this.onPatientFilterSelection({
        sourceFilter: this.sourceFilterValue,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal,
        endDate: this.endDateVal,
        startDate: this.startDateVal
      });
    }
  }

  onLeadtagChangeForMultiSelect(e: any) {
    console.log(e);
    this.leadTagFilterVal = e.value.join(',');
    this.onPatientFilterSelection({
      sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: this.leadTagFilterVal,
      endDate: this.endDateVal,
      startDate: this.startDateVal
    });
  }

  loadPatientTags() {
    this.patientService
      .patientTagList()
      .then((data: any) => {
        this.leadTagsResponse = data;
      })
      .catch(() => {
        this.alertService.error('Unable to load leads');
      });
  }

  onDateFilter(dateValue: any) {
    this.startDateVal = null;
    this.endDateVal = null;
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm');
    const yesterday = moment()
      .subtract(1, 'days')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm');
    const lastWeekStart = moment()
      .subtract(1, 'weeks')
      .startOf('week')
      .format('YYYY-MM-DD HH:mm');
    const lastWeekEnd = moment()
      .subtract(1, 'weeks')
      .endOf('week')
      .format('YYYY-MM-DD HH:mm');
    const lastMonthStart = moment()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD HH:mm');
    const lastMonthEnd = moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD HH:mm');
    switch (dateValue) {
      case 'Today':
        this.startDateVal = today;
        this.endDateVal = moment(today).endOf('day').format('YYYY-MM-DD HH:mm');
        break;
      case 'Yesterday':
        this.startDateVal = yesterday;
        this.endDateVal = moment(yesterday)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm');
        break;
      case 'LastWeek':
        this.startDateVal = lastWeekStart;
        this.endDateVal = lastWeekEnd;
        break;
      case 'LastMonth':
        this.startDateVal = lastMonthStart;
        this.endDateVal = lastMonthEnd;
        break;
      case 'After':
        this.startDateVal = moment(this.afterDate)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm');
        this.endDateVal = moment('9999-12-31')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm');
        break;
      case 'Before':
        this.startDateVal = moment('0001-01-01')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm');
        this.endDateVal = moment(this.beforeDate)
          .startOf('day')
          .format('YYYY-MM-DD HH:mm');
        break;
      case 'Between':
        this.startDateVal =
          this.startDate == null
            ? null
            : moment(this.startDate).startOf('day').format('YYYY-MM-DD HH:mm');
        this.endDateVal =
          this.endDate == null
            ? null
            : moment(this.endDate).endOf('day').format('YYYY-MM-DD HH:mm');
        break;
      default:
        this.startDateVal = this.startDateValLoad;
        this.endDateVal = this.endDateValLoad;
        break;
    }
    this.onPatientFilterSelection({
      sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: this.leadTagFilterVal,
      endDate: this.endDateVal,
      startDate: this.startDateVal
    });
  }

  unselectTriggers() {
    this.selectedRows = [];
  }

  onRowSelect(event: any, id: number) {
    if (event.checked) {
      this.selectedRows.push(id);
    } else {
      this.selectedRows = this.selectedRows.filter((item: any) => item !== id);
    }
  }

  LoadPatients(
    tag?: string,
    status?: string,
    startDate?: string,
    endDate?: string
  ) {
    console.log('ENTER LOAD PATIENTS: ' + startDate + ' ' + endDate);
    startDate = startDate ? startDate : this.startDateValLoad;
    endDate = endDate ? endDate : this.endDateValLoad;
    this.appointmentService
      .getAppointmentPatientsByPage(
        tag,
        status,
        startDate,
        endDate,
        this.searchText,
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      )
      .then((data: any) => {
        this.rowData = data.elements;
        /* -------- Saving patientIds in localStorage for next and pre button ------- */
        const patientIds: any[] = [];
        data.elements.forEach((lead: any) => {
          patientIds.push(lead.id);
        });
        this.totalDataCount = data.count;

        localStorage.setItem('patientIds', JSON.stringify(patientIds));
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Patients');
      });
  }

  searchPatient() {
    if (this.paginator.getPage() != 0) {
      this.paginator.changePage(0);
    } else {
      this.LoadPatients(
        this.selectedFilter?.selectedLeadTag
          ? this.selectedFilter?.selectedLeadTag
          : '',
        this.selectedFilter?.statusFilter
          ? this.selectedFilter?.statusFilter
          : '',
        this.startDateVal,
        this.endDateVal
      );
    }
  }

  resetSearch() {
    this.searchText = '';
    this.LoadPatients(
      this.selectedFilter?.selectedLeadTag
        ? this.selectedFilter?.selectedLeadTag
        : '',
      this.selectedFilter?.statusFilter ? this.selectedFilter?.statusFilter : ''
    );
  }

  onCloseModalPatientModal(e: any) {
    console.log(e);
    if (e && e.isEdit) {
      this.showEditPatientModal = false;
      this.LoadPatients(
        this.selectedFilter?.selectedLeadTag
          ? this.selectedFilter?.selectedLeadTag
          : '',
        this.selectedFilter?.statusFilter
          ? this.selectedFilter?.statusFilter
          : '',
        this.startDateVal,
        this.endDateVal
      );
    }
    if (e.close) {
      this.showEditPatientModal = false;
    }
  }

  formatTimeInData() {
    this.rowData.map((data, i) => {
      this.rowData[i].createdAt = this.formatTimeService.formatTime(
        data.createdAt
      );
      this.rowData[i].updatedAt = this.formatTimeService.formatTime(
        data.updatedAt
      );
    });
  }

  showPatientDetail(id: Number) {
    console.log(id);
    this.isSingleClick = true;
    const source = !this.businessInfo?.showPatientDetailsOnSinglePage
      ? 'pateint'
      : 'single-page';
    setTimeout(() => {
      if (this.isSingleClick) {
        this.patientId = id;
        this.router.navigate(['/patients/' + id + '/edit'], {
          queryParams: {
            source: source
          },
          queryParamsHandling: 'merge'
        });
      }
    }, 250);
  }

  editPatient(id: Number) {
    this.patientId = id;
    this.showEditPatientModal = true;
  }

  goToPaitent() {
    this.router.navigate(['patients', 'create'], {
      queryParams: {
        source: 'pateint'
      },
      queryParamsHandling: 'merge'
    });
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  downloadAsPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const dataArray = new Array();
    const selectedIds = this.selectedRows.map((o) => o.id);
    this.patientService.getPatientList(selectedIds).then((data: any) => {
      console.log('data', data);
      data.forEach((data1: any) => {
        console.log('data1', data1);
        const temp = [
          data1.id || '',
          data1.firstName || '',
          data1.lastName || '',
          data1.email || '',
          data1.phone || '',
          data1.DOB ? this.formatTimeService.formatDate(data1.DOB) : '',
          data1.Gender || '',
          (data1.addressLine1 || '') + ' ' + (data1.addressLine2 || '')
        ];
        dataArray.push(temp);
      });
      console.log(dataArray);
      const columns = [
        [
          'Id',
          'First Name',
          'Last Name',
          'Email',
          'Phone Number',
          'Date of Birth',
          'Gender',
          'Address'
        ]
      ];

      autoTable(doc, {
        head: columns,
        body: dataArray,
        theme: 'grid',
        headStyles: { fillColor: [128, 128, 128] }
      });
      doc.setTextColor(0);
      doc.save('PatientList.pdf');
    });
  }

  downloadAsExcel() {
    this.userList = [];
    const patientIds = this.selectedRows.map((o) => o.id);
    this.patientService.getPatientList(patientIds).then((data: any) => {
      console.log('data', data);
      data.forEach((data1: any) => {
        let temp = {};
        temp = {
          Id: data1.id || '',
          'First Name': data1.firstName || '',
          'Last Name': data1.lastName || '',
          Email: data1.email || '',
          'Phone Number': data1.phone || '',
          'Date of birth': data1.DOB
            ? this.formatTimeService.formatDate(data1.DOB)
            : '',
          Gender: data1.Gender || '',
          Address: (data1.addressLine1 || '') + ' ' + (data1.addressLine2 || '')
        };
        this.userList.push(temp);
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userList);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, 'PatientList.xls');
    });
  }

  openImportFile() {
    this.showImportModal = true;
  }

  onCloseExportFileModal(e: any) {
    this.showExportModal = false;
    if (e.isExcel) {
      this.downloadAsExcel();
    }
    if (e.isPdf) {
      this.downloadAsPdf();
    }
    this.selectedRows = [];
  }

  openExportFile() {
    this.showExportModal = true;
  }

  onCloseModal(e: any) {
    console.log('closee', e.isImport);
    this.deleteModelMessage = null;
    this.showImportModal = false;
    if (e.isImport) {
      this.uploadFile(e.isImport);
    }
    console.log(e);
    this.showModal = false;
    this.showEditLeadModal = false;
    if (e?.isEdit) {
      setTimeout(() => {
        this.LoadPatients();
      }, 100);
    }
  }

  deletePatient(id: number) {
    this.patientService.deletePatient(id).then(
      () => {
        this.selectedRows = [];
        this.LoadPatients(
          this.selectedFilter?.selectedLeadTag
            ? this.selectedFilter?.selectedLeadTag
            : '',
          this.selectedFilter?.statusFilter
            ? this.selectedFilter?.statusFilter
            : '',
          this.startDateVal,
          this.endDateVal
        );
        this.toastMessageService.success('Patient deleted successfully.');
      },
      () => {
        this.toastMessageService.error('Unable to delete Patient.');
      }
    );
  }

  onClosePatientModal(e: any) {
    this.deleteModelMessage = null;
    const patientIds = this.selectedRows.map((o) => o.id);
    this.showModal = false;
    if (e.isDelete) {
      if (patientIds.length > 0 && !this.isSingleDelete) {
        this.deleteSelectedPatients();
      } else {
        this.deletePatient(this.modalData.id);
      }
    }
  }

  deleteSelectedPatients() {
    const patientIds = this.selectedRows.map((o) => o.id);

    if (patientIds.length > 0) {
      const resultArr = patientIds.filter((data: any, index: number) => {
        return patientIds.indexOf(data) === index;
      });

      console.log('result arr', resultArr);
      this.patientService.deleteMassPatient(resultArr).then(
        () => {
          this.toastService.success('Patient deleted successfully.');

          this.selectedRows = [];
          this.LoadPatients(
            this.selectedFilter?.selectedLeadTag
              ? this.selectedFilter?.selectedLeadTag
              : '',
            this.selectedFilter?.statusFilter
              ? this.selectedFilter?.statusFilter
              : '',
            this.startDateVal,
            this.endDateVal
          );
        },
        () => {
          this.toastService.error('Error Deleting Patient');
        }
      );
    } else {
      this.toastService.error('Select a Patient to delete Patient.');
    }
  }

  uploadFile(file: any) {
    const currentUser = this.localStorgaeService.readStorage('currentUser');
    const formData = new FormData();
    formData.append('file', file);
    console.log('form', formData);
    formData.append('userId', currentUser?.id);

    this.patientService.uploadFile(formData).then(
      () => {
        this.toastMessageService.success(
          'File upload under process and an Email will be sent once it is completed'
        );
        this.LoadPatients(
          this.selectedFilter?.selectedLeadTag
            ? this.selectedFilter?.selectedLeadTag
            : '',
          this.selectedFilter?.statusFilter
            ? this.selectedFilter?.statusFilter
            : '',
          this.startDateVal,
          this.endDateVal
        );
      },
      () => {
        this.toastMessageService.error('Unable to upload file.');
      }
    );
  }

  resetTag() {
    this.patientTag = null;
    this.paginatorConfig.currentPage = 0;
    this.paginatorConfig.currentRecordIndex = 1;
    this.paginator.changePage(0);
    this.LoadPatients();
  }

  onPatienttagChange(e: any) {
    this.patientTag = e;
    this.paginatorConfig.currentPage = 0;
    this.paginatorConfig.currentRecordIndex = 1;
    this.paginator.changePage(0);
    this.LoadPatients(e.name);
  }

  checkInlineEditCondition(rowIndex: any, field: any) {
    if (
      this.inlineLeadUtils.currentRowIndex === rowIndex &&
      this.inlineLeadUtils.feildName === field
    ) {
      return true;
    } else {
      return false;
    }
  }

  onDoubleClick(feildName: any, index: any, data: any) {
    this.isSingleClick = false;
    // this.inlineEditLeadObj[feildName].nativeElement.focus();
    console.log(feildName, index, data);
    this.inlineLeadUtils.feildName = feildName;
    this.inlineLeadUtils.isEdit = true;
    this.inlineLeadUtils.currentRowIndex = index;
    this.inlineEditLeadObj['id'] = data.id;
    this.inlineEditLeadObj['firstName'] = data.firstName;
    this.inlineEditLeadObj['lastName'] = data.lastName;
    this.inlineEditLeadObj['name'] = data.name;
    this.inlineEditLeadObj['email'] = data.email;
    this.inlineEditLeadObj['patientStatus'] = data['patientStatus'];
    setTimeout(() => {
      this.inputFeild.nativeElement.focus();
    }, 100);
  }

  onEditInlineLead() {
    console.log(this.inlineEditLeadObj, this.inlineLeadUtils);
    if (this.inlineLeadUtils.isInputChanged) {
      /* ----------------------------- NAME VALIDATIOn ---------------------------- */
      if (this.inlineLeadUtils.feildName === 'firstName') {
        if (this.inlineEditLeadObj.firstName) {
          this.saveInlineEdit();
        } else {
          this.alertService.error('Please enter a valid first Name');
        }
      }

      /* ----------------------------- Last NAME VALIDATIOn ---------------------------- */
      if (this.inlineLeadUtils.feildName === 'lastName') {
        console.log(this.inlineEditLeadObj);
        if (this.inlineEditLeadObj.lastName) {
          this.saveInlineEdit();
        } else {
          this.alertService.error('Please enter a valid last Name');
        }
      }

      if (this.inlineLeadUtils.feildName === 'name') {
        if (this.inlineEditLeadObj.name) {
          this.saveInlineEdit();
        } else {
          this.alertService.error('Please enter a valid Name');
        }
      }

      /* ---------------------------- EMAIL VALIDATION ---------------------------- */
      if (this.inlineLeadUtils.feildName === 'email') {
        if (
          /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(
            this.inlineEditLeadObj.email
          )
        ) {
          this.saveInlineEdit();
        } else {
          this.alertService.error('Please enter a valid email');
        }
      }

      if (this.inlineLeadUtils.feildName === 'patientStatus') {
        this.saveInlineEdit();
      }
    }
    this.inlineLeadUtils.currentRowIndex = -1;
    this.inlineLeadUtils.isInputChanged = false;

    setTimeout(() => {
      this.inlineLeadUtils.feildName = '';
    }, 1000);
  }

  validateInput() {
    this.inlineLeadUtils.isInputChanged = true;
  }
  saveInlineEdit() {
    const formData: any = {};
    formData.firstName = this.inlineEditLeadObj.firstName;
    formData.lastName = this.inlineEditLeadObj.lastName;
    formData.email = this.inlineEditLeadObj.email;
    formData.name = this.inlineEditLeadObj.name;
    formData.patientStatus = this.inlineEditLeadObj.patientStatus;

    this.patientService
      .editInlinePaitent(formData, this.inlineEditLeadObj.id)
      .then(() => {
        this.alertService.success('Patient Edited successfully !');
        this.LoadPatients(
          this.selectedFilter?.selectedLeadTag
            ? this.selectedFilter?.selectedLeadTag
            : '',
          this.selectedFilter?.statusFilter
            ? this.selectedFilter?.statusFilter
            : '',
          this.startDateVal,
          this.endDateVal
        );
      })
      .catch(() => {
        this.alertService.error('Error while editing Patient !');
      });
  }

  onPatientFilterSelection(e: any) {
    console.log(e);
    this.selectedFilter = e;
    this.paginatorConfig.currentPage = 0;
    this.paginatorConfig.currentRecordIndex = 1;
    this.paginator.changePage(0);
    this.startDateVal =
      e?.startDate ??
      moment('0001-01-01').startOf('day').format('YYYY-MM-DD HH:mm');
    this.endDateVal =
      e?.endDate ??
      moment('9999-12-31').endOf('day').format('YYYY-MM-DD HH:mm');
    this.LoadPatients(
      e?.selectedLeadTag,
      e?.statusFilter,
      this.startDateVal,
      this.endDateVal
    );
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
  }

  updateLeadStatus(status: string) {
    const patientIds = this.selectedRows.map((o) => o.id);
    if (patientIds.length === 0) {
      this.toastService.error('Select a Patient to update Lead status');
      return;
    }
    this.patientService.updateMassPatientStatus(patientIds, status).then(
      () => {
        this.toastService.success('Patient status updated successfully');
        this.selectedRows = [];
        this.LoadPatients(
          this.selectedFilter?.selectedLeadTag
            ? this.selectedFilter?.selectedLeadTag
            : '',
          this.selectedFilter?.statusFilter
            ? this.selectedFilter?.statusFilter
            : '',
          this.startDateVal,
          this.endDateVal
        );
      },
      () => {
        this.toastService.error('Error while updating mass patient status');
      }
    );
  }

  addLeadTags() {
    const patientIds = this.selectedRows.map((o) => o.id);
    if (patientIds.length > 0) {
      this.showTagModal = true;
    } else {
      this.toastService.error('Please select the patients');
    }
  }

  modalTagClosed(event: any) {
    const patientIds = this.selectedRows.map((o) => o.id);
    this.showTagModal = false;
    if (event?.close == false && patientIds?.length > 0) {
      const data = { tags: event?.selectedTags, leadId: patientIds };
      this.patientService.assignMultipleTagsToLead(data).then(
        () => {
          this.selectedRows = [];
          this.alertService.success('Patient with tags updated successfully');
        },
        () => {
          this.alertService.error('Error while updating tags');
        }
      );
    }
  }

  deleteTemplateModal(data: any, isSingleDelete: boolean) {
    const fullName = `${data.firstName} ${data.lastName}`;
    this.modalData = {
      name: fullName,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = fullName;
    this.modalData.titleName = 'Patient';
    this.isSingleDelete = isSingleDelete;
    this.deleteModelMessage =
      'Proceeding with this action would also delete all the associated tasks (if any) with this patient. Are you sure you want to proceed?';
  }
  deleteAllSelectedTemplateModal(isSingleDelete: boolean) {
    const patientIds = this.selectedRows.map((o) => o.id);
    if (patientIds.length === 0) {
      this.toastService.error('Select a Patient to delete Lead');
      return;
    }
    if (patientIds.length === 1) {
      const patientname = this.selectedRows.map(
        (o) => `${o.firstName} ${o.lastName}`
      );

      this.modalData = {
        name: patientname,
        id: patientIds
      };
      this.showModal = true;
      this.deleteModelMessage =
        'Proceeding with this action would also delete all the associated tasks (if any) with this patient. Are you sure you want to proceed?';
      this.modalData.feildName = patientname;
      this.modalData.titleName = 'Patient';
      this.isSingleDelete = isSingleDelete;
    } else {
      this.isSingleDelete = isSingleDelete;
      this.modalData = {};
      this.showModal = true;
      this.deleteModelMessage =
        'Proceeding with this action would also delete all the associated tasks (if any) with these patients. Are you sure you want to proceed?';
      this.modalData.feildName = 'all selected patients';
      this.modalData.titleName = 'All Selected Patients';
      this.modalData.count = this.selectedRows.length;
      this.modalData.moduleName = 'patients';
    }
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;

    this.paginatorConfig.currentRecordIndex = event.first;
    console.log(event);
    this.LoadPatients(
      this.selectedFilter?.selectedLeadTag
        ? this.selectedFilter?.selectedLeadTag
        : '',
      this.selectedFilter?.statusFilter
        ? this.selectedFilter?.statusFilter
        : '',
      this.startDateVal,
      this.endDateVal
    );
  }
}
