import { Component, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../services/patient.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  leadsData: any;
  showHide: boolean = true;
  btnName: any = 'Show Details';
  showModal: boolean = false;
  modalData: any;
  isRefreshApiCall = 0;
  constructor(
    private patientService: PatientService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    //calling loadPatients() for getting lead data when initializing component
    this.loadPatients();
  }
  //show and hide
  showHideModal() {
    if (this.showHide) {
      this.showHide = false;
      this.btnName = 'Hide Details';
    } else {
      this.showHide = true;
      this.btnName = 'Show Details';
    }
  }

  onAddLead() {
    this.showModal = true;
  }

  //getting all leads for Lead Dashboard
  loadPatients() {
    this.patientService
      .getPatientStatsDashboard()
      .then((data: any) => {
        this.leadsData = data;
        console.log('Leads');
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
}
