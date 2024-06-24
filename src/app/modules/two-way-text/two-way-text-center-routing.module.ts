import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { TwoWayTextAuditDetailComponent } from './components/two-way-text-audit-detail/two-way-text-audit-detail.component';
import { TwoWayTextSubscriptionComponent } from './components/two-way-text-subscription/two-way-text-subscription.component';
import { TwoWayTextTabComponent } from './components/two-way-text-tab/two-way-text-tab.component';

const routes: Routes = [
  {
    path: '',
    component: TwoWayTextTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Configuration'
    }
  },
  {
    path: 'message-center',
    component: TwoWayTextAuditDetailComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Message Center'
    }
  },
  {
    path: 'subscribe',
    component: TwoWayTextSubscriptionComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: ''
    }
  },
  {
    path: 'public/subscribe',
    component: TwoWayTextSubscriptionComponent,
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TwoWayTextCenterRoutingModule {}
