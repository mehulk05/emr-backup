import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsDashboardComponent } from './components/leads-dashboard/leads-dashboard.component';
import { LeadsTableComponent } from './components/leads-table/leads-table.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeadDetailTab1Component } from './components/lead-detail-tab1/lead-detail-tab1.component';
import { LeadHisoryTab4Component } from './components/lead-hisory-tab4/lead-hisory-tab4.component';
import { LeadTabsComponent } from './components/lead-tabs/lead-tabs.component';
import { AddEditLeadTaskComponent } from './components/lead-tasks-tab3/add-edit-lead-task/add-edit-lead-task.component';
import { LeadTasksTab3Component } from './components/lead-tasks-tab3/lead-tasks-tab3.component';
import { LeadTimelineTab2Component } from './components/lead-timeline-tab2/lead-timeline-tab2.component';
import { LeadInlineEditComponent } from './components/leads-table/lead-inline-edit/lead-inline-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeadDetailTab1LeftComponent } from './components/lead-detail-tab1-left/lead-detail-tab1-left.component';
import { LeadDetailTab1RightComponent } from './components/lead-detail-tab1-right/lead-detail-tab1-right.component';
import { CreateTaskModalComponent } from './components/create-task-modal/create-task-modal.component';
import { LeadsGraphComponent } from './components/leads-dashboard/leads-graph/leads-graph.component';
import 'chartjs-plugin-labels';
import { LeadFilterComponent } from './components/leads-dashboard/lead-filter/lead-filter.component';
import { PreviewEmailSmsTemplateComponent } from './components/lead-timeline-tab2/preview-email-sms-template/preview-email-sms-template.component';
import { LeadTimelineAllTab5Component } from './components/lead-timeline-all-tab5/lead-timeline-all-tab5.component';
import { LeadStatusColorBoxComponent } from './components/leads-table/lead-status-color-box/lead-status-color-box.component';
import { LeadDyanamicTableComponent } from './components/lead-dyanamic-table/lead-dyanamic-table.component';
import { LeadNotesModalComponent } from './dialogs/lead-notes-modal/lead-notes-modal.component';
import { LeadInfoSinglePageComponent } from './components/lead-info-single-page/lead-info-single-page.component';
import { TwoWayTextModule } from '../two-way-text/two-way-text.module';
import { LeadDetailTab1MiddleComponent } from './components/lead-detail-tab1-middle/lead-detail-tab1-middle.component';
import { MatMenuModule } from '@angular/material/menu';
import { NotesUserlistPopupComponent } from './components/notes-userlist-popup/notes-userlist-popup.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    LeadsDashboardComponent,
    LeadsTableComponent,
    LeadTabsComponent,
    LeadDetailTab1Component,
    LeadTimelineTab2Component,
    LeadTasksTab3Component,
    LeadHisoryTab4Component,
    AddEditLeadTaskComponent,
    LeadInlineEditComponent,
    LeadDetailTab1LeftComponent,
    LeadDetailTab1RightComponent,
    CreateTaskModalComponent,
    LeadsGraphComponent,
    LeadFilterComponent,
    PreviewEmailSmsTemplateComponent,
    LeadTimelineAllTab5Component,
    LeadStatusColorBoxComponent,
    LeadDyanamicTableComponent,
    LeadNotesModalComponent,
    LeadInfoSinglePageComponent,
    LeadDetailTab1MiddleComponent,
    NotesUserlistPopupComponent
  ],
  imports: [
    CommonModule,
    LeadsRoutingModule,
    SharedModule,
    NgPrimeModule,
    ReactiveFormsModule,
    FormsModule,
    TwoWayTextModule,
    MatMenuModule,
    NgChartsModule
   ],
  exports: [PreviewEmailSmsTemplateComponent, LeadsGraphComponent]
})
export class LeadsModule {}
