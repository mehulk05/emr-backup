import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataStudioTabsComponent } from './component/data-studio-tabs/data-studio-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: DataStudioTabsComponent,
    data: {
      breadcrumb: 'Data Studio Report'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataStudioRoutingModule {}
