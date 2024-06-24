import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountRegisterComponent } from './modules/authentication/components/account-register/account-register.component';
import { UserLoginComponent } from './modules/authentication/components/user-login/user-login.component';
import { ThankYouComponent } from './shared/reusableComponents/thank-you/thank-you.component';
import { BuyPacksComponent } from './shared/reusableComponents/buy-packs/buy-packs.component';

const routes: Routes = [
  {
    path: 'appointment',
    loadChildren: () =>
      import('./modules/appointment/appointment.module').then(
        (m) => m.AppointmentModule
      ),
    data: {
      breadcrumb: 'Appointment'
    }
  },

  {
    path: 'feedback',
    loadChildren: () =>
      import('./modules/feedback/feedback.module').then(
        (m) => m.FeedbackModule
      ),
    data: {
      breadcrumb: 'Feedback'
    }
  },

  {
    path: 'reviews',
    loadChildren: () =>
      import('./modules/five-star-review/five-star-review.module').then(
        (m) => m.FiveStarReviewModule
      ),
    data: {
      breadcrumb: '5-star Review'
    }
  },

  {
    path: 'online-demo',
    loadChildren: () =>
      import('./modules/online-demo/online-demo.module').then(
        (m) => m.OnlineDemoModule
      ),
    data: {
      breadcrumb: 'Online Demo'
    }
  },

  /* -------------------------------------------------------------------------- */
  /*                           Patitent portal routing                          */
  /* -------------------------------------------------------------------------- */
  {
    path: 'patient-portal',
    loadChildren: () =>
      import(
        './modules/patient-portal-module/patient-portal-module.module'
      ).then((m) => m.PatientPortalModuleModule)
  },
  {
    path: 'public',
    loadChildren: () =>
      import('./modules/public-accessible/public-accessible.module').then(
        (m) => m.PublicAccessibleModule
      ),
    data: {
      breadcrumb: 'Landing Pages'
    }
  },
  {
    path: 'business',
    loadChildren: () =>
      import('./modules/account-and-settings/business/business.module').then(
        (m) => m.BusinessModule
      ),
    data: {
      breadcrumb: 'Business',
      hideSideBar: false,
      hideHeader: false
    }
  },
  {
    path: 'billing',
    loadChildren: () =>
      import('./modules/billing/billing.module').then((m) => m.BillingModule),
    data: {
      breadcrumb: 'Billing'
    }
  },
  {
    path: 'file-manager',
    loadChildren: () =>
      import('./modules/file-manager/file-manager.module').then(
        (m) => m.FileManagerModule
      ),
    data: {
      breadcrumb: 'File-Manager'
    }
  },

  {
    path: 'role-manager',
    loadChildren: () =>
      import('./modules/role-and-menu/role-and-menu.module').then(
        (m) => m.RoleAndMenuModule
      ),
    data: {
      breadcrumb: 'Role-Manager'
    }
  },

  {
    path: 'importExportCenter',
    loadChildren: () =>
      import('./modules/import-export-center/import-export-center.module').then(
        (m) => m.ImportExportCenterModule
      ),
    data: {
      breadcrumb: 'Import Export Center'
    }
  },
  {
    path: 'clinics',
    loadChildren: () =>
      import('./modules/account-and-settings/clinic/clinic.module').then(
        (m) => m.ClinicModule
      ),
    data: {
      breadcrumb: 'Clinics'
    }
  },
  /* ---------------------------------- Chat ---------------------------------- */
  {
    path: 'chat',
    loadChildren: () =>
      import('./modules/chat/chat.module').then((m) => m.ChatModule),
    data: {
      breadcrumb: 'Chat'
    }
  },

  /* -------------------------------- Category -------------------------------- */
  {
    path: 'categories',
    loadChildren: () =>
      import(
        './modules/account-and-settings/service-category/service-category.module'
      ).then((m) => m.ServiceCategoryModule),
    data: {
      breadcrumb: 'Categories'
    }
  },
  /* ------------------------------- Landingpage ------------------------------ */
  {
    path: 'landingpage',
    loadChildren: () =>
      import('./modules/landing-page/landing-page.module').then(
        (m) => m.LandingPageModule
      ),
    data: {
      breadcrumb: 'Landing Pages'
    }
  },
  /* ------------------------------- MultiPageWebsite ------------------------------ */
  {
    path: 'multipage-website',
    loadChildren: () =>
      import('./modules/multi-page-website/multi-page-website.module').then(
        (m) => m.MultiPageWebsiteModule
      ),
    data: {
      breadcrumb: 'Multi Page Website'
    }
  },

  /* ------------------------------ Website route ----------------------------- */
  {
    path: 'website',
    loadChildren: () =>
      import('./modules/website/website.module').then((m) => m.WebsiteModule),
    data: {
      breadcrumb: 'Website Templates'
    }
  },
  /* ------------------------------ Patient route ----------------------------- */
  {
    path: 'patients',
    loadChildren: () =>
      import('./modules/pateint/pateint.module').then((m) => m.PateintModule),
    data: {
      breadcrumb: 'Patients'
    }
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./modules/user/user.module').then((m) => m.UserModule),
    data: {
      breadcrumb: 'Users'
    }
  },

  {
    path: 'services',
    loadChildren: () =>
      import('./modules/account-and-settings/mservice/mservice.module').then(
        (m) => m.MserviceModule
      ),
    data: {
      breadcrumb: 'Services'
    }
  },
  {
    path: 'triggers',

    loadChildren: () =>
      import('./modules/marketing/mass-email-sms/mass-email-sms.module').then(
        (m) => m.MassEmailSmsModule
      ),
    data: {
      breadcrumb: 'Triggers'
    }
  },
  {
    path: 'stripe',
    loadChildren: () =>
      import('./modules/account-and-settings/stripe/stripe.module').then(
        (m) => m.StripeModule
      ),
    data: {
      breadcrumb: 'Stripe'
    }
  },
  {
    path: 'clinical-doc',
    loadChildren: () =>
      import('./modules/marketing/questionarie/questionarie.module').then(
        (m) => m.QuestionarieModule
      )
    // data: {
    //   breadcrumb: 'Marketing'
    // }
  },
  /* ------------------------------ Deleted Patients ----------------------------- */
  {
    path: 'deleted-patients',
    loadChildren: () =>
      import('./modules/deleted-patients/deleted-patients.module').then(
        (m) => m.DeletedPatientsModule
      ),
    data: {
      breadcrumb: 'Patients'
    }
  },
  /* -------------------------------- Lead tags ------------------------------- */
  {
    path: 'tags',
    loadChildren: () =>
      import('./modules/lead-tag/lead-tag.module').then((m) => m.LeadTagModule),
    data: {
      breadcrumb: 'Leads'
    }
  },

  /* ------------------------------- Data studio ------------------------------ */
  {
    path: 'datastudio',
    loadChildren: () =>
      import('./modules/data-studio/data-studio.module').then(
        (m) => m.DataStudioModule
      ),
    data: {
      breadcrumb: 'Dashboard and Reports'
    }
  },

  /* ------------------------------ Deleted leads ----------------------------- */
  {
    path: 'deleted-leads',
    loadChildren: () =>
      import('./modules/deleted-lead/deleted-lead.module').then(
        (m) => m.DeletedLeadModule
      ),
    data: {
      breadcrumb: 'Leads'
    }
  },
  /* ---------------------------------- Leads --------------------------------- */
  {
    path: 'leads',
    loadChildren: () =>
      import('./modules/leads/leads.module').then((m) => m.LeadsModule),
    data: {
      breadcrumb: 'Leads'
    }
  },
  /* ---------------------------- Integration page ---------------------------- */
  {
    path: 'integration',
    loadChildren: () =>
      import('./modules/integration/integration.module').then(
        (m) => m.IntegrationModule
      ),
    data: {
      breadcrumb: 'Integration Center'
    }
  },
  /* ----------------------------- Payment module ----------------------------- */
  {
    path: 'payments',
    loadChildren: () =>
      import('./modules/payments/payments.module').then(
        (m) => m.PaymentsModule
      ),
    data: {
      breadcrumb: 'Payment'
    }
  },
  {
    path: 'post-library',
    loadChildren: () =>
      import(
        './modules/social-media-manager/post-library/post-library.module'
      ).then((m) => m.PostLibraryModule),
    data: {
      breadcrumb: 'Social-Media'
    }
  },
  {
    path: 'media/library',
    loadChildren: () =>
      import(
        './modules/social-media-manager/social-media-library/social-media-library.module'
      ).then((m) => m.SocialMediaLibraryModule),
    data: {
      breadcrumb: 'Social-Media'
    }
  },
  {
    path: 'post-library-label',
    loadChildren: () =>
      import(
        './modules/social-media-manager/post-label/post-label.module'
      ).then((m) => m.PostLabelModule),
    data: {
      breadcrumb: 'Social-Media'
    }
  },
  {
    path: 'vc',
    loadChildren: () =>
      import('./modules/virtual-consultation/virtual-consultation.module').then(
        (m) => m.VirtualConsultationModule
      ),
    data: {
      breadcrumb: 'Self Assessment'
    }
  },

  {
    path: 'smstemplate',
    loadChildren: () =>
      import('./modules/marketing/sms-template/sms-template.module').then(
        (m) => m.SmsTemplateModule
      )
  },
  {
    path: 'emailtemplates',
    loadChildren: () =>
      import('./modules/marketing/email-template/email-template.module').then(
        (m) => m.EmailTemplateModule
      )
  },

  {
    //migrated
    path: 'registration',
    loadChildren: () =>
      import('./modules/authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      )
    // data: {
    //   hideSideBar: true,
    //   hideHeader: true
    // }
  },
  {
    path: 'tasks',
    loadChildren: () =>
      import('./modules/task/task.module').then((m) => m.TaskModule),
    data: {
      breadcrumb: 'Tasks'
    }
  },
  {
    path: 'sourceurl',
    loadChildren: () =>
      import('./modules/lead-sourceurl/lead-sourceurl.module').then(
        (m) => m.LeadSourceurlModule
      ),
    data: {
      breadcrumb: 'Lead Source URLs'
    }
  },
  {
    path: 'ptag',
    loadChildren: () =>
      import('./modules/patient-tag/patient-tag.module').then(
        (m) => m.PatientTagModule
      ),
    data: {
      breadcrumb: 'Patient Tag'
    }
  },

  //   {
  //     path: 'prod-release',
  //     loadChildren: () =>
  //       import('./modules/prod-release/prod-release.module').then(
  //         (m) => m.ProdReleaseModule
  //       ),
  //     data: {
  //       breadcrumb: 'Prod Release'
  //     }
  //   },
  {
    path: 'prod-release',
    loadChildren: () =>
      import('./modules/production-release/production-release.module').then(
        (m) => m.ProductionReleaseModule
      ),
    data: {
      breadcrumb: 'Production Release'
    }
  },

  {
    path: 'form-builder',
    loadChildren: () =>
      import('./modules/form-builder/form-builder.module').then(
        (m) => m.FormBuilderModule
      ),
    data: {
      breadcrumb: 'Form Builder'
    }
  },
  {
    path: 'review-form',
    loadChildren: () =>
      import('./modules/form-builder/review-form.module').then(
        (m) => m.ReviewFormModule
      ),
    data: {
      breadcrumb: 'Review generation forms'
    }
  },
  { path: '', component: UserLoginComponent },
  { path: 'sign-up', component: AccountRegisterComponent },
  {
    //migrated
    path: 'ap-booking',
    loadChildren: () =>
      import('./modules/public-appointment/public-appointment.module').then(
        (m) => m.PublicAppointmentModule
      ),
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  },
  {
    path: 'thankyou',
    component: ThankYouComponent,
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  },
  {
    path: 'show-packs',
    component: BuyPacksComponent,
    data: {
      breadcrumb: 'Email-SMS Plans'
    }
  },
  {
    path: 'email/unsubscribe',
    loadChildren: () =>
      import('./modules/public-accessible/public-accessible.module').then(
        (m) => m.PublicAccessibleModule
      ),
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  },
  {
    path: 'sheet-report',
    loadChildren: () =>
      import('./modules/sheet-report/sheet-report.module').then(
        (m) => m.SheetReportModule
      ),
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  },
  {
    path: 'menus',
    loadChildren: () =>
      import('./modules/menu/menu.module').then((m) => m.MenuModule),
    data: {
      breadcrumb: 'Menu Configuration'
    }
  },
  {
    path: 'notification-center',
    loadChildren: () =>
      import(
        './modules/account-and-settings/notification-center/notification-center.module'
      ).then((m) => m.NotificationCenterModule),
    data: {
      breadcrumb: 'Notification Center'
    }
  },
  {
    path: 'two-way-text',
    loadChildren: () =>
      import('./modules/two-way-text/two-way-text.module').then(
        (m) => m.TwoWayTextModule
      ),
    data: {
      breadcrumb: 'Two Way Text'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
