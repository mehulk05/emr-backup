import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedbackRequestComponent } from './component/feedback-request/feedback-request.component';

const routes: Routes = [
  {
    path: '',
    component: FeedbackRequestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule {}
