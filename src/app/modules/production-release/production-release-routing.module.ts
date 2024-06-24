import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionReleaseListComponent } from './services/production-release-list/production-release-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductionReleaseListComponent,
    data: {
      breadcrumb: 'Production Release'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductionReleaseRoutingModule {}
