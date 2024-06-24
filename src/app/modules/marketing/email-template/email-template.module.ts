import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailTemplateRoutingModule } from './email-template-routing.module';
import { EmailTemplateListComponent } from './components/email-template-list/email-template-list.component';
import { AddEditEmailTemplateComponent } from './components/add-edit-email-template/add-edit-email-template.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { AddEditEmailOldEditorComponent } from './components/add-edit-email-old-editor/add-edit-email-old-editor.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { EmailTemplateTabsComponent } from './components/email-template-list/email-template-tabs/email-template-tabs.component';
import { SharedModule as SharedG99 } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    EmailTemplateListComponent,
    AddEditEmailTemplateComponent,
    AddEditEmailOldEditorComponent,
    EmailTemplateTabsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    NgPrimeModule,
    SharedModule,
    EmailTemplateRoutingModule,
    NgPrimeModule,
    CKEditorModule,
    SharedModule,
    ReactiveFormsModule,
    SharedG99
  ]
})
export class EmailTemplateModule {}
