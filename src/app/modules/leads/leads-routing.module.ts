import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { LeadTabsComponent } from './components/lead-tabs/lead-tabs.component';
import { LeadsDashboardComponent } from './components/leads-dashboard/leads-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsDashboardComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Lead Dashboard'
    }
  },
  {
    path: ':leadId/edit',
    component: LeadTabsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Lead Details'
    }
  },
  {
    path: 'create',
    component: LeadTabsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Lead'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadsRoutingModule {}
