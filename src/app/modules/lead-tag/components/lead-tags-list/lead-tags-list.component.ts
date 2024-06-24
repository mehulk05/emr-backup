import { Component, Input, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadTagService } from '../../services/lead-tag.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lead-tags-list',
  templateUrl: './lead-tags-list.component.html',
  styleUrls: ['./lead-tags-list.component.css']
})
export class LeadTagsListComponent implements OnInit {
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

  constructor(
    private leadTagService: LeadTagService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadLeadTags();
  }

  loadLeadTags() {
    this.leadTagService
      .leadTagList()
      .then((data: any) => {
        this.rowData = data.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
        console.log('data', data);
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
    this.modalData.titleName = 'Lead Tag';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.leadTagService
      .deleteTagById(id)
      .then(() => {
        this.loadLeadTags();
        this.toastService.success('Tag deleted successfully');
      })
      .catch(() => {
        this.toastService.error(
          'The Tag Associated With A Lead Cannot Be Deleted. To Delete, Remove This Tag From The Leads'
        );
      });
  }

  editTemplate(id: any) {
    this.router.navigate(['/tags', 'edit', id]);
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
