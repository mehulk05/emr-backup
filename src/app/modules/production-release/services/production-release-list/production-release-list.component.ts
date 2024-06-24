import { Component, Input, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ProductionReleaseService } from '../../services/production-release.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';

@Component({
  selector: 'app-production-release-list',
  templateUrl: './production-release-list.component.html',
  styleUrls: ['./production-release-list.component.css']
})
export class ProductionReleaseListComponent implements OnInit {
  first = 0;
  rows = 50;
  globalFilterColumn = ['id', 'url', 'description'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'URL', field: 'url' },
    { header: 'Release Date', field: 'releaseDate' },
    { header: 'Description', field: 'description' }
    // { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  constructor(
    private productionReleaseService: ProductionReleaseService,
    private toastService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadProductionReleases();
  }

  loadProductionReleases() {
    this.productionReleaseService
      .ProductionReleaseList()
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load Release');
      });
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
