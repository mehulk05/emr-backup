import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { SymptomComposerComponent } from './components/symptom-composer/symptom-composer.component';

const routes: Routes = [
  {
    path: 'symptoms/compose',
    component: SymptomComposerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: ''
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VirtualConsultationRoutingModule {}
