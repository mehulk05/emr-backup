import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadSourceurlService } from '../../service/lead-sourceurl.service';

@Component({
  selector: 'app-lead-sourceurl-list',
  templateUrl: './lead-sourceurl-list.component.html',
  styleUrls: ['./lead-sourceurl-list.component.css']
})
export class LeadSourceurlListComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 50;
  globalFilterColumn = ['id', 'name'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Source URL', field: 'sourceUrl' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];

  constructor(
    private leadSourceurlService: LeadSourceurlService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadLeadSourceUrls();
  }

  loadLeadSourceUrls() {
    this.leadSourceurlService
      .leadSourceUrlList()
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load lead source URLs');
      });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.sourceUrl,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.sourceUrl;
    this.modalData.titleName = 'Lead Source URL';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.leadSourceurlService
      .deleteById(id)
      .then(() => {
        this.loadLeadSourceUrls();
        this.toastService.success('Lead source URL deleted successfully');
      })
      .catch(() => {
        this.toastService.error('Error while deleting lead source URL');
      });
  }
  editTemplate(id: any) {
    this.router.navigate(['/sourceurl', 'edit', id]);
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
