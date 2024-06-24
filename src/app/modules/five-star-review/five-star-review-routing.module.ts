import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewTabComponent } from './components/review-tab/review-tab.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewTabComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiveStarReviewRoutingModule {}
