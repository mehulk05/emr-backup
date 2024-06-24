import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExportCenterComponent } from './import-export-center.component';
import { FileDragImportComponent } from './file-drag-import/file-drag-import.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientCenterComponent } from './patient-center/patient-center.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { LeadCenterComponent } from './lead-center/lead-center.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExcelColumnListComponent } from './excel-column-list/excel-column-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TriggerCenterComponent } from './trigger-center/trigger-center.component';

const routes: Routes = [
  {
    path: '',
    component: ImportExportCenterComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  declarations: [
    ImportExportCenterComponent,
    FileDragImportComponent,
    PatientCenterComponent,
    LeadCenterComponent,
    ExcelColumnListComponent,
    TriggerCenterComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgPrimeModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule
  ]
})
export class ImportExportCenterModule {}
