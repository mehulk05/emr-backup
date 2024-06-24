import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PaginatorModule } from 'primeng/paginator';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { SidebarModule } from 'primeng/sidebar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TagModule } from 'primeng/tag';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TableModule,
    MultiSelectModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    InputSwitchModule,
    PaginatorModule,
    DynamicDialogModule,
    ProgressBarModule,
    ConfirmDialogModule,
    RadioButtonModule,
    AccordionModule,
    TooltipModule,
    SidebarModule,
    SelectButtonModule,
    OverlayPanelModule,
    AutoCompleteModule,
    TagModule
  ],
  exports: [
    TableModule,
    MultiSelectModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    CalendarModule,
    TabViewModule,
    InputSwitchModule,
    OverlayPanelModule,
    PaginatorModule,
    ProgressBarModule,
    ConfirmDialogModule,
    RadioButtonModule,
    AccordionModule,
    TooltipModule,
    SidebarModule,
    SelectButtonModule,
    AutoCompleteModule,
    TagModule
  ]
})
export class NgPrimeModule {}
