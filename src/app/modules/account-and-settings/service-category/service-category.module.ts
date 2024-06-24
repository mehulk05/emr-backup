import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceCategoryRoutingModule } from './service-category-routing.module';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { AddEditCategoryFormComponent } from './components/add-edit-category-form/add-edit-category-form.component';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [CategoryListComponent, AddEditCategoryFormComponent],
  imports: [
    CommonModule,
    ServiceCategoryRoutingModule,
    SharedModule,
    NgPrimeModule,
    DragDropModule
  ]
})
export class ServiceCategoryModule {}
