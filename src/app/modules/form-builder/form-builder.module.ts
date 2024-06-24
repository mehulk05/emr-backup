import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormsBuilderSharedModuleModule } from './forms-builder-shared-module.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    FormsBuilderSharedModuleModule
  ],
  exports: []
})
export class FormBuilderModule {}
