import { Component, Input, OnInit } from '@angular/core';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router } from '@angular/router';
import { CategoryList } from 'src/app/shared/models/category/categories';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 100;
  globalFilterColumn = [
    'id',
    'name',
    'createdBy',
    'createdAt',
    'updatedAt',
    'updatedBy'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'name', field: 'name' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Created By', field: 'createdBy' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: CategoryList[] = [];
  userId: any;
  isDtInitialized: boolean = false;
  tableHtml: any;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService
      .getAllCategories()
      .then((data: any) => {
        console.log('BEFORE ASSIGNING: ', data);
        this.rowData = [...data.serviceCategoryList];
        console.log('AFTER ASSIGNING: ', this.rowData);
        if (this.rowData[0]?.position) {
          this.rowData.sort(function (a: any, b: any) {
            return a.position - b.position;
          });
        } else {
          const row = this.rowData.map((obj, index) => ({
            ...obj,
            position: index
          }));
          this.rowData = row;
        }
        // console.log(this.rowData);
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Service Category');
      });
  }

  formatTimeInData() {
    this.rowData.map((data, i) => {
      this.rowData[i].createdAt = this.formatTimeService.formatTime(
        data.createdAt
      );
      this.rowData[i].updatedAt = this.formatTimeService.formatTime(
        data.updatedAt
      );
    });
  }

  editCategory(id: Number) {
    this.router.navigate(['/categories/' + id + '/edit']);
  }

  deleteCategoryModal(data: any) {
    if (data.name.toLowerCase() == 'general') {
      this.toastMessageService.error('Default category cannot be deleted');
      return;
    } else {
      this.modalData = {
        name: data.name,
        id: data.id
      };
      this.showModal = true;
      this.modalData.feildName = data.name;
      this.modalData.titleName = 'Category';
    }
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteCategory(this.modalData.id);
    }
  }

  deleteCategory(id: any) {
    this.categoryService.getCategoryServices(id).then((response: any) => {
      if (response !== undefined && response.length > 0) {
        this.toastMessageService.error(
          'This category may be deleted only after removing all services under it"'
        );
      } else {
        this.categoryService.deleteCategory(id).then(
          () => {
            this.rowData = [];
            this.toastMessageService.success('The category has been deleted.');
            this.loadCategories();
          },
          () => {
            this.toastMessageService.error('Unable to delete category.');
          }
        );
      }
    });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  drop(event: any) {
    console.log('Item Moved');
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    // const row = this.rowData;
    // this.rowData = [];
    for (let i = 0; i < event.container.data.length; i++) {
      this.rowData[i].position = i;
    }
    setTimeout(() => {
      console.log('After drop success: ', this.rowData);
      this.updateRow();
    });
  }

  updateRow() {
    const menus = this.rowData.map((item: any, index: number) => ({
      ...item,
      position: index
    }));

    this.categoryService.updateTableList(menus).then();
  }
}
