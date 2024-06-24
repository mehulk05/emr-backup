import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './services/local-storage.service';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeleteWarningComponent } from './reusableComponents/delete-warning/delete-warning.component';
import { HeaderComponent } from './reusableComponents/header/header.component';
import { DialogModule } from 'primeng/dialog';
import { ErrorStylingDirectiveDirective } from './directives/error-styling-directive.directive';
import { BreadcrumbComponent } from './reusableComponents/header/breadcrumb/breadcrumb.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { PublicPaymentComponent } from './reusableComponents/public-payment/public-payment.component';
import { NgxStripeModule } from 'ngx-stripe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { NewEditorComponent } from './reusableComponents/new-editor/new-editor.component';
import { OldEditorComponent } from './reusableComponents/old-editor/old-editor.component';
import { ExportFileComponent } from './reusableComponents/export-file/export-file.component';
import { EmailSmsAuditBannerComponent } from './reusableComponents/email-sms-audit-banner/email-sms-audit-banner.component';
import { ImportFileComponent } from './reusableComponents/import-file/import-file.component';
import { PaymentComponent } from './reusableComponents/payment/payment.component';
import { UrlPreviewComponent } from './reusableComponents/url-preview/url-preview.component';
import { ApiService } from './services/api.service';
import { PachagePaymentComponent } from './reusableComponents/pachage-payment/pachage-payment.component';
import { LandingFilterPipe } from './pipes/landing-filter.pipe';
import { ThankYouComponent } from './reusableComponents/thank-you/thank-you.component';
import { CommaSeparatorPipe } from './pipes/comma-separator.pipe';
import { AwsChimeOnlineMeetingComponent } from './reusableComponents/aws-chime-online-meeting/aws-chime-online-meeting.component';
import { RemoveSpecialCharFromLpNamePipe } from './pipes/remove-special-char-from-lp-name.pipe';
import { OnlineMeetingComponent } from './reusableComponents/online-meeting/online-meeting.component';
import { QuickLinkIconsComponent } from './reusableComponents/quick-link-icons/quick-link-icons.component';
import { TooltipModule } from 'primeng/tooltip';
import { FileDragDropDirective } from './directives/file-drag-drop.directive';
import { DatePickerComponent } from './reusableComponents/date-picker/date-picker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { SortByPipe } from './pipes/sort-by.pipe';
import { LandingPageGridComponent } from './reusableComponents/landing-page-grid/landing-page-grid.component';
import { BookAppointmentComponent } from './models/book-appointment/book-appointment.component';
import { NgPrimeModule } from '../modules/ng-prime/ng-prime.module';
import { NamePipe } from '../modules/appointment/components/calendar/calendar-view/name.pipe';
import { FileDropImportComponent } from './reusableComponents/file-drop-import/file-drop-import.component';
import { CustomTagsComponent } from './reusableComponents/custom-tags/custom-tags.component';
import { PhoneNumberFormatDirective } from './directives/phone-number-format.directive';
import { BusinessHoursComponent } from './reusableComponents/business-hours/business-hours.component';
import { AiContentComponent } from './reusableComponents/ai-content/ai-content.component';
import { SidebarHeaderComponent } from './components/new-sidebar/sidebar-header/sidebar-header.component';
import { SidebarFooterComponent } from './components/new-sidebar/sidebar-footer/sidebar-footer.component';
import { SidebarStaticLinksComponent } from './components/new-sidebar/sidebar-static-links/sidebar-static-links.component';
import { CustomCheckboxComponent } from './reusableComponents/custom-checkbox/custom-checkbox.component';
import { PopupLandingPagesComponent } from './reusableComponents/popup-landing-pages/popup-landing-pages.component';
import { AiButtonComponent } from './reusableComponents/ai-content/ai-button/ai-button.component';
import { LoggerService } from './services/logger.service';
import { CustomCheckbox1Component } from './reusableComponents/custom-checkbox1/custom-checkbox1.component';
import { TwoWayTextChatComponent } from './reusableComponents/two-way-text-chat/two-way-text-chat.component';
import { TemplatesModelComponent } from './reusableComponents/templates-modal/templates-modal.component';
import { LeadInfoCardComponent } from './reusableComponents/lead-info-card/lead-info-card.component';
import { CustomDateFormatterPipe } from './pipes/custom-date-formatter.pipe';
import { NewSidebar3Component } from './components/new-sidebar/new-sidebar3/new-sidebar3.component';
import { AssignTagsComponent } from './reusableComponents/assign-tags/assign-tags.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BuyPacksComponent } from './reusableComponents/buy-packs/buy-packs.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BuyRow } from './reusableComponents/buy-packs/buy-row/buy-row.component';
import { UrlPreviewNewComponent } from './reusableComponents/url-preview-new/url-preview-new.component';
import { EmailEditorWithTemplatesComponent } from './reusableComponents/email-editor-with-templates/email-editor-with-templates.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FilterPipe } from './pipes/filter.pipe';
import { CustomPanelComponent } from './reusableComponents/custom-panel/custom-panel.component';
import { PatientInfoCardComponent } from './reusableComponents/patient-info-card/patient-info-card.component';
import { Ucs2ToUtf8Pipe } from './pipes/ucs2-to-utf8.pipe';
import { CustomStatusBoxComponent } from './reusableComponents/custom-status-box/custom-status-box.component';

