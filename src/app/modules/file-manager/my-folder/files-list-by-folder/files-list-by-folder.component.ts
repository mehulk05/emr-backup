import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FileManagerService } from '../../services/file-manager.service';
import { FileTypeService } from '../../services/file-type.service';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-files-list-by-folder',
  templateUrl: './files-list-by-folder.component.html',
  styleUrls: ['./files-list-by-folder.component.css']
})
export class FilesListByFolderComponent implements OnInit {
  globalFilterColumn = [
    'id',
    'filename',
    'name',
    'actions',
    'createdBy',
    'createdAt'
  ];
  tags: any[] = [];
  columns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'File Type', field: 'location', order: 2 },
    { header: 'File Name', field: 'filename', order: 3 },
    { header: 'Tags', field: 'socialTags', order: 3 },
    { header: 'Sharing', field: 'isPrivate', order: 4 },
    { header: 'created By', field: 'createdBy', order: 6 },
    { header: 'Created At', field: 'createdAt', order: 4 },
    { header: 'Actions', field: 'actions', order: 9 }
  ];
  _selectedColumns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'File Type', field: 'location', order: 2 },
    { header: 'File Name', field: 'filename', order: 3 },
    { header: 'Tags', field: 'socialTags', order: 3 },
    { header: 'Sharing', field: 'isPrivate', order: 4 },
    { header: 'created By', field: 'createdBy', order: 6 },
    { header: 'Created At', field: 'createdAt', order: 4 },
    { header: 'Actions', field: 'actions', order: 9 }
  ];

  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    count: 0
  };
  pageSearchFilter: any = '';
  totalDataCount: any;
  rowData: any;
  showAddFilesModal: boolean;
  selectedFileId: any;
  folderList: any;
  folderId: any;
  showImagePreviewModal: boolean;
  selectedData: any;
  showAddFolderModal: boolean;
  editFolderId: any;
  subfolderId: any;
  selectedTag: any = '';
  currentFolderId: any;
  fileList: any;
  dataList: any[];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fileManagerService: FileManagerService,
    private alertService: ToasTMessageService,
    public fileTypeService: FileTypeService,
    public fileSaverService: FileSaverService
  ) {}

  ngOnInit(): void {
    this.getTagList();
    this.activatedRoute.params.subscribe((data: any) => {
      console.log(data);
      // Check if subfolderId is present in the URL
      if (data.subfolderId) {
        this.subfolderId = data.subfolderId;
        this.getFilesBySubFolderId();
      } else {
        this.folderId = data.id;
        this.getFilesByTags(this.selectedTag);
      }
    });
  }

  fetchDataByFolderOrSubFolder() {
    this.subfolderId
      ? this.getFilesBySubFolderId()
      : this.getFilesByTags(this.selectedTag);
  }

  getFilesBySubFolderId() {
    this.fileManagerService
      .getFilesByTagsAndId(this.subfolderId, this.selectedTag)
      .then((data: any) => {
        this.folderList = data?.fileList;

        this.dataList = [...this.folderList];
      });
  }

  getFilesByFolderId() {
    this.fileManagerService
      .getFilesByFolderId(this.folderId)
      .then((data: any) => {
        const folders = data?.folderList.map((folder: any) => ({
          ...folder,
          contentType: 'folder'
        }));
        this.folderList = folders;

        this.fileList = data?.fileList;

        this.dataList = [...this.folderList, ...this.fileList];
      });
  }

  addFiles() {
    this.showAddFilesModal = true;
    this.selectedFileId = null;
    if (this.subfolderId) {
      this.currentFolderId = this.subfolderId;
    } else {
      this.currentFolderId = this.folderId;
    }
  }

  addFolder() {
    console.log('here');
    this.showAddFolderModal = true;
  }

  editPage(data: any) {
    console.log(data);
    this.selectedFileId = data;
    this.showAddFilesModal = true;
  }

  onModalClose(e: any) {
    if (e.type === 'Submit') {
      this.fetchDataByFolderOrSubFolder();
      this.showAddFilesModal = false;
      this.editFolderId = null;
    } else {
      this.showAddFilesModal = false;
      this.editFolderId = null;
    }
  }

  onImagePreviewModalClose() {
    this.showImagePreviewModal = false;
  }

  viewFiles(data: any) {
    if (data.contentType === 'folder') {
      this.router.navigate([
        'file-manager',
        'my-folders',
        this.folderId,
        'subfolder',
        data.id
      ]);
    } else {
      this.selectedData = data;
      this.showImagePreviewModal = true;
    }
    // this.router.navigate(['/file-manager/my-folders', data]);
  }

  editFolderOrFile(data: any) {
    console.log(data);
    if (this.subfolderId) {
      this.currentFolderId = this.subfolderId;
    } else {
      this.currentFolderId = this.folderId;
    }
    if (data.contentType === 'folder') {
      this.showAddFolderModal = true;
      this.editFolderId = data.id;
    } else {
      this.showAddFilesModal = true;
      this.editFolderId = data.id;
    }
  }

  deleteTrash(data: any) {
    if (confirm('Do you want to delete?') == true) {
      if (data.contentType === 'folder') {
        this.deleteFolder(data.id);
      } else {
        this.deleteFile(data.id);
      }
    }
  }

  deleteFolder(data: any) {
    this.fileManagerService.deleteFolder(data).then(
      () => {
        this.alertService.success('File deleted successfully');
        this.fetchDataByFolderOrSubFolder();
      },
      () => {
        this.alertService.error(
          'Unable to delete Folder as it contain some files. Please delete the files inside folder'
        );
      }
    );
  }

  deleteFile(data: any) {
    this.fileManagerService.deleteLibraryById(data).then(
      () => {
        this.alertService.success('File deleted successfully');
        this.fetchDataByFolderOrSubFolder();
      },
      () => {
        this.alertService.error('Unable to delete library image.');
      }
    );
  }
  @Input()
  set selectedColumns(selectedColumns: any) {
    this._selectedColumns = selectedColumns;
    this._selectedColumns.sort((a: any, b: any) => a.order - b.order);
  }

  get selectedColumns(): any {
    return this._selectedColumns;
  }

  onAddFolderModalClose(event: any) {
    if (event.type === 'close') {
      this.showAddFolderModal = false;
    } else {
      this.showAddFolderModal = false;
      this.getFilesByTags(this.selectedTag);
    }
  }

  copyToClipboard(location: any) {
    navigator.clipboard.writeText(location).then(() => {
      this.alertService.info('Copied to clipboard');
    });
  }

  downloadImage(id: any, name: any) {
    this.fileManagerService
      .downloadImage({ id: id })
      .then((data: any) => {
        this.fileSaverService.save(data, name);
      })
      .catch(() => {
        this.alertService.error('Unable to download trigger xlsx.');
      });
  }

  getTagList() {
    this.fileManagerService.fileManagerTagList().then(
      (response: any) => {
        this.tags = response;
      },
      (error) => {
        this.alertService.error(error.message);
      }
    );
  }

  onTagSelected() {
    if (this.selectedTag === 'All') {
      this.pageSearchFilter = '';
    }

    if (this.subfolderId) {
      this.getFilesBySubFolderId();
    } else {
      this.getFilesByTags(this.selectedTag);
    }
  }

  getFilesByTags(selectedTag: string) {
    this.fileManagerService
      .getFilesByTagsAndId(this.folderId, selectedTag)
      .then((data: any) => {
        const folders = data?.folderList.map((folder: any) => ({
          ...folder,
          contentType: 'folder'
        }));
        this.folderList = folders;

        this.fileList = data?.fileList.content;

        this.dataList = [...this.folderList, ...this.fileList];
      });
  }
}
