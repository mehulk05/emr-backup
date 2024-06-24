import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { NotificationCenterTabComponent } from './components/notification-center-tab/notification-center-tab.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationCenterTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Configuration'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationCenterRoutingModule {}
