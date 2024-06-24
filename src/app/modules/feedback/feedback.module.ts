import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackRoutingModule } from './feedback-routing.module';
import { FeedbackRequestComponent } from './component/feedback-request/feedback-request.component';

@NgModule({
  declarations: [FeedbackRequestComponent],
  imports: [CommonModule, FeedbackRoutingModule]
})
export class FeedbackModule {}
