import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PostLabelRoutingModule } from './post-label-routing.module';
import { PostLabelListComponent } from './components/post-label-list/post-label-list.component';
import { AddEditPostLabelComponent } from './components/add-edit-post-label/add-edit-post-label.component';

@NgModule({
  declarations: [PostLabelListComponent, AddEditPostLabelComponent],
  imports: [
    CommonModule,
    PostLabelRoutingModule,
    FormsModule,
    NgPrimeModule,
    SharedModule
  ]
})
export class PostLabelModule {}
