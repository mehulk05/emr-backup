/* eslint-disable prettier/prettier */
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LeadsService } from '../../service/leads.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileSaverService } from 'ngx-filesaver';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Table } from 'primeng/table';
import { environment } from 'src/environments/environment';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import moment from 'moment';
export type DynamicObject = { [key: string]: any };

@Component({
  selector: 'app-leads-table',
  templateUrl: './leads-table.component.html',
  styleUrls: ['./leads-table.component.css']
})
export class LeadsTableComponent implements OnInit, OnChanges {
  @ViewChild('dt1') table: Table;
  isSingleClick: Boolean = true;
  @ViewChild('inputFeild') inputFeild: ElementRef;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAddLead = new EventEmitter<any>();
  @Input() tags: any = [];
  filterArray: any = [];
  sourceFilterValue: any;
  leadTagFilter: any = null;
  leadTagFilterVal: any = null;
  @Input() leadTagsResponse: any = [];
  statusFilter: string;
  isFilterByStatus: boolean;
  filterCount = {
    sourceFilterCount: 0,
    statusFilterCount: 0
  };
  activeDropDownId: number;
  filter: any;
  showDeleteButton: boolean = true;
  showConvertLeadModal: boolean = false;
  showOnboardedLeadModal: boolean = false;
  isSmileVirtualBusiness: boolean = false;
  LEADSTATUS: any = [
    'NEW',
    'JUNK',
    'COLD',
    'WARM',
    'HOT',
    'PENDING',
    'WON',
    'DEAD'
  ];
  selectedRows: any[] = [];
  leadFilter = {
    selectedLeadTag: '',
    sourceFilter: '',
    statusFilter: ''
  };
  @Input() showImportModal: boolean;
  @Output() closeImportModal = new EventEmitter<boolean>();
  inlineLeadUtils = {
    feildName: '',
    currentRowIndex: -1,
    isEdit: false,
    isInputChanged: false
  };
  inlineEditLeadObj: any = {
    id: null,
    name: '',
    email: '',
    phoneNumber: '',
    leadStatus: ''
  };

