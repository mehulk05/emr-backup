import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientProfileRoutingModule } from './patient-profile-routing.module';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';
import { PatientProfileTabComponent } from './components/patient-profile-tab/patient-profile-tab.component';
import { PatientChangePasswordComponent } from './components/patient-change-password/patient-change-password.component';
import { SharedModule } from 'primeng/api';
import { NgPrimeModule } from 'src/app/modules/ng-prime/ng-prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    PatientProfileComponent,
    PatientProfileTabComponent,
    PatientChangePasswordComponent
  ],
  imports: [
    CommonModule,
    PatientProfileRoutingModule,
    NgPrimeModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class PatientProfileModule {}
