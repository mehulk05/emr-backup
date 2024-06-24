import { Component, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadsService } from '../../service/leads.service';
import moment from 'moment';

@Component({
  selector: 'app-lead-tasks-tab3',
  templateUrl: './lead-tasks-tab3.component.html',
  styleUrls: ['./lead-tasks-tab3.component.css']
})
export class LeadTasksTab3Component implements OnChanges {
  @Input() leadId: any;
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'name',
    'moduleName',
    'priority',
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
  isSingleClick: boolean;
  constructor(
    private leadService: LeadsService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnChanges(): void {
    if (this.leadId) {
      this.loadTemplatList();
    }
  }

  loadTemplatList() {
    this.leadService.getLeadTask(this.leadId).then(
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
    this.leadService
      .deleteTask(id)
      .then(() => {
        this.toastMessageService.success('Task Deleted Successfully');
        this.loadTemplatList();
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting Task');
      });
  }

  formatDate(date: string) {
    const momentDate = moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utc(); // Parse in UTC
    const formattedDate = momentDate.format('MMM DD YYYY');
    return formattedDate;
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
  showTaskDetail(id: any) {
    console.log(id);
    this.isSingleClick = true;
    setTimeout(() => {
      if (this.isSingleClick) {
        this.router.navigate(['/tasks/' + id + '/edit'], {
          queryParams: {
            from: 'task'
          },
          queryParamsHandling: 'merge'
        });
      }
    }, 250);
  }
}
