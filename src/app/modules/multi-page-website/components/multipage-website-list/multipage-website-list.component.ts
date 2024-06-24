import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MultipageWebsiteService } from '../../services/multipage-website.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-multipage-website-list',
  templateUrl: './multipage-website-list.component.html',
  styleUrls: ['./multipage-website-list.component.css']
})
export class MultipageWebsiteListComponent implements OnInit {
  websiteList: any;

  globalFilterColumn = ['id', 'count', 'createdAt', 'updatedAt', 'websiteName'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'websiteName' },
    { header: 'No of Page', field: 'count' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  showModal: boolean;
  modalData: any = {};

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    private landingPageService: MultipageWebsiteService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.getWebsites();
  }

  getWebsites() {
    this.landingPageService.getWebsite().then(
      (data) => {
        console.log(data);
        this.websiteList = data;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  deleteTemplateModal(data: any) {
    console.log(data);
    this.showModal = true;
    this.modalData.feildName = data.websiteName;
    this.modalData.titleName = 'Multi Page Website';
    this.modalData.id = data.id;
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteWebsite(this.modalData.id);
    }
  }

  deleteWebsite(id: any) {
    this.landingPageService.deleteMultipageWebsiteById(id).then(
      () => {
        this.getWebsites();
      },
      (e) => {
        console.log(e);
      }
    );
  }
}
