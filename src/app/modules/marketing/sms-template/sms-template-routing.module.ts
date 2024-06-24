import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditSmsTemplateComponent } from './components/add-edit-sms-template/add-edit-sms-template.component';
import { SmsTemplateTabComponent } from './components/sms-template-list/sms-template-tab/sms-template-tab.component';

const routes: Routes = [
  {
    path: '',
    component: SmsTemplateTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'SMS Templates List'
    }
  },
  {
    path: 'create',
    component: AddEditSmsTemplateComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create SMS Templates'
    }
  },
  {
    path: ':id/edit',
    component: AddEditSmsTemplateComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit SMS Templates'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmsTemplateRoutingModule {}
