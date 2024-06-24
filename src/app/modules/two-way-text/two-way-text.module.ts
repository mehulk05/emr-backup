import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { TwoWayTextAuditDetailComponent } from './components/two-way-text-audit-detail/two-way-text-audit-detail.component';
import { TwoWayTextAuditTableComponent } from './components/two-way-text-audit-table/two-way-text-audit-table.component';
import { TwoWayTextChatSideBarComponent } from './components/two-way-text-chat-side-bar/two-way-text-chat-side-bar.component';
import { TwoWayTextConfigurationComponent } from './components/two-way-text-configuration/two-way-text-configuration.component';
import { TwoWayTextSmsAuditComponent } from './components/two-way-text-sms-audit/two-way-text-sms-audit.component';
import { TwoWayTextTabComponent } from './components/two-way-text-tab/two-way-text-tab.component';
import { TwoWayTextCenterRoutingModule } from './two-way-text-center-routing.module';
import { TwoWayTextUpgradeComponent } from './components/two-way-text-subscription/two-way-text-upgrade/two-way-text-upgrade.component';
import { TwoWayTextSubscriptionComponent } from './components/two-way-text-subscription/two-way-text-subscription.component';
import { TwoWayTextPackageListComponent } from './components/two-way-text-subscription/two-way-text-package-list/two-way-text-package-list.component';
import { TwoWayTextSubscriptionFormComponent } from './components/two-way-text-subscription/two-way-text-subscription-form/two-way-text-subscription-form.component';

@NgModule({
  declarations: [
    TwoWayTextAuditDetailComponent,
    TwoWayTextAuditTableComponent,
    TwoWayTextChatSideBarComponent,
    TwoWayTextSmsAuditComponent,
    TwoWayTextConfigurationComponent,
    TwoWayTextTabComponent,
    TwoWayTextUpgradeComponent,
    TwoWayTextSubscriptionComponent,
    TwoWayTextPackageListComponent,
    TwoWayTextSubscriptionFormComponent
  ],
  imports: [
    CommonModule,
    TwoWayTextCenterRoutingModule,
    SharedModule,
    NgPrimeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [TwoWayTextSmsAuditComponent]
})
export class TwoWayTextModule {}
