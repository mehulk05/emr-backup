import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { IntegrationTabsComponent } from './component/integration-tabs/integration-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: IntegrationTabsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Single Script Integration'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationRoutingModule {}
