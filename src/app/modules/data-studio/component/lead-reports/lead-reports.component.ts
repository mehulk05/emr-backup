import { Component, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { DataStudioService } from '../../service/data-studio.service';

@Component({
  selector: 'app-lead-reports',
  templateUrl: './lead-reports.component.html',
  styleUrls: ['./lead-reports.component.css']
})
export class LeadReportsComponent implements OnInit {
  leadsData: any;
  constructor(
    private dataStudioService: DataStudioService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.loadLeads();
  }

  loadLeads() {
    this.dataStudioService
      .getLeadDashboardStats()
      .then((data: any) => {
        this.leadsData = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load leads');
      });
  }
}
