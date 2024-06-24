import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../services/patient.service';
import moment from 'moment';
@Component({
  selector: 'app-patient-task',
  templateUrl: './patient-task.component.html',
  styleUrls: ['./patient-task.component.css']
})
export class PatientTaskComponent implements OnChanges {
  @Input() patientId: any;
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'moduleName',
    'Priority',
    'status',
    'createdAt',
    'updatedAt',
    'userName',
    'deadLine'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Task Name', field: 'name' },
    { header: 'Assigned To', field: 'userName' },
    { header: 'Priority', field: 'priority' },
    { header: 'Status', field: 'status' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Deadline', field: 'deadLine' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  userId: any;
  showCreateTaskModal: boolean = false;
  constructor(
    private patientService: PatientService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnChanges(): void {
    if (this.patientId) {
      this.loadTemplatList();
    }
  }

  loadTemplatList() {
    this.patientService.getPatientTask(this.patientId).then(
      (data: any) => {
        this.rowData = data?.taskDTOList;
      },
      () => {
        this.toastMessageService.error('Unable to load Tasks');
      }
    );
  }

  createeSmsTemplate() {
    this.showCreateTaskModal = true;
  }

  editTask(id: any) {
    this.router.navigate(['/tasks', id, 'edit'], {
      queryParams: { from: 'task' }
    });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Task';
  }

  onCloseModal(e: any) {
    console.log('e', e);
    this.showModal = false;
    this.showCreateTaskModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
    console.log(e);
    if (e.isSaved) {
      this.loadTemplatList();
    }
  }

  deleteTemplate(id: any) {
    this.patientService
      .deleteTask(id)
      .then(() => {
        this.toastMessageService.success('Task Deleted Successfully');
        this.loadTemplatList();
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting Task');
      });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  formatDate(date: string) {
    const momentDate = moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utc(); // Parse in UTC
    const formattedDate = momentDate.format('MMM DD YYYY');
    return formattedDate;
  }
}
