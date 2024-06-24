import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuConfigComponent } from './components/menu-config/menu-config.component';
import { MenuComponent } from './components/menu/menu.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MenuFormComponent } from './components/menu-form/menu-form.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BusinessMenuConfigComponent } from './components/business-menu-config/business-menu-config.component';

@NgModule({
  declarations: [
    MenuConfigComponent,
    MenuComponent,
    MenuFormComponent,
    BusinessMenuConfigComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    DragDropModule,
    SharedModule,
    NgPrimeModule
  ]
})
export class MenuModule {}