import { StripePayment } from './reusableComponents/stripe-payment/stripe-payment.component';
import { UnreadSmsCountPipe } from './pipes/unread-sms-count.pipe';
import { DndDirective } from '../modules/social-media-manager/social-media-library/dnd.directive';
import { ProgressComponent } from '../modules/social-media-manager/social-media-library/add-library/progress/progress.component';
import { PreviewFileComponent } from './reusableComponents/preview-file/preview-file.component';
import { ErrorSuccessPanelComponent } from './reusableComponents/error-success-panel/error-success-panel.component';
import { AiImageComponent } from './reusableComponents/ai-image/ai-image.component';
import { QuickLinkIconV1Component } from './reusableComponents/quick-link-icons/quick-link-icon-v1/quick-link-icon-v1.component';
import { LoaderComponent } from './reusableComponents/loader/loader.component';
import { InternetBannerComponent } from './components/internet-banner/internet-banner.component';
import { AddLeadsComponent } from './reusableComponents/add-leads/add-leads.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { HtmlEditorComponent } from './reusableComponents/html-editor/html-editor.component';
import { LayoutSelectorComponent } from './reusableComponents/html-editor/components/layout-selector/layout-selector.component';
import { SelectReviewPopupComponent } from './reusableComponents/html-editor/components/select-review-popup/select-review-popup.component';
import { NumberToArrayPipe } from './pipes/number-to-array.pipe';
import { FileIconPreviewComponent } from './reusableComponents/file-icon-preview/file-icon-preview.component';
import { NoLeadingSpaceDirective } from './directives/no-leading-space.directive';
import { CKEditorModule } from 'ckeditor4-angular';
import { Ng2SearchPipe } from './pipes/ng2-search.pipe';

