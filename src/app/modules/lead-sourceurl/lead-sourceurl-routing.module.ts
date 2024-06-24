import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LeadSourceurlListComponent } from './components/lead-sourceurl-list/lead-sourceurl-list.component';
import { AdEditLeadSourceurlComponent } from './components/ad-edit-lead-sourceurl/ad-edit-lead-sourceurl.component';
const routes: Routes = [
  {
    path: '',
    component: LeadSourceurlListComponent,
    data: {
      breadcrumb: 'Lead Source URLs List'
    }
  },
  {
    path: 'create',
    component: AdEditLeadSourceurlComponent,
    data: {
      breadcrumb: 'Add Lead Source URL'
    }
  },
  {
    path: 'edit/:id',
    component: AdEditLeadSourceurlComponent,
    data: {
      breadcrumb: 'Edit Lead Source URL'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadSourceurlRoutingModule {}
