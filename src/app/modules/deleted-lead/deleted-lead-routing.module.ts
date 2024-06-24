import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { DeletedLeadListComponent } from './components/deleted-lead-list/deleted-lead-list.component';

const routes: Routes = [
  {
    path: '',
    component: DeletedLeadListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Deleted Leads'
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeletedLeadRoutingModule {}
