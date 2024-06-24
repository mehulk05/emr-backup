import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-patient-tab',
  templateUrl: './patient-tab.component.html',
  styleUrls: ['./patient-tab.component.css']
})
export class PatientTabComponent implements OnInit {
  patientId: any;
  selectedIndex: any;
  sources = [
    'pateint',
    'questionarie',
    'task',
    'consents',
    'payments',
    'appointments',
    'timeline'
  ];
  source: any = 'pateint';
  businessInfo: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.businessInfo = this.localStorageService.readStorage('businessData');

    this.patientId = this.activatedRoute.snapshot.params?.patientId
      ? this.activatedRoute.snapshot.params.patientId
      : '';
    this.activatedRoute.params.subscribe((data: any) => {
      this.patientId = data?.patientId ? data?.patientId : '';
    });
    if (!this.businessInfo?.showPatientDetailsOnSinglePage) {
      this.source =
        this.activatedRoute.snapshot.queryParams?.source ?? 'patient';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
      this.activatedRoute.queryParams.subscribe((data: any) => {
        this.source = data.source;
        if (this.source) {
          this.selectedIndex = this.sources.indexOf(this.source);
        }
      });
    } else {
      this.source = 'single-page';
      this.router.navigate(['patients', this.patientId, 'edit'], {
        queryParams: {
          source: 'single-page'
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    if (this.patientId) {
      this.router.navigate(['patients', this.patientId, 'edit'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate(['patients', 'create'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
