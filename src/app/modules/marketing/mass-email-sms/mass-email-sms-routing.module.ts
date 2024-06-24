import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditMassEmailSmsComponent } from './components/add-edit-mass-email-sms/add-edit-mass-email-sms.component';
import { AddEditTriggersComponent } from './components/add-edit-triggers/add-edit-triggers.component';
import { MassEmailSmsAudtiDetailComponent } from './components/mass-email-sms-audti-detail/mass-email-sms-audti-detail.component';
import { MassEmailSmsTabComponent } from './components/mass-email-sms-tab/mass-email-sms-tab.component';
import { TriggersTabComponent } from './components/triggers-list/triggers-tab/triggers-tab.component';

const routes: Routes = [
  {
    // not able to findout where it is linked
    path: '',
    component: TriggersTabComponent,
    data: {
      breadcrumb: 'Triggers List'
    }
  },
  {
    path: 'create',
    component: AddEditTriggersComponent,
    data: {
      breadcrumb: 'Create Trigger'
    }
  },

  {
    path: 'broadcast',
    component: MassEmailSmsTabComponent,
    data: {
      breadcrumb: 'Mass Email and SMS List',
      parentName: 'Marketing',
      parentUrl: '/triggers/broadcast'
    }
  },
  {
    path: 'broadcast/create',
    component: AddEditMassEmailSmsComponent,
    data: {
      breadcrumb: 'Create Mass Email and SMS',
      parentName: 'Marketing',
      parentUrl: '/triggers/broadcast'
    }
  },
  {
    path: 'broadcast/:id/audit',
    component: MassEmailSmsAudtiDetailComponent,
    data: {
      breadcrumb: 'Mass Email and SMS Audit',
      parentName: 'Marketing',
      parentUrl: '/triggers/broadcast'
    }
  },
  {
    path: 'broadcast/:id/edit',
    component: AddEditMassEmailSmsComponent,
    data: {
      breadcrumb: 'Edit Mass Email and SMS',
      parentName: 'Marketing',
      parentUrl: '/triggers/broadcast'
    }
  },
  {
    path: ':id',
    component: AddEditTriggersComponent,
    data: {
      breadcrumb: 'Edit Trigger'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MassEmailSmsRoutingModule {}