  @Input() isRefreshApiCall: any;
  searchedValue: any = '';
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 50, 100],
    currentRecordIndex: 1
  };
  fileName: any;
  totalDataCount: any = 0;
  showModal: boolean = false;
  showExportModal: boolean = false;
  modalData: any;
  deleteModelMessage: any = null;
  uploadForm: FormGroup;
  checkboxValue: any = '';
  activeFilter: string;
  activeDateFilter: string = '';
  activePriorityFilter: string = '';
  minDate: string;
  maxDate: string;
  globalFilterColumn = [
    'id',
    'fullName',
    'Email',
    'Phone Number',
    'createdAt',
    'leadStatus',
    'leadSource',
    'amount'
  ];

  columns = [
    { header: 'Checkbox', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'fullName' },
    { header: 'Email', field: 'Email' },
    { header: 'Phone', field: 'Phone Number' },
    { header: 'Lead Status', field: 'leadStatus' },
    { header: 'Amount', field: 'amount' },
    { header: 'Source', field: 'leadSource' },
    { header: 'Landing Page', field: 'landingPage' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Form Name', field: 'questionnaireName' },
    { header: 'Source URL', field: 'sourceUrl' },
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
  // _selectedColumns: any[] = this.columns;
  _selectedColumns: any[] = [];
  rowData: any[] = [];
  tempRowData: any[] = [];
  leadList: any[] = [];
  showEditLeadModal: boolean;
  leadObj: any;
  allUncheck: boolean = false;
  isSingleDelete: boolean;
  userList: any[] = [];
  showTagModal = false;
  initialLoadCount: number = 10;
  constructor(
    private leadService: LeadsService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService,
    private router: Router,
    public formBuilder: FormBuilder,
    private fileSaverService: FileSaverService,
    private localStorgaeService: LocalStorageService,
    private httpHelperService: HttpHelperService
  ) {}

  ngOnInit(): void {
    this.sourceFilterValue = '';
    this.statusFilter = '';
    this.loadLeads(
      0,
      this.initialLoadCount,
      this.leadFilter.statusFilter,
      this.leadFilter.sourceFilter,
      this.searchedValue,
      this.leadFilter.selectedLeadTag,
      this.startDateValLoad,
      this.endDateValLoad
    );
    this.uploadForm = this.formBuilder.group({
      file: ['', [Validators.required]]
    });
    console.log('Business Id');
    console.log(this.httpHelperService.getTenantHttpOptions()['X-TenantID']);

    if (
      this.httpHelperService.getTenantHttpOptions()['X-TenantID'] ===
      821 + ''
    ) {
      this.showDeleteButton = false;
    }
    if (
      this.httpHelperService.getTenantHttpOptions()['X-TenantID'] ===
        environment.SMILE_VIRTUAL_BUSINESS_ID + '' ||
      this.httpHelperService.getTenantHttpOptions()['X-TenantID'] ===
        environment.AESTHETIC_VIRTUAL_BUSINESS_ID + ''
    ) {
      this.isSmileVirtualBusiness = true;
    }
    console.log(this.isSmileVirtualBusiness);
    for (const entry of this.columns) {
      if (entry.field !== 'sourceUrl' && entry.field !== 'questionnaireName') {
        this._selectedColumns.push(entry);
      }
    }
    // this.leadService
    //   .leadTagList()
    //   .then((data: any) => {
    //     this.leadTagsResponse = data;
    //   })
    //   .catch(() => {
    //     this.toastService.error('Unable to load leads');
    //   });
  }

  ngOnChanges(): void {
    console.log(this.isRefreshApiCall);
    if (this.isRefreshApiCall !== 0) {
      console.log('api', this.isRefreshApiCall);
      setTimeout(() => {
        this.loadLeads(
          this.paginatorConfig.currentPage,
          this.paginatorConfig.noOfRecord,
          this.leadFilter.statusFilter,
          this.leadFilter.sourceFilter,
          this.searchedValue,
          this.leadFilter.selectedLeadTag,
          this.startDateValLoad,
          this.endDateValLoad
        );
      }, 8000);
    }
  }

  toggleDropdown(id: any) {
    this.activeDropDownId = this.activeDropDownId != id ? id : undefined;
  }

  addLeadTemplateModal() {
    this.onAddLead.emit(true);
  }
  loadLeads(
    page?: number,
    size?: number,
    status?: string,
    source?: string,
    search?: string,
    leadTag?: string,
    startDate?: string,
    endDate?: string
  ) {
    console.log(
      'leads------>>>>>',
      page,
      size,
      status,
      source,
      search,
      leadTag
    );
    leadTag = encodeURIComponent(leadTag);
    this.leadService
      .getLeadsWithFilterParams(
        page,
        size,
        status,
        source,
        search,
        leadTag,
        startDate,
        endDate
      )
      .then((data: any) => {
        console.log('data pop');
        this.totalDataCount = data.pop();
        console.log(this.totalDataCount);
        this.rowData = data;
        const leadIds: any[] = [];
        data.forEach((lead: any) => {
          leadIds.push(lead.id);
        });

        localStorage.setItem('leadIds', JSON.stringify(leadIds));
      })
      .catch(() => {
        this.toastService.error('Unable to load leads');
      });
  }
  editLeads(id: any, email: string) {
    console.log(id);
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.router.navigate(['/leads/' + id + '/edit'], {
          queryParams: { source: 'leadDetail', email: email }
          //skipLocationChange: true,
          //state: { email: email }
        });
      }
    }, 250);
  }

  unselectTriggers() {
    this.selectedRows = [];
  }

  onSourceSelect(source: any) {
    this.filterBySource(source);
  }

  onStatusSelect(status: any) {
    this.filterByStatus(status);
  }

  clearFilters() {
    this.filterCount = {
      sourceFilterCount: 0,
      statusFilterCount: 0
    };
    this.leadTagFilterVal = '';
    this.leadTagFilter = null;
    this.sourceFilterValue = 'ChatBot';
    this.statusFilter = '';
    this.startDateVal = moment('0001-01-01')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm');
    this.endDateVal = moment('9999-12-31')
      .endOf('day')
      .format('YYYY-MM-DD HH:mm');
    this.filterByStatus('All');
  }

  deleteAllSelectedTemplateModal(isSingleDelete: boolean) {
    const leadIds = this.selectedRows.map((o) => o.id);
    if (leadIds.length === 0) {
      this.toastService.error('Select a Lead to delete Lead');
      return;
    }
    if (leadIds.length === 1) {
      const leadname = this.selectedRows.map((o) => o.fullName);
      this.modalData = {
        name: leadname,
        id: leadIds
      };
      this.showModal = true;
      this.modalData.feildName = leadname;
      this.modalData.titleName = 'Lead';
      this.isSingleDelete = isSingleDelete;
      this.deleteModelMessage =
        'Proceeding with this action would also delete all the associated tasks (if any) with this lead. Are you sure you want to proceed?';
    } else {
      this.isSingleDelete = isSingleDelete;
      this.modalData = {};
      this.showModal = true;
      this.modalData.feildName = 'all selected leads';
      this.modalData.titleName = 'All Selected Leads';
      this.modalData.count = this.selectedRows.length;
      this.modalData.moduleName = 'leads';
      this.deleteModelMessage =
        'Proceeding with this action would also delete all the associated tasks (if any) with these leads. Are you sure you want to proceed?';
    }
  }

  deleteSelectedLeads() {
    const leadIds = this.selectedRows.map((o) => o.id);

    if (leadIds.length > 0) {
      /* -------------------------------------------------------------------------- */
      /*                         Removing duplicate leadIds                         */
      /* -------------------------------------------------------------------------- */
      const resultArr = leadIds.filter((data: any, index: number) => {
        return leadIds.indexOf(data) === index;
      });

      console.log('result arr', resultArr);
      this.leadService.deleteMassLeads(resultArr).then(
        () => {
          this.toastService.success('Leads deleted successfully.');

          this.selectedRows = [];
          this.loadLeads(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord,
            this.leadFilter.statusFilter,
            this.leadFilter.sourceFilter,
            this.searchedValue,
            this.leadFilter.selectedLeadTag,
            this.startDateValLoad,
            this.endDateValLoad
          );
        },
        () => {
          this.toastService.error('Error Deleting Leads');
        }
      );
    } else {
      this.toastService.error('Select a Lead to delete Lead.');
    }
  }

  deleteTemplateModal(data: any, isSingleDelete: boolean) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.fullName;
    this.modalData.titleName = 'Lead';
    this.isSingleDelete = isSingleDelete;
    this.deleteModelMessage =
      'Proceeding with this action would also delete all the associated tasks (if any) with this lead. Are you sure you want to proceed?';
  }

  onCloseModal(e: any) {
    this.deleteModelMessage = null;
    const leadIds = this.selectedRows.map((o) => o.id);
    console.log(e);
    this.showModal = false;
    this.showEditLeadModal = false;
    this.deleteModelMessage = null;
    if (e.isDelete) {
      if (leadIds.length > 0 && !this.isSingleDelete) {
        this.deleteSelectedLeads();
      } else {
        this.deleteTemplate(this.modalData.id);
      }
    }
    if (e?.isEdit) {
      setTimeout(() => {
        this.loadLeads(
          this.paginatorConfig.currentPage,
          this.paginatorConfig.noOfRecord,
          this.leadFilter.statusFilter,
          this.leadFilter.sourceFilter,
          this.searchedValue,
          this.leadFilter.selectedLeadTag,
          this.startDateValLoad,
          this.endDateValLoad
        );
      }, 100);
    }
  }

  inlineEdit(lead: any) {
    this.showEditLeadModal = true;
    this.leadObj = lead;
  }
  deleteTemplate(id: any) {
    this.leadService
      .deleteLeadById(id)
      .then(() => {
        this.selectedRows = [];
        this.loadLeads(
          this.paginatorConfig.currentPage,
          this.paginatorConfig.noOfRecord,
          this.leadFilter.statusFilter,
          this.leadFilter.sourceFilter,
          this.searchedValue,
          this.leadFilter.selectedLeadTag,
          this.startDateValLoad,
          this.endDateValLoad
        );
        this.toastService.success('Lead deleted successfully');
      })
      .catch(() => {
        this.toastService.error('Error while deleting template');
      });
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;

    this.paginatorConfig.currentRecordIndex = event.first;
    console.log(event);
    this.loadLeads(
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord,
      this.leadFilter.statusFilter,
      this.leadFilter.sourceFilter,
      this.searchedValue,
      this.leadFilter.selectedLeadTag,
      this.startDateVal,
      this.endDateVal
    );
  }

  onLeadFilterSelection(e: any) {
    console.log(e);
    if (e) {
      this.leadFilter.statusFilter = e?.statusFilter ?? '';
      this.leadFilter.sourceFilter = e?.sourceFilter ?? '';
      this.leadFilter.selectedLeadTag = e?.selectedLeadTag ?? '';
      this.startDateVal =
        e?.startDate ??
        moment('0001-01-01').startOf('day').format('YYYY-MM-DD HH:mm');
      this.endDateVal =
        e?.endDate ??
        moment('9999-12-31').endOf('day').format('YYYY-MM-DD HH:mm');
      this.loadLeads(
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord,
        this.leadFilter.statusFilter,
        this.leadFilter.sourceFilter,
        this.searchedValue,
        this.leadFilter.selectedLeadTag,
        this.startDateVal,
        this.endDateVal
      );
    }
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  openExportFile() {
    this.showExportModal = true;
  }

  onCloseImportFileModal(e: any) {
    console.log('cls', e.isImport);
    this.showImportModal = false;
    this.closeImportModal.emit();
    if (e.isImport) {
      console.log('import');
      this.uploadFile(e.isImport, e?.recordType);
    }
  }

  onCloseExportFileModal(e: any) {
    this.showExportModal = false;
    if (e.isExcel) {
      this.downloadAsExcel();
    }
    if (e.isPdf) {
      this.downloadAsPDF();
    }
  }

  uploadFile(file: any, recordType: any) {
    const currentUser = this.localStorgaeService.readStorage('currentUser');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', currentUser?.id);
    formData.append('recordType', recordType);
    this.leadService.uploadFile(formData).then(
      () => {
        this.toastService.success(
          'File upload under process and an Email will be sent once it is completed'
        );
        this.uploadForm.patchValue({ file: '' });
        this.loadLeads(
          0,
          this.initialLoadCount,
          this.leadFilter.statusFilter,
          this.leadFilter.sourceFilter,
          this.searchedValue,
          this.leadFilter.selectedLeadTag,
          this.startDateValLoad,
          this.endDateValLoad
        );
      },
      () => {
        this.toastService.error('Unable to upload file.');
      }
    );
  }

  downloadAsExcel() {
    this.userList = [];
    const leadIds = this.selectedRows.map((o) => o.id);
    this.leadService.getLeadList(leadIds).then((data: any) => {
      this.leadList = data;

      this.leadList.forEach((data1) => {
        // let temp = {};
        let temp: DynamicObject = {};

        // const temp = [

        temp = {
          Id: data1.id,
          'First Name': data1.firstName,
          'Last Name': data1.lastName,
          Email: data1.Email,
          'Phone Number': data1['Phone Number'],
          // 'Lead Status': data1.leadStatus,
          Gender: data1.Gender,
          Symptoms: this.getSymptoms(data1.Symptoms)
          // 'Lead Source': data1.leadSource,
          // 'Landing Page': data1.landingPage,
          // 'Lead tags': this.getTags(data1.tag),
          // 'Created Date': this.formatTimeService.formatTime(data1.createdAt)
        };

        Object.keys(data1).forEach((key) => {
          switch (key) {
            case 'id':
              break;
            case 'Phone Number':
              break;
            case 'firstName':
              break;
            case 'lastName':
              break;
            case 'email':
              break;
            case 'gender':
              break;
            case 'leadStatus':
              break;
            case 'leadSource':
              break;
            case 'landingPage':
              break;
            case 'Symptoms':
              break;
            case 'tag':
              break;
            case 'createdAt':
              break;
            case 'fullName':
              break;
            default:
              temp[key] = data1[key];
          }
        });

        Object.keys(data1).forEach((key) => {
          switch (key) {
            case 'leadStatus':
              temp[key] = data1[key];
              break;
            case 'leadSource':
              temp[key] = data1[key];
              break;
            case 'landingPage':
              temp[key] = data1[key];
              break;
            case 'tag':
              temp[key] = data1[key];
              break;
            case 'createdAt':
              temp[key] = this.formatTimeService.formatTime(data1.createdAt);
              break;
            default:
              break;
          }
        });

        this.userList.push(temp);

        // this.userList.push(temp);
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userList);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'leadList.xls');
    });
    this.selectedRows = [];
  }

  getTags(tags: any): string {
    if (tags && tags.length > 0) {
      return tags?.map((data: any) => data?.tag?.name).join(',');
    }
    return '';
  }

  filterByValues(data: any) {
    if (this.leadFilter.statusFilter) {
      data = data.filter(
        (object: any) => object.leadStatus == this.leadFilter.statusFilter
      );
    }
    if (this.leadFilter.sourceFilter) {
      data = data.filter(
        (object: any) => object.leadSource == this.leadFilter.sourceFilter
      );
    }
    if (this.leadFilter.selectedLeadTag) {
      data = data.filter((object: any) =>
        object.tag
          .map((tagObj: any) => tagObj.tag.name)
          .includes(this.leadFilter.selectedLeadTag)
      );
    }
    return data;
  }

  getSymptoms(data: any) {
    let symptomStr = '';
    if (data) {
      console.log(data);
      if (this.isJsonString(data)) {
        data = JSON.parse(data);
        for (const key in data) {
          if (symptomStr.length > 0) {
            symptomStr = symptomStr + '\n' + key + ':' + data[key].toString();
          } else {
            symptomStr = key + ':' + data[key].toString();
          }
        }
      } else {
        return data;
      }
    }
    return symptomStr;
  }

  isJsonString(str: any) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  onDoubleClick(feildName: any, index: any, data: any) {
    this.isSingleClick = false;
    // this.inlineEditLeadObj[feildName].nativeElement.focus();
    console.log(feildName, index, data);
    this.inlineLeadUtils.feildName = feildName;
    this.inlineLeadUtils.isEdit = true;
    this.inlineLeadUtils.currentRowIndex = index;
    this.inlineEditLeadObj['id'] = data.id;
    this.inlineEditLeadObj['name'] = data.fullName;
    this.inlineEditLeadObj['email'] = data.Email;
    this.inlineEditLeadObj['phoneNumber'] = data['Phone Number'];
    this.inlineEditLeadObj['amount'] = data['amount'];
    this.inlineEditLeadObj['leadStatus'] = data['leadStatus'];
    setTimeout(() => {
      this.inputFeild.nativeElement.focus();
    }, 100);
  }

  onEditInlineLead() {
    console.log(this.inlineEditLeadObj, this.inlineLeadUtils);
    if (this.inlineLeadUtils.isInputChanged) {
      /* ----------------------------- NAME VALIDATIOn ---------------------------- */
      if (this.inlineLeadUtils.feildName === 'fullName') {
        if (this.inlineEditLeadObj.name) {
          this.saveInlineEdit(false);
        } else {
          this.toastService.error('Please enter a valid name');
        }
      }
      /* ---------------------------- EMAIL VALIDATION ---------------------------- */
      if (this.inlineLeadUtils.feildName === 'Email') {
        if (
          /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(
            this.inlineEditLeadObj.email
          )
        ) {
          this.saveInlineEdit(false);
        } else {
          this.toastService.error('Please enter a valid email');
        }
      }

      /* ---------------------------- PHONE VALIDATION ---------------------------- */
      if (this.inlineLeadUtils.feildName === 'Phone Number') {
        if (
          this.inlineEditLeadObj?.phoneNumber.match(/^\d+$/) &&
          this.inlineEditLeadObj?.phoneNumber.length == 10
        ) {
          this.saveInlineEdit(false);
        } else {
          this.toastService.error('Please enter a valid Phone Number');
        }
      }

      /* ---------------------------- AMOUNT VALIDATION ---------------------------- */
      if (this.inlineLeadUtils.feildName === 'amount') {
        if (this.inlineEditLeadObj?.amount.match(/^\d+$/)) {
          this.saveInlineEdit(true);
        } else {
          this.toastService.error('Please enter a valid amount');
        }
      }

      if (this.inlineLeadUtils.feildName === 'leadStatus') {
        this.saveInlineEdit(false);
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
  saveInlineEdit(isPhoneNo: boolean) {
    const formData: any = {};
    formData.name = this.inlineEditLeadObj.name;
    formData.email = this.inlineEditLeadObj.email;
    formData.phoneNumber = this.inlineEditLeadObj.phoneNumber;
    formData.leadStatus = this.inlineEditLeadObj.leadStatus;
    const amount = this.inlineEditLeadObj.amount ?? 0;
    if (isPhoneNo) {
      this.leadService
        .editAmountForLead(amount, this.inlineEditLeadObj.id)
        .then(() => {
          this.toastService.success('Lead Edited successfully !');
          this.loadLeads(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord,
            this.leadFilter.statusFilter,
            this.leadFilter.sourceFilter,
            this.searchedValue,
            this.leadFilter.selectedLeadTag,
            this.startDateValLoad,
            this.endDateValLoad
          );
        })
        .catch(() => {
          this.toastService.error('Error while editing leads !');
        });
    } else {
      this.leadService
        .editInlineLead(formData, this.inlineEditLeadObj.id)
        .then(() => {
          this.toastService.success('Lead Edited successfully !');
          this.loadLeads(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord,
            this.leadFilter.statusFilter,
            this.leadFilter.sourceFilter,
            this.searchedValue,
            this.leadFilter.selectedLeadTag,
            this.startDateValLoad,
            this.endDateValLoad
          );
        })
        .catch(() => {
          this.toastService.error('Error while editing leads !');
        });
    }
  }

  openConvertLeadModal = () => (this.showConvertLeadModal = true);
  hideConvertLeadModal = () => (this.showConvertLeadModal = false);
  openOnboardedLeadModal = () => (this.showOnboardedLeadModal = true);
  hideOnboarderLeadModal = () => (this.showOnboardedLeadModal = false);

  // convertToPatient() {
  //   const leadIds: any = this.selectedRows.map((o) => o.id);
  //   for (let i = 0; i < leadIds.length; i++) {
  //     this.leadService.leadToPatient(leadIds[i]).then(
  //       (response: any) => {
  //         if (response.statusCode == 200) {
  //           this.loadLeads(
  //             this.paginatorConfig.currentPage,
  //             this.paginatorConfig.noOfRecord,
  //             this.leadFilter.statusFilter,
  //             this.leadFilter.sourceFilter,
  //             this.searchedValue,
  //             this.leadFilter.selectedLeadTag
  //           );
  //           this.toastService.success('Converted to patient successfully');
  //         } else if (response.statusCode == 500) {
  //           this.toastService.error(response.message);
  //         }
  //       },
  //       () => {
  //         this.toastService.error(
  //           'Unable to convert to patient. Patient/User already exists'
  //         );
  //       }
  //     );
  //   }
  //   this.selectedRows = [];
  //   this.hideConvertLeadModal();
  // }

  convertToPatient() {
    const leadIds: any = this.selectedRows.map((o) => o.id);
    let successfulConversions = 0;
    let errorOccurred = false;

    const conversionPromises = leadIds.map((leadId: any) =>
      this.leadService.leadToPatient(leadId).then(
        (response: any) => {
          if (response.statusCode == 200) {
            this.selectedRows = [];
            successfulConversions++;
          } else if (response.statusCode == 500) {
            errorOccurred = true;
          }
        },
        () => {
          errorOccurred = true;
        }
      )
    );

    Promise.all(conversionPromises).then(() => {
      if (successfulConversions > 0) {
        this.loadLeads(
          this.paginatorConfig.currentPage,
          this.paginatorConfig.noOfRecord,
          this.leadFilter.statusFilter,
          this.leadFilter.sourceFilter,
          this.searchedValue,
          this.leadFilter.selectedLeadTag,
          this.startDateValLoad,
          this.endDateValLoad
        );
        this.toastService.success('Converted to patient successfully');
      }
      if (errorOccurred) {
        this.toastService.error(
          'Unable to convert to patient. Patient/User already exists'
        );
      }

      this.selectedRows = [];
      this.hideConvertLeadModal();
    });
  }

  convertToOnboarded() {
    const leadIds: any = this.selectedRows.map((o) => o.id);
    let successfulConversions = 0;
    let errorOccurred = false;

    const conversionPromises = leadIds.map((leadId: any) =>
      this.leadService.leadToOnboard(leadId).then(
        (response: any) => {
          if (response.statusCode == 200) {
            this.selectedRows = [];
            successfulConversions++;
          } else if (response.statusCode == 500) {
            errorOccurred = true;
          }
        },
        () => {
          errorOccurred = true;
        }
      )
    );

    Promise.all(conversionPromises).then(() => {
      if (successfulConversions > 0) {
        this.loadLeads(
          this.paginatorConfig.currentPage,
          this.paginatorConfig.noOfRecord,
          this.leadFilter.statusFilter,
          this.leadFilter.sourceFilter,
          this.searchedValue,
          this.leadFilter.selectedLeadTag,
          this.startDateValLoad,
          this.endDateValLoad
        );
        this.toastService.success('Onboarede successfully');
      }
      if (errorOccurred) {
        this.toastService.error('Unable to Onboard');
      }

      this.selectedRows = [];
      this.hideOnboarderLeadModal();
    });
  }

  downloadAsPDF() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const dataArray = new Array();
    console.log();
    const selectedIds = this.selectedRows.map((o) => o.id);
    this.leadService.getLeadList(selectedIds).then((data: any) => {
      this.leadList = data;

      this.leadList.forEach((data1) => {
        console.log(data1);
        const temp = [
          data1.id,
          data1.firstName,
          data1.lastName,
          data1.Email,
          data1['Phone Number'],
          // data.Message,
          data1.leadStatus,
          data1.Gender,
          // data.Symptoms,
          data1.leadSource,
          data1.landingPage,
          this.getTags(data1.tag),
          this.formatTimeService.formatTime(data1.createdAt)
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
          // 'Message',
          'Lead Status ',
          'Gender',
          // 'Symptoms',
          'Lead Source',
          'Landing Page',
          'Lead tags',
          'Created Date'
        ]
      ];

      autoTable(doc, {
        head: columns,
        body: dataArray,
        theme: 'grid',
        headStyles: { fillColor: [128, 128, 128] }
      });
      // doc.text('Leads List', 140, 10, { align: 'center' });
      doc.setTextColor(0);
      doc.save('LeadList.pdf');
    });
    this.selectedRows = [];
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

  searchLead() {
    this.loadLeads(
      0,
      this.initialLoadCount,
      this.leadFilter.statusFilter,
      this.leadFilter.sourceFilter,
      this.searchedValue,
      this.leadFilter.selectedLeadTag,
      this.startDateVal,
      this.endDateVal
    );
  }

  resetSearchh() {
    this.searchedValue = '';
    this.loadLeads(
      0,
      this.initialLoadCount,
      this.leadFilter.statusFilter,
      this.leadFilter.sourceFilter,
      this.searchedValue,
      this.leadFilter.selectedLeadTag,
      this.startDateVal,
      this.endDateVal
    );
  }

  // updateLeadStatus(status: string) {
  //   const leadIds = this.selectedRows.map((o) => o.id);
  //   if (leadIds.length === 0) {
  //     this.toastService.error('Select a Lead to update Lead status');
  //     return;
  //   }
  //   this.leadService.updateMassLeadStatus(leadIds, status).then(
  //     () => {
  //       this.toastService.success('Lead status updated successfully');
  //       this.selectedRows = [];
  //       this.loadLeads(
  //         0,
  //         this.initialLoadCount,
  //         this.leadFilter.statusFilter,
  //         this.leadFilter.sourceFilter,
  //         this.searchedValue,
  //         this.leadFilter.selectedLeadTag,
  //         this.startDateValLoad,
  //         this.endDateValLoad
  //       );
  //     },
  //     () => {
  //       this.toastService.error('Error while updating mass lead status');
  //     }
  //   );
  // }

  updateLeadStatus(status: string) {
    const leadIds = this.selectedRows.map((o) => o.id);
    if (leadIds.length === 0) {
      this.toastService.error('Select a Lead to update Lead status');
      return;
    }

    // Store the current page before the update
    const prevPage = this.paginatorConfig.currentPage;

    // Update the lead status
    this.leadService.updateMassLeadStatus(leadIds, status).then(
      () => {
        this.toastService.success('Lead status updated successfully');

        // Reload data for the current page after the update
        this.loadLeads(
          prevPage, // Use the stored current page
          this.paginatorConfig.noOfRecord,
          this.leadFilter.statusFilter,
          this.leadFilter.sourceFilter,
          this.searchedValue,
          this.leadFilter.selectedLeadTag,
          this.startDateValLoad,
          this.endDateValLoad
        );

        // Clear selected rows after the update
        this.selectedRows = [];
      },
      () => {
        this.toastService.error('Error while updating mass lead status');
      }
    );
  }

  addLeadTags() {
    const leadIds = this.selectedRows.map((o) => o.id);
    if (leadIds.length > 0) {
      this.showTagModal = true;
    } else {
      this.toastService.error('Please select the leads');
    }
  }

  modalTagClosed(event: any) {
    const leadIds = this.selectedRows.map((o) => o.id);

    this.showTagModal = false;
    if (event?.close == false && leadIds?.length > 0) {
      const data = { tags: event?.selectedTags, leadId: leadIds };
      this.leadService.assignMultipleTagsToLead(data).then(
        () => {
          this.selectedRows = [];
          this.toastService.success('Lead with Tags updated successfully');
        },
        () => {
          this.toastService.error('Error while updating tags');
        }
      );
    }
  }

  onLeadtagChange(event: any) {
    this.leadTagFilterVal = event.name;
    this.onLeadFilterSelection({
      sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: event.name,
      endDate: this.endDateVal,
      startDate: this.startDateVal
    });
    console.log('189 on chnge', event.name);
  }

  onLeadtagChangeForMultiSelect(e: any) {
    console.log(e);
    this.leadTagFilterVal = e.value.join(',');
    this.onLeadFilterSelection({
      sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: this.leadTagFilterVal,
      endDate: this.endDateVal,
      startDate: this.startDateVal
    });
  }

  filterByStatus(filter: any) {
    const sourceFilter = this.sourceFilterValue;

    if (this.filterCount.statusFilterCount >= 1) {
      this.filterArray.filter((obj: any) => obj.filterBy != 'status');
      this.filterCount.statusFilterCount = 0;
    }

    if (filter == 'All') {
      this.statusFilter = '';
      this.sourceFilterValue = sourceFilter;
      this.filterCount.statusFilterCount = 0;
      this.onLeadFilterSelection({
        sourceFilter: this.sourceFilterValue,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal,
        endDate: this.endDateVal,
        startDate: this.startDateVal
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
      this.onLeadFilterSelection({
        sourceFilter: this.sourceFilterValue,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal,
        endDate: this.endDateVal,
        startDate: this.startDateVal
      });
    }
  }

  // Method to filter data by date starts

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
    // console.log("SELECTED VALUE: ", dateValue);

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
    console.log(this.startDateVal, this.endDateVal);
    this.onLeadFilterSelection({
      sourceFilter: this.sourceFilterValue,
      statusFilter: this.statusFilter,
      selectedLeadTag: this.leadTagFilterVal,
      startDate: this.startDateVal,
      endDate: this.endDateVal
    });
  }

  // Method to filter data by date ends

  filterBySource(filter: any) {
    const statusFilter = this.statusFilter;
    console.log(this.leadTagFilter, this.statusFilter, this.filterArray);

    if (this.filterCount.sourceFilterCount >= 1) {
      this.filterArray.filter((obj: any) => obj.filterBy != 'source');
      this.filterCount.sourceFilterCount = 0;
    }

    if (filter == 'All') {
      this.sourceFilterValue = '';
      this.statusFilter = statusFilter;
      this.onLeadFilterSelection({
        sourceFilter: this.sourceFilterValue,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal,
        endDate: this.endDateVal,
        startDate: this.startDateVal
      });
    } else {
      const filterObj = {
        filter: filter,
        filterBy: 'source'
      };
      this.filterArray.push(filterObj);
      this.filterCount.sourceFilterCount++;
      this.isFilterByStatus = false;
      this.filter = filter;
      if (filter == 'All') {
        this.filter = filter;
      }

      this.onLeadFilterSelection({
        sourceFilter: filter,
        statusFilter: this.statusFilter,
        selectedLeadTag: this.leadTagFilterVal,
        endDate: this.endDateVal,
        startDate: this.startDateVal
      });
    }
  }
}
