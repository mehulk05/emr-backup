import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { ApiDetailsComponent } from './components/api-details/api-details.component';
import { BusinessTabComponent } from './components/business-tab/business-tab.component';
import { ApiCardIntegrationComponent } from './components/api-card-integration/api-card-integration.component';
import { ModmedComponent } from './components/modmed/modmed.component';
import { SupportCenterComponent } from './components/support-center/support-center.component';
import { ApiIntegrationComponent } from './components/api-integration/api-integration.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessTabComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Business Profile',
      hideSideBar: false,
      hideHeader: false
    }
  },
  {
    path: 'support-center',
    component: SupportCenterComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Support Center',
      hideParent: true
    }
  },
  {
    path: 'api-integration',
    component: ApiCardIntegrationComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'API Integration',
      hideParent: true
    },
    children: [
      {
        path: 'api/modmed',
        component: ModmedComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'Modmed API Details',
          hideParent: true
        }
      },
      {
        path: 'api/details',
        component: ApiIntegrationComponent,
        canActivate: [AuthGuard],
        data: {
          breadcrumb: 'API Details',
          hideParent: true
        }
      }
    ]
  },
  {
    path: 'api-details',
    component: ApiDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'API Details',
      hideParent: true
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule {}
