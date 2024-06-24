import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmsTemplateRoutingModule } from './sms-template-routing.module';
import { AddEditSmsTemplateComponent } from './components/add-edit-sms-template/add-edit-sms-template.component';
import { SmsTemplateListComponent } from './components/sms-template-list/sms-template-list.component';
import { SharedModule } from 'primeng/api';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SmsTemplateTabComponent } from './components/sms-template-list/sms-template-tab/sms-template-tab.component';
import { SharedModule as SharedG99 } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SmsTemplateListComponent,
    AddEditSmsTemplateComponent,
    SmsTemplateTabComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SmsTemplateRoutingModule,
    NgPrimeModule,
    SharedModule,
    SharedG99,
    ReactiveFormsModule
  ]
})
export class SmsTemplateModule {}
