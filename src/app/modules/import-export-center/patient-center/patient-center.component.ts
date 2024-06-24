import { Component, OnInit } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../pateint/services/patient.service';

@Component({
  selector: 'app-patient-center',
  templateUrl: './patient-center.component.html',
  styleUrls: ['./patient-center.component.css']
})
export class PatientCenterComponent implements OnInit {
  showExcelModal = false;
  fileExcel: File;
  excelColumns = [
    'first name',
    'last name',
    'email',
    'phone',
    'gender',
    'dob(mm-dd-yyyy)',
    'patient tags',
    'notes',
    'status'
  ];
  mendatoryColunms = ['first name', 'last name', 'email', 'phone'];
  resetFileUploadInput = true;

  historyConfig: any = {
    itemsPerPage: 10,
    currentPage: 0,
    id: 12,
    totalItems: 0
  };

  uploadHistories: any[] = [];

  constructor(
    public patientService: PatientService,
    public fileSaverService: FileSaverService,
    public alertService: ToasTMessageService,
    private localStorgaeService: LocalStorageService,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit() {
    this.getHistoryCountRecords();
    this.getHistoryRecords(this.historyConfig);
  }

  fileUpdate(file: any) {
    this.showExcelModal = true;
    this.fileExcel = file;
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
      },
      () => {
        this.toastMessageService.error('Unable to upload file.');
      }
    );
  }

  downloadFile() {
    this.patientService
      .downloadPatientsExcel('', '', [])
      .then((data: any) => {
        this.fileSaverService.save(data, 'patient.xlsx');
      })
      .catch(() => {
        this.alertService.error('Unable to download patient xlsx.');
      });
  }

  downloadAsPdf() {
    this.patientService
      .downloadPatientsPdf('', '', [])
      .then((data: any) => {
        this.fileSaverService.save(data, 'patient.pdf');
      })
      .catch(() => {
        this.alertService.error('Unable to download patient pdf.');
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
    this.uploadFile(this.fileExcel);
    this.fileExcel = null;
    this.resetFileUploadInput = !this.resetFileUploadInput;
  }

  getHistoryCountRecords() {
    this.patientService
      .getHistoryCountRecords('PATIENT')
      .then((data: any) => {
        this.historyConfig.totalItems = data;
      })
      .catch(() => {
        this.toastMessageService.error('Unable to get API details');
      });
  }

  getHistoryRecords(config: any) {
    this.patientService
      .getHistoryRecords('PATIENT', config.currentPage, config.itemsPerPage)
      .then((data: any) => {
        this.uploadHistories = data;
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastMessageService.error('Unable to get API details');
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
