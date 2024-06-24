import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { QuestionarieService } from '../../services/questionarie.service';

@Component({
  selector: 'app-contact-form-notification-table',
  templateUrl: './contact-form-notification-table.component.html',
  styleUrls: ['./contact-form-notification-table.component.css']
})
export class ContactFormNotificationTableComponent implements OnChanges {
  @Input() questionnaireId: any;
  showModal: boolean = false;
  modalData: any;
  modalMessage: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'notificationType',
    'phoneNumber',
    'messageText',
    'toEmail',
    'moduleName',
    'triggerActionName',
    'triggerConditions',
    'status',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: 'Notification Type', field: 'notificationType' },
    { header: 'Phone Number', field: 'phoneNumber' },
    //     { header: 'SMS Text', field: 'messageText' },
    { header: 'To', field: 'toEmail' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  constructor(
    private router: Router,
    private alertService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private questionnaireService: QuestionarieService
  ) {}

  ngOnChanges(): void {
    if (this.questionnaireId) {
      this.loadTemplatList();
    }
  }
  loadTemplatList() {
    this.questionnaireService
      .fetchQuestionnaireAllNotification(this.questionnaireId)
      .then(
        (response: any) => {
          this.rowData = response;
        },
        () => {
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
  }

  createNotification() {
    this.router.navigate([
      '/clinical-doc/questionnaire/' +
        this.questionnaireId +
        '/notification/create'
    ]);
  }

  editNotification(id: any) {
    this.router.navigate([
      '/clinical-doc/questionnaire/' +
        this.questionnaireId +
        '/notification/edit/' +
        id
    ]);
  }

  editTemplate(id: any) {
    this.router.navigate([
      '/clinical-doc/questionnaire/' +
        this.questionnaireId +
        '/notification/edit/' +
        id
    ]);
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.notificationType;
    this.modalData.titleName = 'Questionnaire Notification';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.questionnaireService
      .deleteQuestionnaireNotification(this.questionnaireId, id)
      .then(
        () => {
          this.loadTemplatList();
          this.alertService.success(
            'Questionnaire Notification deleted successfully.'
          );
        },
        () => {
          this.alertService.error('Unable to Delete the notification');
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
}
