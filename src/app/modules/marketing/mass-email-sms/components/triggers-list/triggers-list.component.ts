import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

import { TriggersService } from '../../services/triggers.service';

@Component({
  selector: 'app-triggers-list',
  templateUrl: './triggers-list.component.html',
  styleUrls: ['./triggers-list.component.css']
})
export class TriggersListComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  modalMessage: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'moduleName',
    'triggerActionName',
    'triggerConditions',
    'status',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Trigger Name', field: 'name' },
    { header: 'Source', field: 'triggerActionName' },
    { header: 'Module', field: 'moduleName' },
    { header: 'Status', field: 'status' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  constructor(
    private triggerService: TriggersService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadTemplatList();
  }

  loadTemplatList() {
    this.triggerService.getTriggerList().then(
      (data: any) => {
        this.rowData = data;
        this.rowData.forEach(function (value) {
          if (value.triggerActionName === '') {
            value.triggerActionName = value.triggerConditions;
          }
        });
      },
      () => {
        this.toastMessageService.error('Unable to load email template.');
      }
    );
  }

  createTrigger() {
    this.router.navigateByUrl('/triggers/create');
  }

  editTemplate(id: any) {
    this.router.navigate(['triggers', id]);
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalMessage =
      'If you delete an active trigger all your work will be deleted. Also, any active leads on this trigger will not get any communication from here on.';
    this.modalData.titleName = 'Trigger';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.triggerService
      .deleteTemplate(id)
      .then(() => {
        this.toastMessageService.success('Trigger deleted successfully');
        this.loadTemplatList();
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting template');
      });
  }

  onCheckBoxChange(e: any, data: any) {
    var status = '';
    if (data.status == 'ACTIVE') {
      status = 'INACTIVE';
    } else {
      status = 'ACTIVE';
    }

    this.triggerService.updateTriggerStatus(data.id, status).then(() => {
      var alertMessage = '';
      if (status == 'ACTIVE') {
        alertMessage = 'Trigger enabled successfully';
      } else {
        alertMessage = 'Trigger disabled successfully';
      }
      this.loadTemplatList();
      this.toastMessageService.success(alertMessage);
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
