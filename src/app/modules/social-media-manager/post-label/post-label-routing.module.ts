import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddEditPostLabelComponent } from './components/add-edit-post-label/add-edit-post-label.component';
import { PostLabelListComponent } from './components/post-label-list/post-label-list.component';

const routes: Routes = [
  {
    path: '',
    component: PostLabelListComponent,
    data: {
      breadcrumb: 'Post Labels'
    }
  },
  {
    path: 'add',
    component: AddEditPostLabelComponent,
    data: {
      breadcrumb: 'Add Post Label'
    }
  },
  {
    path: 'edit/:id',
    component: AddEditPostLabelComponent,
    data: {
      breadcrumb: 'Edit Post Label'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostLabelRoutingModule {}
