import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileManagerComponent } from './file-manager.component';
import { AddFileComponent } from './add-file/add-file.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { NgPrimeModule } from '../ng-prime/ng-prime.module';
import { FileManagerRoutingModule } from './file-manager-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddFileTagComponent } from './add-file-tag/add-file-tag.component';
import { ListFileTagComponent } from './list-file-tag/list-file-tag.component';
import { RouterModule } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MyFolderComponent } from './my-folder/my-folder.component';
import { AddFolderComponent } from './my-folder/add-folder/add-folder.component';
import { FolderListComponent } from './my-folder/folder-list/folder-list.component';
import { FilesListByFolderComponent } from './my-folder/files-list-by-folder/files-list-by-folder.component';
import { AddFileModalComponent } from './my-folder/add-file-modal/add-file-modal.component';
import { ImagePreviewComponent } from './my-folder/image-preview/image-preview.component';

@NgModule({
  declarations: [
    FileManagerComponent,
    AddFileComponent,
    AddFileTagComponent,
    ListFileTagComponent,
    MyFolderComponent,
    AddFolderComponent,
    FolderListComponent,
    FilesListByFolderComponent,
    AddFileModalComponent,
    ImagePreviewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    PaginatorModule,
    NgPrimeModule,
    FileManagerRoutingModule,
    MatMenuModule
  ]
})
export class FileManagerModule {}
