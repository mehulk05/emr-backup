import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { MenuConfigComponent } from './components/menu-config/menu-config.component';
import { BusinessMenuConfigComponent } from './components/business-menu-config/business-menu-config.component';

const routes: Routes = [
  // {
  //   path: 'order',
  //   component: MenuOrderFormComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    //not able to find link
    path: 'menu-config',
    component: MenuConfigComponent,
    canActivate: [AuthGuard]
  },
  {
    //not able to find link
    path: 'business-menu-config',
    component: BusinessMenuConfigComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule {}
