import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProdReleaseRoutingModule } from './prod-release-routing.module';
import { ProdReleaseItemsComponent } from './components/prod-release-items/prod-release-items.component';

@NgModule({
  declarations: [ProdReleaseItemsComponent],
  imports: [CommonModule, ProdReleaseRoutingModule]
})
export class ProdReleaseModule {}
