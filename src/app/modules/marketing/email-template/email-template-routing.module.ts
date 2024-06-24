import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditEmailOldEditorComponent } from './components/add-edit-email-old-editor/add-edit-email-old-editor.component';
import { AddEditEmailTemplateComponent } from './components/add-edit-email-template/add-edit-email-template.component';
import { EmailTemplateTabsComponent } from './components/email-template-list/email-template-tabs/email-template-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: EmailTemplateTabsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Email Templates List'
    }
  },
  {
    path: 'create',
    component: AddEditEmailTemplateComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Email Templates'
    }
  },
  {
    path: 'create/new',
    component: AddEditEmailOldEditorComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Email Templates'
    }
  },
  {
    path: ':id/edit',
    component: AddEditEmailTemplateComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Email Templates'
    }
  },
  {
    path: ':id/edit/new',
    component: AddEditEmailOldEditorComponent,
    canActivate: [AuthGuard],
    data: {
      breadCrumb: 'Edit Email Templates'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailTemplateRoutingModule {}
