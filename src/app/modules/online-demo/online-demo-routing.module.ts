import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnlineDemoPageComponent } from './components/online-demo-page/online-demo-page.component';

const routes: Routes = [
  {
    path: '',
    component: OnlineDemoPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnlineDemoRoutingModule {}
