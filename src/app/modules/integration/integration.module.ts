import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationPageComponent } from './component/integration-page/integration-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { IntegrationRightCardComponent } from './component/integration-right-card/integration-right-card.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IntegrationTabsComponent } from './component/integration-tabs/integration-tabs.component';
import { ComponentIntegrationComponent } from './component/component-integration/component-integration.component';
import { ComponentIntegrationNewComponent } from './component/component-integration-new/component-integration-new.component';
import { IntegrationRightSectionComponent } from './component/integration-right-card/integration-right-section/integration-right-section.component';

@NgModule({
  declarations: [
    IntegrationPageComponent,
    IntegrationRightCardComponent,
    IntegrationTabsComponent,
    ComponentIntegrationComponent,
    ComponentIntegrationNewComponent,
    IntegrationRightSectionComponent
  ],
  imports: [
    CommonModule,
    IntegrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgPrimeModule,
    SharedModule,
    DragDropModule
  ]
})
export class IntegrationModule {}
