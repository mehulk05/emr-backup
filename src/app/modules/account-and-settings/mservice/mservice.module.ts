import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MserviceRoutingModule } from './mservice-routing.module';
import { ServiceListComponent } from './components/service-list/service-list.component';
import { AddEditServiceFormComponent } from './components/add-edit-service-form/add-edit-service-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ServiceListComponent, AddEditServiceFormComponent],
  imports: [
    CommonModule,
    MserviceRoutingModule,
    SharedModule,
    NgPrimeModule,
    ImageCropperModule,
    DragDropModule
  ]
})
export class MserviceModule {}
