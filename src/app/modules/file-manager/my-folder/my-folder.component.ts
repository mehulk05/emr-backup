import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FileManagerService } from '../services/file-manager.service';

@Component({
  selector: 'app-my-folder',
  templateUrl: './my-folder.component.html',
  styleUrls: ['./my-folder.component.css']
})
export class MyFolderComponent implements OnInit {
  globalFilterColumn = ['id', 'filename', 'actions', 'createdBy', 'createdAt'];
  columns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'File Name', field: 'filename', order: 3 },
    { header: 'Actions', field: 'actions', order: 5 },
    { header: 'created By', field: 'createdBy', order: 6 },
    { header: 'Created At', field: 'createdAt', order: 9 }
  ];
  _selectedColumns = [
    { header: 'Id', field: 'id', order: 1 },
    { header: 'File Name', field: 'filename', order: 3 },
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

  constructor(
    private router: Router,
    private fileManagerService: FileManagerService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.getLibraries(
      this.pageSearchFilter,
      '',
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  getLibraries(search: string, tag: string, page?: number, size?: number) {
    this.fileManagerService.getFolder(search, tag, page, size).then(
      (response: any) => {
        this.rowData = response.content;
        this.paginatorConfig.totalPage = response.totalPages;
        this.paginatorConfig.count = response.totalElements;
        this.totalDataCount = response.totalElements;
      },
      () => {
        this.alertService.error('Unable to load library images.');
      }
    );
  }

  searchPage() {
    this.getLibraries(
      this.pageSearchFilter,
      '',
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentPage =
      event.first / this.paginatorConfig.noOfRecord;
    this.paginatorConfig.currentRecordIndex =
      event.first / this.paginatorConfig.noOfRecord;
    this.getLibraries(
      this.pageSearchFilter,
      '',
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord
    );
  }

  addFolder() {
    this.showAddFolderModal = true;
  }

  editPage(data: any) {
    this.editId = data;
  }

  viewFiles(data: any) {
    this.router.navigate(['/file-manager/my-folders', data]);
  }

  onAddFolderModalClose(event: any) {
    if (event.type === 'close') {
      this.showAddFolderModal = false;
    } else {
      this.showAddFolderModal = false;
      this.getLibraries(
        this.pageSearchFilter,
        '',
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      );
    }
  }

  deleteTrash(data: any) {
    if (confirm('Do you want to delete?') == true) {
      this.fileManagerService.deleteLibraryById(data).then(
        () => {
          this.alertService.success('Folder deleted successfully');
          // this.getLibraries(
          //   this.pageSearchFilter,
          //   '',
          //   this.paginatorConfig.currentPage,
          //   this.paginatorConfig.noOfRecord
          // );
        },
        () => {
          this.alertService.error('Unable to delete library image.');
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
