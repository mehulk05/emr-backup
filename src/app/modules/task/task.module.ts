import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskRoutingModule } from './task-routing.module';
import { TaskListComponent } from './components/task-list/task-list.component';
import { AddEditTaskComponent } from './components/add-edit-task/add-edit-task.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaskListNewLayoutComponent } from './components/task-list-new-layout/task-list-new-layout.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EditTaskModalComponent } from './components/edit-task-modal/edit-task-modal.component';
import { MatMenuModule } from '@angular/material/menu';
import { TaskTableComponent } from './components/task-table/task-table.component';

@NgModule({
  declarations: [
    TaskListComponent,
    AddEditTaskComponent,
    TaskListNewLayoutComponent,
    EditTaskModalComponent,
    TaskTableComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule,
    NgPrimeModule,
    SharedModule,
    MatMenuModule
  ]
})
export class TaskModule {}
