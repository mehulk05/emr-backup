import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialMediaLibraryComponent } from './social-media-library.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddLibraryComponent } from './add-library/add-library.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { MediaTagsComponent } from './media-tags/media-tags.component';
import { NgPrimeModule } from '../../ng-prime/ng-prime.module';
import { EditMediaTagComponent } from './edit-media-tag/edit-media-tag.component';
import { MediaFolderListComponent } from './media-folder-list/media-folder-list.component';
import { AddEditMediaFolderComponent } from './add-edit-media-folder/add-edit-media-folder.component';
import { MatMenuModule } from '@angular/material/menu';
import { MediaFileFolderListComponent } from './media-file-folder-list/media-file-folder-list.component';
import { AddEditMediaFileComponent } from './add-edit-media-file/add-edit-media-file.component';
import { MediaFilePreviewComponent } from './media-file-preview/media-file-preview.component';
import { ViewTagsComponent } from './view-tags/view-tags.component';

const routes: Routes = [
  {
    path: '',
    component: SocialMediaLibraryComponent,
    data: {
      breadcrumb: 'Library'
    }
  },
  {
    path: 'folder',
    component: MediaFolderListComponent,
    data: {
      breadcrumb: 'Media Folder',
      parenClickable: false
    }
  },
  {
    path: 'folder/:id',
    component: MediaFileFolderListComponent,
    data: {
      breadcrumb: 'Media Files & Folder',
      parentUrl: '/media/library/folder'
    }
  },
  {
    path: 'folder/:id/subfolder/:subfolderId',
    component: MediaFileFolderListComponent,
    data: {
      breadcrumb: 'Media Files & Folder',
      parentUrl: '/media/library/folder/:id'
    }
  },
  {
    path: 'add',
    component: AddLibraryComponent,
    data: {
      breadcrumb: 'Add'
    }
  },
  {
    path: 'addTag',
    component: MediaTagsComponent,
    data: {
      breadcrumb: 'Add Tag'
    }
  },
  {
    path: 'editTag/:id',
    component: EditMediaTagComponent,
    data: {
      breadcrumb: 'Edit Tag'
    }
  },
  {
    path: 'editTag',
    component: EditMediaTagComponent,
    data: {
      breadcrumb: 'Add Tag'
    }
  }
];

@NgModule({
  declarations: [
    SocialMediaLibraryComponent,
    AddLibraryComponent,
    MediaTagsComponent,
    EditMediaTagComponent,
    MediaFolderListComponent,
    MediaFileFolderListComponent,
    AddEditMediaFolderComponent,
    AddEditMediaFileComponent,
    MediaFilePreviewComponent,
    ViewTagsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PaginatorModule,
    NgPrimeModule,
    MatMenuModule
  ]
})
export class SocialMediaLibraryModule {}
