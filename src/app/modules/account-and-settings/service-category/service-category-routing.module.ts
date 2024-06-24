import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditCategoryFormComponent } from './components/add-edit-category-form/add-edit-category-form.component';
import { CategoryListComponent } from './components/category-list/category-list.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Categories List'
    }
  },
  {
    path: 'create',
    component: AddEditCategoryFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Category'
    }
  },

  {
    path: ':categoryId/edit',
    component: AddEditCategoryFormComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Category'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceCategoryRoutingModule {}
