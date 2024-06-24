import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationCenterRoutingModule } from './notification-center-routing.module';
import { NotificationCenterComponent } from './components/notification-center/notification-center.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { NotificationCenterTabComponent } from './components/notification-center-tab/notification-center-tab.component';

@NgModule({
  declarations: [NotificationCenterComponent, NotificationCenterTabComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    NotificationCenterRoutingModule,
    NgPrimeModule
  ],
  exports: []
})
export class NotificationCenterModule {}
