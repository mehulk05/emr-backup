import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineDemoRoutingModule } from './online-demo-routing.module';
import { OnlineDemoPageComponent } from './components/online-demo-page/online-demo-page.component';

@NgModule({
  declarations: [OnlineDemoPageComponent],
  imports: [CommonModule, OnlineDemoRoutingModule]
})
export class OnlineDemoModule {}
