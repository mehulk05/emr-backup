import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list-new-layout',
  templateUrl: './task-list-new-layout.component.html',
  styleUrls: ['./task-list-new-layout.component.css']
})
export class TaskListNewLayoutComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  rowData: any[] = [];
  tempRowData: any[] = [];
  userId: any;
  toDoTask: any = [];
  inProgressTask: any = [];
  completedTask: any = [];
  taskFilter: any = '';
  showEditTaskModal: boolean;
  activePriorityFilter: any = '';
  activeStatusFilter: any = '';
  taskId: any;
  activeDateFilter: string = '';
  afterDate: string | null = null;
  beforeDate: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  minDate: string;
  maxDate: string;
  constructor(
    private taskService: TaskService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadTemplatList();
  }
  goTOTaskList() {
    this.router.navigate(['tasks']);
  }

  addTask() {
    this.router.navigate(['tasks/create']);
  }

  convertDate(dateToday: any) {
    const dateCon = new Date(dateToday).toLocaleDateString();
    console.log('datech', dateCon);
  }
  loadTemplatList() {
    this.tempRowData = [];
    this.completedTask = [];
    this.toDoTask = [];
    this.inProgressTask = [];
    this.taskService.getAllTasks().then(
      (data: any) => {
        this.tempRowData = data?.taskDTOList;
        console.log('rowdata', this.tempRowData);
        if (this.tempRowData.length > 0) {
          this.tempRowData = this.tempRowData.sort(
            (firstTask, secondTask) => secondTask.id - firstTask.id
          );
          this.segregateData(this.tempRowData);
        }
      },
      () => {
        this.toastMessageService.error('Unable to load Tasks');
      }
    );
  }

  filterStatusTask(status: any) {
    if (status === 'All' || status === '') {
      this.segregateData(this.tempRowData);
    } else {
      this.rowData = this.tempRowData.filter((o) => o.status === status);
      this.segregateData(this.rowData);
    }
  }

  filterPriorityTask(priority: any) {
    if (priority === 'All' || priority === '') {
      this.segregateData(this.tempRowData);
    } else {
      this.rowData = this.tempRowData.filter((o) => o.priority === priority);
      this.segregateData(this.rowData);
    }
  }

  segregateData(arrayParams: any[] = []) {
    this.completedTask = [];
    this.toDoTask = [];
    this.inProgressTask = [];
    this.rowData = arrayParams;
    arrayParams.forEach((data) => {
      const mappedData = data.leadId
        ? {
            ...data,
            related: 'Lead',
            relatedName: data.leadDTO.firstName + ' ' + data.leadDTO.lastName
          }
        : data.patientDTO
        ? {
            ...data,
            related: 'Patient',
            relatedName:
              data.patientDTO.firstName + ' ' + data.patientDTO.lastName
          }
        : data;
      if (data.status === 'Completed') this.completedTask.push(mappedData);
      else if (data.status === 'Inprogress')
        this.inProgressTask.push(mappedData);
      else this.toDoTask.push(mappedData);
      console.log('com', this.completedTask);
    });
  }

  createeSmsTemplate() {
    this.router.navigateByUrl('/tasks/create');
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
    console.log('ed', e);
    this.showModal = false;
    this.showEditTaskModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
    if (e.isEdit) {
      this.loadTemplatList();
    }
  }

  deleteTemplate(id: any) {
    this.taskService
      .deleteTask(id)
      .then(() => {
        this.loadTemplatList();
        this.toastMessageService.success('Task deleted successfully');
      })
      .catch(() => {
        this.toastMessageService.error('Error while deleting Task');
      });
  }

  editTask(id: any) {
    console.log('id', id);
    this.taskId = id;
    this.showEditTaskModal = true;
  }

  filterTaskDeadline(status: any) {
    if (status == 'All' || status.value == '') {
      this.startDate = null;
      this.endDate = null;
      this.afterDate = null;
      this.beforeDate = null;
      this.activeDateFilter = status;
      this.rowData = this.tempRowData;
      this.segregateData(this.tempRowData);
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
      this.segregateData(this.rowData);
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
      this.segregateData(this.rowData);
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
      this.segregateData(this.rowData);
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
      this.segregateData(this.rowData);
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
      this.segregateData(this.rowData);
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
        this.segregateData(this.rowData);
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
        this.segregateData(this.rowData);
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
        this.segregateData(this.rowData);
      }
    }
  }

  mapRelatedTo(arr: []) {
    return arr.map((data: any) =>
      data.leadId
        ? { ...data, related: 'Lead' }
        : { ...data, related: 'Patient' }
    );
  }
}