@NgModule({
  declarations: [
    DeleteWarningComponent,
    HeaderComponent,
    ErrorStylingDirectiveDirective,
    BreadcrumbComponent,
    UrlPreviewComponent,
    SafeUrlPipe,
    SafeHtmlPipe,
    PaymentComponent,
    PublicPaymentComponent,
    NewEditorComponent,
    OldEditorComponent,
    ImportFileComponent,
    ExportFileComponent,
    EmailSmsAuditBannerComponent,
    PachagePaymentComponent,
    LandingFilterPipe,
    ThankYouComponent,
    CommaSeparatorPipe,
    AwsChimeOnlineMeetingComponent,
    RemoveSpecialCharFromLpNamePipe,
    OnlineMeetingComponent,
    QuickLinkIconsComponent,
    FileDragDropDirective,
    DatePickerComponent,
    SortByPipe,
    LandingPageGridComponent,
    BookAppointmentComponent,
    NamePipe,
    FileDropImportComponent,
    CustomTagsComponent,
    PhoneNumberFormatDirective,
    BusinessHoursComponent,
    AiContentComponent,
    SidebarHeaderComponent,
    SidebarFooterComponent,
    SidebarStaticLinksComponent,
    CustomCheckboxComponent,
    PopupLandingPagesComponent,
    AiButtonComponent,
    CustomCheckbox1Component,
    NewSidebar3Component,
    AssignTagsComponent,
    TwoWayTextChatComponent,
    TemplatesModelComponent,
    LeadInfoCardComponent,
    CustomDateFormatterPipe,
    BuyPacksComponent,
    BuyRow,
    UrlPreviewNewComponent,
    EmailEditorWithTemplatesComponent,
    FilterPipe,
    CustomPanelComponent,
    PatientInfoCardComponent,
    Ucs2ToUtf8Pipe,
    CustomStatusBoxComponent,
    StripePayment,
    UnreadSmsCountPipe,
    DndDirective,
    ProgressComponent,
    PreviewFileComponent,
    AiImageComponent,
    ErrorSuccessPanelComponent,
    QuickLinkIconV1Component,
    LoaderComponent,
    InternetBannerComponent,
    AddLeadsComponent,
    HtmlEditorComponent,
    LayoutSelectorComponent,
    SelectReviewPopupComponent,
    NumberToArrayPipe,
    FileIconPreviewComponent,
    NoLeadingSpaceDirective,
    Ng2SearchPipe
  ],
  imports: [
    CommonModule,
    MatRadioModule,
    MatSelectModule,
    NgxUiLoaderModule,
    FormsModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    RouterModule,
    DialogModule,
    NgxStripeModule.forRoot(''),
    TooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    NgxMatDatetimePickerModule,
    NgxMatMomentModule,
    NgPrimeModule,
    CarouselModule,
    NgxIntlTelInputModule,
    CKEditorModule,
  ],
  exports: [
    NgxUiLoaderModule,
    FormsModule,
    DeleteWarningComponent,
    ReactiveFormsModule,
    HeaderComponent,
    BreadcrumbComponent,
    UrlPreviewComponent,
    SafeUrlPipe,
    SafeHtmlPipe,
    PaymentComponent,
    PublicPaymentComponent,
    OldEditorComponent,
    NewEditorComponent,
    ImportFileComponent,
    ExportFileComponent,
    PachagePaymentComponent,
    StripePayment,
    EmailSmsAuditBannerComponent,
    LandingFilterPipe,
    CommaSeparatorPipe,
    AwsChimeOnlineMeetingComponent,
    RemoveSpecialCharFromLpNamePipe,
    OnlineMeetingComponent,
    QuickLinkIconsComponent,
    FileDragDropDirective,
    DatePickerComponent,
    SortByPipe,
    LandingPageGridComponent,
    BookAppointmentComponent,
    NamePipe,
    FileDropImportComponent,
    CustomTagsComponent,
    PhoneNumberFormatDirective,
    BusinessHoursComponent,
    AiContentComponent,
    CustomCheckboxComponent,
    CustomCheckbox1Component,
    PopupLandingPagesComponent,
    AiButtonComponent,
    NewSidebar3Component,
    AssignTagsComponent,
    TwoWayTextChatComponent,
    TemplatesModelComponent,
    LeadInfoCardComponent,
    CustomDateFormatterPipe,
    UrlPreviewNewComponent,
    EmailEditorWithTemplatesComponent,
    FilterPipe,
    CustomPanelComponent,
    PatientInfoCardComponent,
    Ucs2ToUtf8Pipe,
    CustomStatusBoxComponent,
    UnreadSmsCountPipe,
    DndDirective,
    ProgressComponent,
    PreviewFileComponent,
    AiImageComponent,
    ErrorSuccessPanelComponent,
    QuickLinkIconV1Component,
    LoaderComponent,
    InternetBannerComponent,
    AddLeadsComponent,
    HtmlEditorComponent,
    NumberToArrayPipe,
    FileIconPreviewComponent,
    Ng2SearchPipe
  ],
  providers: [ApiService, LocalStorageService, LoggerService]
})
export class SharedModule {}
