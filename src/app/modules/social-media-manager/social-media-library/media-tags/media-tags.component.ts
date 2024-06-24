import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MediaTagService } from '../../services/media-tag.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-media-tags',
  templateUrl: './media-tags.component.html',
  styleUrls: ['./media-tags.component.css']
})
export class MediaTagsComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 50;
  globalFilterColumn = ['id', 'name'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  screeName = '';
  constructor(
    private mediaTagService: MediaTagService,
    private toastService: ToasTMessageService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.screeName = params['page'];
    });
    this.loadPatientTags();
  }

  loadPatientTags() {
    this.mediaTagService
      .socialMediaTagList()
      .then((data: any) => {
        this.rowData = data.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
        // console.log(this.rowData.sort((a, b) => (a.id > b.id ? -1 : 1)));
      })
      .catch(() => {
        this.toastService.error('Unable to load Media Tags');
      });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Media Tag';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.mediaTagService
      .deleteTagById(id)
      .then(() => {
        this.loadPatientTags();
        this.toastService.success('Tag deleted successfully');
      })
      .catch(() => {
        this.toastService.error(
          'The Tag Associated With A Media Cannot Be Deleted. To Delete, Remove This Tag From The Media'
        );
      });
  }
  editTemplate(id: any) {
    this.router.navigate(['/media/library/editTag', id]);
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  onBackPressed() {
    if (this.screeName === 'FILE_MANAGER') {
      this.router.navigate(['/file-manager']);
    } else {
      this.router.navigate(['/media/library']);
    }
  }
}
