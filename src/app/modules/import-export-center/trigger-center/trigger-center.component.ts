import { Component, OnInit } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../pateint/services/patient.service';
import { TriggerExcelService } from '../trigger-excel.service';

@Component({
  selector: 'app-trigger-center',
  templateUrl: './trigger-center.component.html',
  styleUrls: ['./trigger-center.component.css']
})
export class TriggerCenterComponent implements OnInit {
  showExcelModal = false;
  fileExcel: File;
  excelColumns = ['id', 'name', 'module name'];
  moduleName: any;
  moduleType = [
    { name: 'All', title: 'All' },
    { name: 'Leads', title: 'Leads' },
    { name: 'Patient', title: 'Patient' },
    { name: 'Forms', title: 'Forms' },
    { name: 'Appointment', title: 'Appointment' },
    { name: 'MassLead', title: 'Mass Lead' },
    { name: 'MassPatient', title: 'Mass Patient' }
  ];
  mendatoryColunms = ['id', 'name'];
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
    public formatTimeService: FormatTimeService,
    public triggerService: TriggerExcelService
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

    this.triggerService.uploadFile(formData).then(
      () => {
        this.toastMessageService.success(
          'File upload under process and an Email will be sent once it is completed'
        );
        this.resetFileUploadInput = true;
        this.getHistoryRecords(this.historyConfig);
      },
      () => {
        this.toastMessageService.error('Unable to upload file.');
      }
    );
  }

  downloadFile() {
    if (this.moduleName) {
      const triggerName = this.moduleType.filter(
        (list) => list.title == this.moduleName
      )[0].name;
      const data: any = { type: triggerName, triggerId: [] };
      this.triggerService
        .downloadTriggerExcel(data)
        .then((data: any) => {
          this.moduleName = undefined;
          this.fileSaverService.save(data, 'trigger.xlsx');
        })
        .catch(() => {
          this.alertService.error('Unable to download trigger xlsx.');
        });
    } else {
      this.toastMessageService.error('Please select a trigger type.');
    }
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
      .getHistoryCountRecords('TRIGGER')
      .then((data: any) => {
        this.historyConfig.totalItems = data;
      })
      .catch(() => {
        this.toastMessageService.error('Unable to get API details');
      });
  }

  getHistoryRecords(config: any) {
    this.patientService
      .getHistoryRecords('TRIGGER', config.currentPage, config.itemsPerPage)
      .then((data: any) => {
        this.uploadHistories = data;
        this.resetFileUploadInput = !this.resetFileUploadInput;
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
