import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditLeadTagComponent } from './components/add-edit-lead-tag/add-edit-lead-tag.component';
import { LeadTagsListComponent } from './components/lead-tags-list/lead-tags-list.component';

const routes: Routes = [
  {
    path: '',
    component: LeadTagsListComponent,
    data: {
      breadcrumb: 'Lead Tags'
    }
  },
  {
    path: 'create',
    component: AddEditLeadTagComponent,
    data: {
      breadcrumb: 'Add Lead Tag'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditLeadTagComponent,
    data: {
      breadcrumb: 'Edit Lead Tag'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadTagRoutingModule {}
