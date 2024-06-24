import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ConsentPageService } from '../../services/consent-page.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { AppointmentService } from 'src/app/modules/appointment/services/appointment.service';

@Component({
  selector: 'app-consent-list',
  templateUrl: './consent-list.component.html',
  styleUrls: ['./consent-list.component.css']
})
export class ConsentListComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'createdBy',
    'createdAt',
    'updatedBy',
    'updatedAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Consents', field: 'name' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Updated Date', field: 'updatedAt' },

    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  constructor(
    private consentService: ConsentPageService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    public appointmentService: AppointmentService
  ) {}

  ngOnInit(): void {
    this.loadTemplatList();
  }

  loadTemplatList() {
    this.consentService.getAllConsentListOptimizedMyConsent().then(
      (data: any) => {
        this.rowData = data;
      },
      () => {
        this.toastMessageService.error('Unable to load email template.');
      }
    );
  }

  createeSmsTemplate() {
    this.router.navigateByUrl('/clinical-doc/consents/create');
  }

  editTemplate(id: any) {
    this.router.navigate(['/clinical-doc/consents/', id, 'edit']);
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Consent';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.consentService
      .deleteTemplate(id)
      .then(() => {
        this.loadTemplatList();
        this.toastMessageService.success('Consent deleted successfully');
      })

      .catch(() => {
        this.appointmentService
          .getconcentAppoinment(id)
          .then(() => {
            this.toastMessageService.error(
              'To delete this Consent Form,  please remove it from the service attached'
            );
          })
          .catch(() => {
            this.toastMessageService.error(
              'This consent cannot be deleted, as it has been already sent to the patient'
            );
          });
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
