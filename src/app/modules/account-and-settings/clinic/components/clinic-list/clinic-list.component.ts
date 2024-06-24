import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClinicList } from 'src/app/shared/models/clinics/optimizedClinic';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../services/clinic.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-clinic-list',
  templateUrl: './clinic-list.component.html',
  styleUrls: ['./clinic-list.component.css']
})
export class ClinicListComponent implements OnInit {
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'createdBy',
    'createdAt',
    'updatedAt',
    'updatedBy'
  ];
  columns = [
    { header: 'Default', field: 'isDefault' },
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },

    { header: 'Created Date', field: 'createdAt' },
    { header: 'Created By', field: 'createdBy' },

    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: ClinicList[] = [];
  userId: any;
  isDtInitialized: boolean = false;
  tableHtml: any;
  showModal: boolean = false;
  modalData: any;
  isDef: boolean = false;
  data: any;

  constructor(
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private clinicService: ClinicService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadClinics();
  }

  loadClinics() {
    this.clinicService
      .getClinics()
      .then((data: any) => {
        this.rowData = data;
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Clnics');
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

  editClinic(id: Number) {
    this.router.navigate(['/clinics/' + id + '/edit']);
  }

  updateClinic(id: any) {
    for (var i = 0; i < this.rowData.length; i++) {
      console.log('id = ' + id);
      if (this.rowData[i].id === id) {
        this.clinicService
          .updateDefaultClinic(this.rowData[i].id, true)
          .then((data) => {
            this.localStorageService.storeItem('defaultClinic', data);
            // console.log(data);
          })
          .catch(() => {
            this.toastMessageService.error('Unable to update Clinic.');
          });
      } else {
        this.clinicService
          .updateDefaultClinic(this.rowData[i].id, false)
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          .then(() => {})
          .catch(() => {
            this.toastMessageService.error('Unable to update Clinic.');
          });
      }
    }
    setTimeout(() => {
      this.loadClinics();
    }, 500);
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  deleteTemplateModal(data: any) {
    this.data = data;
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.fullName;
    this.modalData.titleName = 'Clinic';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.DeleteClinic(this.modalData.id, this.data);
    }
  }

  DeleteClinic(id: any, clinic?: any) {
    this.modalData = clinic;
    this.showModal = true;
    this.clinicService.getSingleClinic(id).then(
      (res: any) => {
        this.isDef = res.isDefault;
        if (this.isDef === true) {
          this.toastMessageService.error(
            'This is default Clinic.Change the default to another clinic first'
          );
        } else {
          if (clinic) {
            if (
              new Date(clinic.appointmentDate).getTime() > new Date().getTime()
            ) {
              this.toastMessageService.error(
                'There are Appointments associated with this clinic.'
              );
            } else {
              this.clinicService.deleteClinic(id).then(
                () => {
                  this.loadClinics();
                  this.toastMessageService.success(
                    'Clinic deleted successfully.'
                  );
                },
                () => {
                  this.toastMessageService.error('Unable to delete Clinic.');
                }
              );
            }
          } else {
            this.clinicService.deleteClinic(id).then(
              () => {
                this.loadClinics();
                this.toastMessageService.success(
                  'Clinic deleted successfully.'
                );
              },
              () => {
                this.toastMessageService.error('Unable to delete Clinic.');
              }
            );
          }
        }
      },
      () => {
        this.toastMessageService.error('Unable to get Clinic.');
      }
    );
  }
}
