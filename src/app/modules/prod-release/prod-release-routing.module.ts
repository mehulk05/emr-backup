import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdReleaseItemsComponent } from './components/prod-release-items/prod-release-items.component';

const routes: Routes = [
  {
    path: '',
    component: ProdReleaseItemsComponent,
    data: {
      breadcrumb: 'Release Items'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProdReleaseRoutingModule {}
