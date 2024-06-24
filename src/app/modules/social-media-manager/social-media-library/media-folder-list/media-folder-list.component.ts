import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FolderManagementService } from '../../services/folder-management.service';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-media-folder-list',
  templateUrl: './media-folder-list.component.html',
  styleUrls: ['./media-folder-list.component.css']
})
export class MediaFolderListComponent implements OnInit {
  globalFilterColumn = ['id', 'name', 'actions', 'createdBy', 'createdAt'];
  columns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'Folder Name', field: 'name', order: 3 },
    { header: 'created By', field: 'createdBy', order: 4 },
    { header: 'Created At', field: 'createdAt', order: 5 },
    { header: 'Actions', field: 'actions', order: 6 }
  ];
  _selectedColumns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'Folder Name', field: 'name', order: 3 },
    { header: 'created By', field: 'createdBy', order: 4 },
    { header: 'Created At', field: 'createdAt', order: 5 },
    { header: 'Actions', field: 'actions', order: 6 }
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
  showAddFolderModal: boolean;
  editId: any;
  folderList: any;
  @ViewChild('dt1') dataTable: Table;


  constructor(
    private router: Router,
    private fileManagerService: FolderManagementService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.getFolders();
  }

  getFolders() {
    this.fileManagerService.getFolder().then((data: any) => {
      this.folderList = data;
    });
  }

  addFolder() {
    this.showAddFolderModal = true;
    this.editId = null;
  }

  editPage(data: any) {
    console.log(data);
    this.editId = data;
    this.showAddFolderModal = true;
  }

  viewFiles(data: any) {
    this.router.navigate(['/media/library/folder', data]);
  }

  onAddFolderModalClose(event: any) {
    if (event.type === 'close') {
      this.showAddFolderModal = false;
    } else {
      this.showAddFolderModal = false;
      this.getFolders();
      this.dataTable.reset()
    }
  }

  deleteTrash(data: any) {
    if (confirm('Do you want to delete?') == true) {
      this.fileManagerService.deleteFolder(data).then(
        () => {
          this.alertService.success('Folder deleted successfully');
          this.getFolders();
        },
        () => {
          this.alertService.error('Unable to delete Folder.');
        }
      );
    }
  }

  @Input()
  set selectedColumns(selectedColumns: any) {
    this._selectedColumns = selectedColumns;
    this._selectedColumns.sort((a: any, b: any) => a.order - b.order);
  }

  get selectedColumns(): any {
    return this._selectedColumns;
  }
}
