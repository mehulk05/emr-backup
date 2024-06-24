import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailUnsubscribeComponent } from './components/email-unsubscribe/email-unsubscribe.component';
import { PublicDynamicFormPageComponent } from './components/public-dynamic-form-page/public-dynamic-form-page.component';
import { PublicG99ClinicReviewReportPageComponent } from './components/public-g99-clinic-review-report-page/public-g99-clinic-review-report-page.component';
import { PublicLandingpageComponent } from './components/public-landingpage/public-landingpage.component';
import { HtmlEditorComponent } from 'src/app/shared/reusableComponents/html-editor/html-editor.component';

const routes: Routes = [
  {
    path: 'htmlEditor',
    component: HtmlEditorComponent,
    data: {
      breadcrumb: 'Editor'
    }
  },
  {
    path: 'landingPage',
    component: PublicLandingpageComponent,
    data: {
      breadcrumb: 'List'
    }
  },
  {
    path: 'reviews/report/:key',
    component: PublicG99ClinicReviewReportPageComponent,
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  },
  {
    path: 'v2/form/:bid/:fid',
    component: PublicDynamicFormPageComponent,
    data: {
      hideSideBar: true,
      hideHeader: true
    }
  },
  {
    path: ':tenantId/:userType',
    component: EmailUnsubscribeComponent,
    data: {
      breadcrumb: 'List'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicAccessibleRoutingModule {}
