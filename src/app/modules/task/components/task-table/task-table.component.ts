import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { TaskService } from '../../services/task.service';
import moment from 'moment';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.css']
})
export class TaskTableComponent implements OnInit {
  @ViewChild('dt1') table: Table;
  @Output() statusChanged = new EventEmitter<any>();
  showModal: boolean = false;
  modalData: any;
  showEditTaskModal: boolean;
  originalTaskList: any[];
  first = 0;
  rows = 10;
  taskId: any;

  globalFilterColumn = [
    'id',
    'name',
    'relatedName',
    'related',
    'priority',
    'userName',
    'status',
    'createdAt',
    'updatedAt'
  ];
  columns = [
    { header: 'Checkbox', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Task Name', field: 'name' },
    { header: 'Related To', field: 'related' },
    { header: 'Related Name', field: 'relatedName' },
    { header: 'Assigned To', field: 'userName' },
    { header: 'Status', field: 'status' },
    { header: 'Priority', field: 'priority' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Deadline', field: 'deadLine' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  selectedRows: any[] = [];
  rowData: any[] = [];
  tempRowData: any[] = [];
  taskList: any = [];
  userId: any;
  afterDate: string | null = null;
  beforeDate: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  activeFilter: string;
  activeDateFilter: string = '';
  activePriorityFilter: string = '';
  minDate: string;
  maxDate: string;
  isSingleDelete: boolean;
  filterColorObjForTable: any = {
    Completed: 'btn btn-blue',
    InComplete: 'btn btn-green'
  };
  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    this.minDate = oneYearAgo.toISOString().split('T')[0];

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    this.maxDate = oneYearFromNow.toISOString().split('T')[0];
    this.loadTemplatList();
    // this.taskForm = this.formBuilder.group({
    //   workflowTaskStatus: ['InComplete'] // Default status
    // });
  }

  loadTemplatList() {
    this.taskService.getAllTasks().then(
      (data: any) => {
        console.log('data', data);
        this.taskList = data?.taskDTOList;
        this.originalTaskList = [...this.taskList];
        this.sortById();
        this.filterTask('');
      },
      () => {
        this.toastMessageService.error('Unable to load Tasks');
      }
    );
  }

  createeSmsTemplate() {
    this.router.navigateByUrl('/tasks/create');
  }

  goTOTaskGrid() {
    this.router.navigate(['tasks/grid']);
  }

  deleteTemplateModal(data: any) {
    this.selectedRows = [];
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Task';
  }

  onCloseModal(e: any) {
    const taskIds = this.selectedRows.map((o) => o.id);
    this.showModal = false;
    this.showEditTaskModal = false;
    if (e.isDelete) {
      if (taskIds.length > 1 && !this.isSingleDelete) {
        this.deleteSelectedTasks();
      } else {
        this.deleteTemplate(this.modalData.id);
      }
    }
    if (e.isEdit) {
      this.loadTemplatList();
      this.statusChanged.emit();
    }
  }

  deleteTemplate(id: any) {
    this.taskService
      .deleteTask(id)
      .then(() => {
        this.loadTemplatList();
        this.selectedRows = [];
        this.toastMessageService.success('Task deleted successfully');
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting Task');
      });
  }

  deleteAllSelectedTemplateModal(isSingleDelete: boolean) {
    const taskIds = this.selectedRows.map((o) => o.id);
    if (taskIds.length === 0) {
      this.toastMessageService.error('Select a Lead to delete Lead');
      return;
    }
    if (taskIds.length === 1) {
      const taskname = this.selectedRows.map((o) => o.name);
      this.modalData = {
        name: taskname,
        id: taskIds
      };
      this.showModal = true;
      this.modalData.feildName = taskname;
      this.modalData.titleName = 'Task';
      this.isSingleDelete = isSingleDelete;
    } else {
      this.isSingleDelete = isSingleDelete;
      this.modalData = {};
      this.showModal = true;
      this.modalData.count = taskIds.length;
      this.modalData.moduleName = 'tasks';
      this.modalData.titleName = 'All Selected Tasks';
    }
  }

  deleteSelectedTasks() {
    const taskIds = this.selectedRows.map((o) => o.id);
    const successfulDeletes = [];
    const failedDeletes = [];

    const promises = taskIds.map((taskId) =>
      this.taskService
        .deleteTask(taskId)
        .then(() => successfulDeletes.push(taskId))
        .catch(() => failedDeletes.push(taskId))
    );

    Promise.all(promises).then(() => {
      this.loadTemplatList();
      this.selectedRows = [];
      if (successfulDeletes.length > 0) {
        this.toastMessageService.success('Tasks deleted successfully');
      }
      if (failedDeletes.length > 0) {
        this.toastMessageService.error('Error while deleting tasks');
      }
    });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  sortById() {
    this.rowData.sort((a, b) => Number(b.id) - Number(a.id));
  }
  editTask(id: any) {
    console.log('id', id);
    this.taskId = id;
    this.showEditTaskModal = true;
  }
  editTaskOnClick(id: any) {
    this.router.navigate(['/tasks', id, 'edit'], {
      queryParams: { from: 'task' }
    });
  }
  filterTaskDeadline(status: any) {
    this.table.reset();
    if (status == 'All' || status.value == '') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;
      this.rowData = this.tempRowData;
      this.sortById();
    } else if (status == 'Today') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      // console.log('befour this.taskList' , this.rowData)
      this.rowData = this.tempRowData.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return data.deadLine && deadline >= today && deadline < tomorrow;
      });
    } else if (status == 'Tomorrow') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
      this.rowData = this.tempRowData.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return (
          data.deadLine && deadline >= tomorrow && deadline < dayAfterTomorrow
        );
      });
    } else if (status == 'Yesterday') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      this.rowData = this.tempRowData.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return data.deadLine && deadline >= yesterday && deadline < todayStart;
      });
    } else if (status == 'LastWeek') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;
      const lastWeekStart = new Date();
      lastWeekStart.setDate(
        lastWeekStart.getDate() - (lastWeekStart.getDay() + 7)
      );
      lastWeekStart.setHours(0, 0, 0, 0);

      const lastWeekEnd = new Date();
      lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 1);
      lastWeekEnd.setHours(23, 59, 59, 999);
      this.rowData = this.tempRowData.filter((data: any) => {
        return (
          data.deadLine &&
          new Date(data.deadLine) >= lastWeekStart &&
          new Date(data.deadLine) <= lastWeekEnd
        );
      });
    } else if (status == 'NextWeek') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;
      const today = new Date();
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
      nextWeekStart.setHours(0, 0, 0, 0);
      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      nextWeekEnd.setHours(23, 59, 59, 999);

      this.rowData = this.tempRowData.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return (
          data.deadLine && deadline >= nextWeekStart && deadline <= nextWeekEnd
        );
      });
    } else if (status == 'Between') {
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;

      if (this.startDate && this.endDate) {
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        this.rowData = this.tempRowData.filter((data: any) => {
          const deadline = new Date(data.deadLine);
          return data.deadLine && deadline >= startDate && deadline <= endDate;
        });
      }
    } else if (status == 'After') {
      this.startDate = null;
      this.endDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;

      if (this.afterDate) {
        const startDate = new Date(this.afterDate);
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);
        this.rowData = this.tempRowData.filter((data: any) => {
          const deadline = new Date(data.deadLine);
          return data.deadLine && deadline >= startDate;
        });
      }
    } else if (status == 'Before') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.activeDateFilter = status;

      if (this.beforeDate) {
        const endDate = new Date(this.beforeDate);
        endDate.setHours(0, 0, 0, 0);
        this.rowData = this.tempRowData.filter((data: any) => {
          const deadline = new Date(data.deadLine);
          return data.deadLine && deadline <= endDate;
        });
      }
    }
  }

  filterTask(status: any) {
    this.table.reset();
    this.startDate = null;
    this.endDate = null;
    this.afterDate = null;
    this.beforeDate = null;
    this.sortById();
    this.activePriorityFilter = '';
    this.activeDateFilter = '';
    console.log('STATUS' + status);
    if (status == 'All' || status == '') {
      this.activeFilter = status;
      this.applyDateFilter(); // Apply the date filter
    } else if (status == 'overdue') {
      this.activeFilter = status;
      this.rowData = this.taskList.filter((data: any) => {
        return (
          data.status != 'Completed' &&
          data.deadLine &&
          new Date(data.deadLine) < new Date()
        );
      });
      this.tempRowData = this.rowData;
      this.applyDateFilter(); // Apply the date filter
    } else {
      this.activeFilter = status;
      this.activePriorityFilter = '';
      this.rowData = this.taskList.filter((data: any) => {
        return data.status == status;
      });
      this.tempRowData = this.rowData;
      this.applyDateFilter(); // Apply the date filter
    }
    console.log(this.rowData);
    this.rowData = this.rowData.filter((it: any) => it !== undefined);
    this.tempRowData = this.rowData;
  }

  filterPriorityTask(priority: any) {
    this.table.reset();
    this.startDate = null;
    this.endDate = null;
    this.afterDate = null;
    this.beforeDate = null;
    this.sortById();
    this.activeDateFilter = '';
    this.activeFilter = '';
    if (priority === 'All') this.rowData = this.tempRowData;
    else {
      this.activePriorityFilter = priority;
      this.rowData = this.taskList.filter(
        (data: any) => data.priority === priority
      );
    }
  }

  applyDateFilter() {
    if (this.activeFilter === 'All' || this.activeFilter === '') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.rowData = this.taskList.map((data: any) => {
        if (data.leadDTO) {
          return {
            ...data,
            related: 'Lead',
            relatedName: data.leadDTO.firstName + ' ' + data.leadDTO.lastName
          };
        } else if (data.patientDTO) {
          return {
            ...data,
            related: 'Patient',
            relatedName:
              data.patientDTO.firstName + ' ' + data.patientDTO.lastName
          };
        } else {
          return data;
        }
      });
      this.sortById();
    } else if (this.activeFilter === 'Today') {
      // Apply date filter for Today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      this.rowData = this.rowData.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return data.deadLine && deadline >= today && deadline < tomorrow;
      });
    } else if (this.activeFilter === 'Tomorrow') {
      // Apply date filter for Tomorrow
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(tomorrow.getDate() + 1);

      this.rowData = this.taskList.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return (
          data.deadLine && deadline >= tomorrow && deadline < dayAfterTomorrow
        );
      });
    } else if (this.activeFilter === 'Yesterday') {
      // Apply date filter for Yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      this.rowData = this.taskList.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return data.deadLine && deadline >= yesterday && deadline < todayStart;
      });
    } else if (this.activeFilter === 'LastWeek') {
      // Apply date filter for LastWeek
      const lastWeekStart = new Date();
      lastWeekStart.setDate(
        lastWeekStart.getDate() - (lastWeekStart.getDay() + 7)
      );
      lastWeekStart.setHours(0, 0, 0, 0);

      const lastWeekEnd = new Date();
      lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() - 1);
      lastWeekEnd.setHours(23, 59, 59, 999);

      this.rowData = this.taskList.filter((data: any) => {
        return (
          data.deadLine &&
          new Date(data.deadLine) >= lastWeekStart &&
          new Date(data.deadLine) <= lastWeekEnd
        );
      });
    } else if (this.activeFilter === 'NextWeek') {
      // Apply date filter for NextWeek
      const today = new Date();
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
      nextWeekStart.setHours(0, 0, 0, 0);

      const nextWeekEnd = new Date(nextWeekStart);
      nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
      nextWeekEnd.setHours(23, 59, 59, 999);

      this.rowData = this.taskList.filter((data: any) => {
        const deadline = new Date(data.deadLine);
        return (
          data.deadLine && deadline >= nextWeekStart && deadline <= nextWeekEnd
        );
      });
    } else if (this.activeFilter === 'Between') {
      // Apply date filter for Between
      if (this.startDate && this.endDate) {
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);

        this.rowData = this.taskList.filter((data: any) => {
          const deadline = new Date(data.deadLine);
          return data.deadLine && deadline >= startDate && deadline <= endDate;
        });
      }
    } else if (this.activeFilter === 'After') {
      // Apply date filter for After
      if (this.afterDate) {
        const startDate = new Date(this.afterDate);
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0, 0);

        this.rowData = this.taskList.filter((data: any) => {
          const deadline = new Date(data.deadLine);
          return data.deadLine && deadline >= startDate;
        });
      }
    } else if (this.activeFilter === 'Before') {
      // Apply date filter for Before
      if (this.beforeDate) {
        const endDate = new Date(this.beforeDate);
        endDate.setHours(0, 0, 0, 0);

        this.rowData = this.taskList.filter((data: any) => {
          const deadline = new Date(data.deadLine);
          return data.deadLine && deadline <= endDate;
        });
      }
    }
  }
  unselectTriggers() {
    this.selectedRows = [];
  }

  updateStatus(newStatus: string): void {
    const taskIds = this.selectedRows.map((o) => o.id);
    for (let index = 0; index < taskIds.length; index++) {
      this.taskService.getTask(taskIds[index]).then(
        (response: any) => {
          const updatedTask = {
            name: response.name,
            description: response.description,
            workflowTaskStatus: newStatus,
            workflowTaskUser: response.userId,
            priority: response.priority,
            deadline: new Date(response.deadLine),
            workflowTaskPatient: response.patientId,
            questionnaireSubmissionId: response.leadId
          };

          this.taskService.updateTask(taskIds[index], updatedTask).then(
            () => {
              if (index === taskIds.length - 1) {
                this.toastMessageService.success('Task updated successfully.');
                this.statusChanged.emit();
                this.loadTemplatList();
              }
            },
            () => {
              this.toastMessageService.error('Error updating task.');
            }
          );
        },
        () => {
          console.error('Unable to get the task.');
        }
      );
    }
    this.selectedRows = [];
  }

  updatePriority(newPriority: string): void {
    const taskIds = this.selectedRows.map((o) => o.id);
    for (let index = 0; index < taskIds.length; index++) {
      this.taskService.getTask(taskIds[index]).then(
        (response: any) => {
          const updatedTask = {
            name: response.name,
            description: response.description,
            workflowTaskStatus: response.status,
            priority: newPriority,
            workflowTaskUser: response.userId,
            deadline: new Date(response.deadLine),
            workflowTaskPatient: response.patientId,
            questionnaireSubmissionId: response.leadId
          };

          this.taskService.updateTask(taskIds[index], updatedTask).then(
            () => {
              if (index === taskIds.length - 1) {
                this.toastMessageService.success('Task updated successfully.');
                this.statusChanged.emit();
                this.loadTemplatList();
              }
            },
            () => {
              this.toastMessageService.error('Error updating task.');
            }
          );
        },
        () => {
          console.error('Unable to get the task.');
        }
      );
    }
    this.selectedRows = [];
  }

  viewDetails(id: any) {
    const taskId = id;
    this.router.navigate(['/tasks', taskId, 'edit'], {
      queryParams: { from: 'task' }
    });
  }

  formatDate(date: string) {
    const momentDate = moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').utc(); // Parse in UTC
    const formattedDate = momentDate.format('MMM DD YYYY');
    return formattedDate;
  }
}
