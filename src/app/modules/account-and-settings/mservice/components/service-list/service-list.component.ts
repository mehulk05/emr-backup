/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceList } from 'src/app/shared/models/services/OptimizedService';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MService } from '../../service/mservice.service';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css']
})
export class ServiceListComponent implements OnInit {
  showModal: boolean = false;
  showEditServiceModal: boolean = false;
  modalData: any;
  first = 0;
  serviceIdsToDelete: any = [];
  rows = 100;
  globalFilterColumn = [
    'id',
    'name',
    'categoryName',
    'createdBy',
    'createdAt',
    'updatedAt',
    'updatedBy'
  ];
  columns = [
    { header: '', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'name', field: 'name' },
    { header: 'Category Name', field: 'categoryName' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: ServiceList[] = [];
  userId: any;
  isDtInitialized: boolean = false;
  tableHtml: any;

  constructor(
    private mservice: MService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.LoadServices();
  }

  LoadServices() {
    this.mservice
      .getAllServices()
      .then((data: any) => {
        this.rowData = data.serviceList;
        if (this.rowData[0]?.position) {
          this.rowData.sort(function (a: any, b: any) {
            return a.position - b.position;
          });
        } else {
          const row = this.rowData.map((obj, index) => ({
            ...obj,
            position: index
          }));
          this.rowData = row;
        }
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Patients');
      });
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

  editService(id: Number) {
    this.router.navigate(['/services/' + id + '/edit']);
  }

  deleteServiceModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Service';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    this.showEditServiceModal = false;
    if (e.isDelete) {
      if (this.modalData?.id) {
        this.serviceIdsToDelete = [];
      }
      if (this.serviceIdsToDelete.length > 0) {
        this.deleteSelectedServices();
      } else {
        this.deleteService(this.modalData.id);
      }
    }
  }

  deleteSelectedServices() {
    if (this.serviceIdsToDelete.length > 0) {
      this.mservice.deleteMassServices(this.serviceIdsToDelete).then(
        () => {
          this.toastMessageService.success('Services deleted successfully.');

          this.serviceIdsToDelete = [];
          this.LoadServices();
        },
        () => {
          this.toastMessageService.error('Error Deleting Services');
        }
      );
    } else {
      this.toastMessageService.error('Select a Service to delete Service.');
    }
  }

  deleteService(id: any) {
    this.mservice.deleteService(id).then(
      () => {
        this.rowData = [];
        this.toastMessageService.success('Service is deleted successfully');
        this.LoadServices();
      },
      () => {
        this.toastMessageService.error(
          'This service is associated with appointments. Please change those appointments to delete this service'
        );
      }
    );
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  selectServices(id: any, event: any) {
    if (event.target.checked) {
      this.serviceIdsToDelete.push(id);
    } else {
      this.serviceIdsToDelete = this.serviceIdsToDelete.filter(
        (item: any) => item !== id
      );
    }
  }

  deleteAllSelectedTemplateModal() {
    if (this.serviceIdsToDelete.length === 0) {
      this.toastMessageService.error('Select a Service to delete Service');
      return;
    }
    this.modalData = {};
    this.showModal = true;
    this.modalData.feildName = 'all selected services';
    this.modalData.titleName = 'All Selected Services';
    this.modalData.count = this.serviceIdsToDelete.length;
    this.modalData.moduleName =
      'Service' + (this.serviceIdsToDelete.length > 1 ? 's' : '');
  }

  onDrop(e: any, index: any) {}

  dragEnd() {}

  moveDownMenu(menu: any) {
    let currentIndex = 0;
    for (let i = 0; i < this.rowData.length; i++) {
      if (menu.id == this.rowData[i].id) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex == this.rowData.length - 1) {
      // nothing to do
    } else {
      moveItemInArray(this.rowData, currentIndex, currentIndex + 1);
      this.updateRow();
    }
    // console.table(this.rowData);
  }

  moveUpMenu(menu: any) {
    let currentIndex = 0;
    for (let i = 0; i < this.rowData.length; i++) {
      if (menu.id == this.rowData[i].id) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex == 0) {
      // nothing to do
    } else {
      moveItemInArray(this.rowData, currentIndex, currentIndex - 1);
      this.updateRow();
    }
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // const row = this.rowData;
    // this.rowData = [];
    for (let i = 0; i < event.container.data.length; i++) {
      this.rowData[i].position = i;
    }
    setTimeout(() => {
      this.updateRow();
    });
  }

  updateRow() {
    const menus = this.rowData.map((item: any, index: number) => ({
      ...item,
      position: index
    }));
    this.mservice.updateTableList(menus).then(
      (data) => {},
      (e) => {}
    );
  }
}
