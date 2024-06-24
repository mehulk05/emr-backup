import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleAndMenuRoutingModule } from './role-and-menu-routing.module';
import { AddEditRoleComponent } from './components/add-edit-role/add-edit-role.component';
import { SelectedRoleListComponent } from './components/selected-role-list/selected-role-list.component';
import { AllRoleListComponent } from './components/all-role-list/all-role-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomRoleMenuComponent } from './components/custom-role-menu/custom-role-menu.component';
import { CustomRoleSingleMenuComponent } from './components/custom-role-single-menu/custom-role-single-menu.component';
import { MenuItemComponent } from './common/menu-item/menu-item.component';
import { DragableMenuComponent } from './components/dragable-menu/dragable-menu.component';
import { CutomRoleContainerV1Component } from './components/cutom-role-container-v1/cutom-role-container-v1.component';
import { MenuItemV1Component } from './common/menu-item-v1/menu-item-v1.component';
import { AddRoleFormComponent } from './components/add-role-form/add-role-form.component';
import { CustomRoleListComponent } from './components/custom-role-list/custom-role-list.component';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';

@NgModule({
  declarations: [
    AddEditRoleComponent,
    SelectedRoleListComponent,
    AllRoleListComponent,
    CustomRoleMenuComponent,
    CustomRoleSingleMenuComponent,
    MenuItemComponent,
    DragableMenuComponent,
    CutomRoleContainerV1Component,
    MenuItemV1Component,
    AddRoleFormComponent,
    CustomRoleListComponent
  ],
  imports: [
    CommonModule,
    RoleAndMenuRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgPrimeModule,
    DragDropModule
  ]
})
export class RoleAndMenuModule {}
