import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { AddEditLandingpageComponent } from './components/add-edit-landingpage/add-edit-landingpage.component';
import { LandingpageListComponent } from './components/landingpage-list/landingpage-list.component';
import { LandingpageServiceListComponent } from './components/landingpage-list/landingpage-service/landingpage-service-list/landingpage-service-list.component';
import { LandingPageOtherComponent } from './components/landing-page-other/landing-page-other.component';

const routes: Routes = [
  {
    path: 'create',
    component: AddEditLandingpageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Create Landing Page'
    }
  },
  {
    path: '',
    component: LandingpageListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ':id/edit',
    component: AddEditLandingpageComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Landing Page'
    }
  },
  {
    path: 'service-landing-page',
    data: {
      breadcrumb: 'Relevant Templates'
    },
    component: LandingpageServiceListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'service-landing-other',
    data: {
      breadcrumb: 'Other Templates'
    },
    component: LandingPageOtherComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule {}
