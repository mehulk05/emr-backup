import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { UserAppointmentComponent } from './components/user-appointment/user-appointment.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserTabsComponent } from './components/user-tabs/user-tabs.component';
import { UserVacationScheduleComponent } from './components/user-vacation-schedule/user-vacation-schedule.component';
import { UserWorkingScheduleComponent } from './components/user-working-schedule/user-working-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Users List'
    }
  },
  {
    path: ':userId/create',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create User'
    }
  },
  {
    path: ':userId/edit',
    component: UserTabsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit User'
    }
  },
  {
    path: 'profile',
    component: UserTabsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'User Profile'
    }
  },
  {
    path: 'appointments',
    component: UserAppointmentComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Users Appointment'
    }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Change Password'
    }
  },
  {
    path: 'working-schedule',
    component: UserWorkingScheduleComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Working Schedule'
    }
  },
  {
    path: 'vacation-schedule',
    component: UserVacationScheduleComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Vacation Schedule'
    }
  },
  {
    path: 'email-verification/:token',
    redirectTo: '/registration/email-verification/:token',
    data: { showHeader: false, showSidebar: false }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
