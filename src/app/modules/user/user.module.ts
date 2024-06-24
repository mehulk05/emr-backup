import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserWorkingScheduleComponent } from './components/user-working-schedule/user-working-schedule.component';
import { UserVacationScheduleComponent } from './components/user-vacation-schedule/user-vacation-schedule.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { QuickLinksComponent } from './components/user-profile/quick-links/quick-links.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { UserAppointmentComponent } from './components/user-appointment/user-appointment.component';
import { UserTabsComponent } from './components/user-tabs/user-tabs.component';
import { SupportUserResetPasswordComponent } from './components/user-profile/support-user-reset-password/support-user-reset-password.component';

@NgModule({
  declarations: [
    UserProfileComponent,
    ChangePasswordComponent,
    UserWorkingScheduleComponent,
    UserVacationScheduleComponent,
    UserListComponent,
    QuickLinksComponent,
    UserAppointmentComponent,
    UserTabsComponent,
    SupportUserResetPasswordComponent
  ],
  imports: [
    CommonModule,
    ImageCropperModule,
    UserRoutingModule,
    FormsModule,
    SharedModule,
    NgPrimeModule,
    ReactiveFormsModule
  ]
})
export class UserModule {}
