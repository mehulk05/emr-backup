import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

import { PostLabelService } from '../../services/post-label.service';

@Component({
  selector: 'app-post-label-list',
  templateUrl: './post-label-list.component.html',
  styleUrls: ['./post-label-list.component.css']
})
export class PostLabelListComponent implements OnInit {
  first = 0;
  rows = 50;

  showModal: boolean = false;
  modalData: any;

  globalFilterColumn = ['id', 'name', 'createdAt'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private postLabelService: PostLabelService,
    public formatTimeService: FormatTimeService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadSocialProfiles();
  }

  loadSocialProfiles() {
    this.postLabelService
      .getPostLabels()
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load leads');
      });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Post Label';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.postLabelService
      .deletePostLabels(id)
      .then(() => {
        this.toastService.success('Post label deleted successfully');
        this.loadSocialProfiles();
      })
      .catch(() => {
        this.toastService.error(
          'The label associated with a post cannot be deleted'
        );
      });
  }

  editTemplate(id: any) {
    this.router.navigate(['/post-library-label/edit', id]);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
