import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth-guards/auth.guard';
import { FileManagerComponent } from './file-manager.component';
import { AddFileComponent } from './add-file/add-file.component';
import { ListFileTagComponent } from './list-file-tag/list-file-tag.component';
import { AddFileTagComponent } from './add-file-tag/add-file-tag.component';
import { FolderListComponent } from './my-folder/folder-list/folder-list.component';
import { FilesListByFolderComponent } from './my-folder/files-list-by-folder/files-list-by-folder.component';

const routes: Routes = [
  {
    path: '',
    component: FileManagerComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'All Data'
    }
  },
  {
    path: 'my-folders',
    component: FolderListComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'My Folders',
      parenClickable: false
    }
  },
  {
    path: 'my-folders/:id',
    component: FilesListByFolderComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'My Folders and Files',
      parentUrl: '/file-manager/my-folders'
    }
  },
  {
    path: 'my-folders/:id/subfolder/:subfolderId',
    component: FilesListByFolderComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Sub Folder',
      parentUrl: '/file-manager/my-folders/:id'
  }
  },
  {
    path: 'tags',
    component: ListFileTagComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Tags',
      parenClickable: false
    }
  },
  {
    path: 'tag/edit/:id',
    component: AddFileTagComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit Tag'
    }
  },
  {
    path: 'tag/add',
    component: AddFileTagComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Add Tag'
    }
  },
  {
    path: 'add',
    component: AddFileComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Add'
    }
  },
  {
    path: 'edit',
    component: AddFileComponent,
    canActivate: [AuthGuard],
    data: {
      breadcrumb: 'Edit'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FileManagerRoutingModule {}
