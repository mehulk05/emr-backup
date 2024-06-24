import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditTaskComponent } from './components/add-edit-task/add-edit-task.component';
import { TaskListNewLayoutComponent } from './components/task-list-new-layout/task-list-new-layout.component';
import { TaskListComponent } from './components/task-list/task-list.component';

const routes: Routes = [
  {
    path: '',
    component: TaskListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Tasks List'
    }
  },
  {
    path: 'create',
    component: AddEditTaskComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Task'
    }
  },
  {
    path: 'grid',
    component: TaskListNewLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Task List'
    }
  },
  {
    path: ':id/edit',
    component: AddEditTaskComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Task'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule {}
