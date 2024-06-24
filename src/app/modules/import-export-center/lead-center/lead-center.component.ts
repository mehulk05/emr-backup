import { Component, OnInit } from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { LeadsService } from '../../leads/service/leads.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-lead-center',
  templateUrl: './lead-center.component.html',
  styleUrls: ['./lead-center.component.css']
})
export class LeadCenterComponent implements OnInit {
  showImportModal: boolean = false;
  showExportModal: boolean = false;
  leadIdsToDelete: any = [];
  leadList: any[] = [];
  userList: any[] = [];
  uploadForm: FormGroup;
  showExcelModal = false;
  resetFileUploadInput = false;
  fileExcel: File;
  excelColumns = [
    'first name',
    'last name',
    'email',
    'phone',
    'message',
    'lead status',
    'lead tags',
    'notes'
  ];
  mendatoryColunms = ['first name', 'last name', 'email', 'phone'];
  columns = [
    { header: 'File Name', field: 'fileName' },
    { header: 'Added', field: 'added' },
    { header: 'Skipped', field: 'skipped' },
    { header: 'Updated', field: 'updated' },
    { header: 'Created Date', field: 'createdBy' },
    { header: 'Created By', field: 'createdAt' }
  ];
  rowData: any[] = [];

  historyConfig: any = {
    itemsPerPage: 10,
    currentPage: 0,
    id: 8,
    totalItems: 0
  };

  uploadHistories: any[] = [];

  constructor(
    private leadService: LeadsService,
    public formatTimeService: FormatTimeService,
    public formBuilder: FormBuilder,
    private localStorgaeService: LocalStorageService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.formBuilder.group({
      file: ['', [Validators.required]]
    });
    this.getHistoryCountRecords();
    this.getHistoryRecords(this.historyConfig);
  }

  openImportFile() {
    this.showImportModal = true;
  }

  openExportFile() {
    this.showExportModal = true;
  }

  onCloseExportFileModal(e: any) {
    this.showExportModal = false;
    if (e.isExcel) {
      this.downloadAsExcel();
    }
    if (e.isPdf) {
      this.downloadAsPdf();
    }
  }

  onCloseImportFileModal(e: any) {
    console.log('cls', e.isImport);
    this.showImportModal = false;
    if (e.isImport) {
      this.uploadFile(e.isImport, e?.recordType);
    }
    this.resetFileUploadInput = true;
  }

  fileUpdate(file: any) {
    this.showExcelModal = true;
    this.fileExcel = file;
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
      },
      () => {
        this.toastService.error('Unable to upload file.');
      }
    );
  }

  downloadAsExcel() {
    console.log();
    this.leadService.getLeadList(this.leadIdsToDelete).then((data: any) => {
      this.leadList = data;

      this.leadList.forEach((data1) => {
        console.log(data1);
        let temp = {};
        // const temp = [
        temp = {
          Id: data1.id,
          'First Name': data1.firstName,
          'Last Name': data1.lastName,
          Email: data1.Email,
          'Phone Number': data1['Phone Number'],
          // data.Message,
          'Lead Status': data1.leadStatus,
          Gender: data1.Gender,
          Symptoms: this.getSymptoms(data1.Symptoms),
          'Lead Source': data1.leadSource,
          'Landing Page': data1.landingPage,
          'Lead tags': this.getTags(data1.tag),
          // "Created":new Date(Date.parse(data1.createdAt)).toLocaleString('en-US', {
          //   timeZone: 'US/Mountain'
          // })
          'Created Date': this.formatTimeService.formatTime(data1.createdAt)
        };
        this.userList.push(temp);
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userList);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, 'leadList.xls');
      this.leadIdsToDelete = [];
    });
  }

  getTags(tags: any): string {
    if (tags && tags.length > 0) {
      return tags?.map((data: any) => data?.tag?.name).join(',');
    }
    return '';
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

  downloadAsPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');
    const dataArray = new Array();
    console.log();
    this.leadService.getLeadList(this.leadIdsToDelete).then((data: any) => {
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
  }

  modalClosed(event: any) {
    console.log(event);
    this.showExcelModal = false;
    this.fileExcel = null;
    this.resetFileUploadInput = !this.resetFileUploadInput;
  }

  uploadModel(event: any) {
    console.log(event);
    this.showExcelModal = false;
    this.uploadFile(this.fileExcel, event?.recordType);
    this.fileExcel = null;
    this.resetFileUploadInput = !this.resetFileUploadInput;
  }

  getHistoryCountRecords() {
    this.leadService
      .getHistoryCountRecords('LEAD')
      .then((data: any) => {
        this.historyConfig.totalItems = data;
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  getHistoryRecords(config: any) {
    this.leadService
      .getHistoryRecords('LEAD', config.currentPage, config.itemsPerPage)
      .then((data: any) => {
        this.uploadHistories = data;
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastService.error('Unable to get API details');
      });
  }

  formatTimeInData() {
    this.uploadHistories.map((data, i) => {
      this.uploadHistories[i].createdAt = this.formatTimeService.formatTime(
        data.createdAt
      );
    });
  }

  pageChanged(event: any) {
    this.historyConfig.currentPage = event;
    const pageConfig: any = { ...this.historyConfig };
    pageConfig.currentPage = event - 1;
    console.log(pageConfig, this.historyConfig);
    this.getHistoryRecords(pageConfig);
  }
}
