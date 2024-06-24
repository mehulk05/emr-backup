import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { TaskService } from '../../services/task.service';
import { Table } from 'jspdf-autotable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @ViewChild('dt1') table: Table;

  //property for lead data
  leadsData: any;
  showHide: boolean = false;
  btnName: any = 'Show Details';
  showModal: boolean = false;
  modalData: any;
  isRefreshApiCall = 0;
  showImportModal: boolean = false;
  selectedRows: any[] = [];
  rowData: any[] = [];
  tempRowData: any[] = [];
  taskList: any = [];
  userId: any;
  originalTaskList: any[];
  todoCount: number = 0;
  inProgressCount: number = 0;
  completedCount: number = 0;
  constructor(
    private taskService: TaskService,
    private toastMessageService: ToasTMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    //calling loadLeads() for getting lead data when initializing component
    this.loadTemplatList();
  }
  //show and hide graph
  showGrid = () => (this.showHide = true);
  showTable = () => (this.showHide = false);

  loadTemplatList() {
    this.taskService.getAllTasks().then(
      (data: any) => {
        console.log('data', data);
        this.taskList = data?.taskDTOList;
        this.originalTaskList = [...this.taskList];

        this.todoCount = this.taskList.filter(
          (o: any) => o.status === 'Todo'
        ).length;
        this.inProgressCount = this.taskList.filter(
          (o: any) => o.status === 'Inprogress'
        ).length;
        this.completedCount = this.taskList.filter(
          (o: any) => o.status === 'Completed'
        ).length;
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

  loadData() {
    this.loadTemplatList();
  }
}
