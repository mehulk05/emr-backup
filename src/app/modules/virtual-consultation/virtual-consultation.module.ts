import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VirtualConsultationRoutingModule } from './virtual-consultation-routing.module';
import { SymptomComposerComponent } from './components/symptom-composer/symptom-composer.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SymptomModalComponent } from './components/symptom-modal/symptom-modal.component';
import { SymptomComposerFormComponent } from './components/symptom-composer-form/symptom-composer-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PreviewSymptomsComponent } from './components/preview-symptoms/preview-symptoms.component';
import { SymptomComposerRightPartComponent } from './components/symptom-composer-right-part/symptom-composer-right-part.component';
import { DentalTreatmentContainerComponent } from './components/dental-treatment-advisor/dental-treatment-container/dental-treatment-container.component';
import { DentalServiceComponent } from './components/dental-service/dental-service.component';
import { SingleSymptomModalComponent } from './components/dental-treatment-advisor/single-symptom-modal/single-symptom-modal.component';
import { AddDentalSymptomModalComponent } from './components/dental-treatment-advisor/add-dental-symptom-modal/add-dental-symptom-modal.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    SymptomComposerComponent,
    SymptomModalComponent,
    SymptomComposerFormComponent,
    PreviewSymptomsComponent,
    SymptomComposerRightPartComponent,
    DentalTreatmentContainerComponent,
    DentalServiceComponent,
    SingleSymptomModalComponent,
    AddDentalSymptomModalComponent
  ],
  imports: [
    CommonModule,
    VirtualConsultationRoutingModule,
    NgPrimeModule,
    SharedModule,
    ReactiveFormsModule,
    ImageCropperModule
  ]
})
export class VirtualConsultationModule {}
