import { Component, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadsService } from '../../service/leads.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-leads-dashboard',
  templateUrl: './leads-dashboard.component.html',
  styleUrls: ['./leads-dashboard.component.css']
})
export class LeadsDashboardComponent implements OnInit {
  //property for lead data
  leadsData: any;
  showHide: boolean = false;
  btnName: any = 'Show Details';
  showModal: boolean = false;
  modalData: any;
  isRefreshApiCall = 0;
  showImportModal: boolean = false;
  tagsList: any[] = [];
  graphData: any;
  constructor(
    private leadService: LeadsService,
    private toastService: ToasTMessageService,
    private localStorgaeService: LocalStorageService
  ) {}

  ngOnInit(): void {
    //calling loadLeads() for getting lead data when initializing component
    this.loadLeads();
  }
  //show and hide graph
  showGraph() {
    if (this.graphData) {
      this.showHide = true;
      return;
    }
    this.leadService
      .getLeadDashboardGraphData()
      .then((data: any) => {
        if (data) {
          this.graphData = data;
          this.showHide = true;
        }
      })
      .catch(() => {
        this.toastService.error('Unable to Lead Graphs');
      });
  }
  showTable = () => (this.showHide = false);

  openImportModal() {
    this.showImportModal = true;
  }

  addLeadTemplateModal() {
    this.showModal = true;
  }

  onAddLead() {
    this.showModal = true;
  }
  onCloseModal(e: any) {
    console.log('e', e);
    this.showModal = false;

    if (e?.isRefresh) {
      this.isRefreshApiCall = this.isRefreshApiCall + 1;
      this.loadLeads();
      setTimeout(() => {
        this.loadLeads();
      }, 8000);
    }
  }

  //getting all leads for Lead Dashboard
  loadLeads() {
    this.leadService
      .getLeadDashboardData()
      .then((data: any) => {
        if (data) {
          this.leadsData = data.statsData;
          this.tagsList = data.tagsList;
        }
        // console.log('Leads');
      })
      .catch(() => {
        this.toastService.error('Unable to load leads');
      });
  }

  //getting percentage for leads respectivly
  getStatsForPercentageChange(lastCount: number, currentCount: number) {
    const denominttor = lastCount == 0 ? 1 : lastCount;
    const result = (
      Number((currentCount - lastCount) / denominttor) * 100
    ).toFixed(2);
    return result;
  }

  onCloseImportFileModal(e: any) {
    console.log('cls', e.isImport);
    this.showImportModal = false;
    if (e.isImport) {
      console.log('import');
      this.uploadFile(e.isImport, e?.recordType);
    }
  }

  uploadFile(file: any, recordType: any) {
    const currentUser = this.localStorgaeService.readStorage('currentUser');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', currentUser?.id);
    formData.append('recordType', recordType);
    this.leadService.uploadFile(formData).then(
      () => {
        this.toastService.success(
          'File upload under process and an Email will be sent once it is completed'
        );
      },
      () => {
        this.toastService.error('Unable to upload file.');
      }
    );
  }
}
