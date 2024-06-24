import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-add-edit-clinic-form',
  templateUrl: './add-edit-clinic-form.component.html',
  styleUrls: ['./add-edit-clinic-form.component.css']
})
export class AddEditClinicFormComponent implements OnInit {
  clinicId: any = null;
  clinicData: any = {};
  selectedIndex: any = 0;
  sources = ['detail', 'config', 'g99review'];
  source: any = 'detail';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.clinicId = this.activatedRoute.snapshot.params.clinicId;
    if (this.clinicId) {
      this.loadClinicDetails();
    }
    this.activatedRoute.queryParams.subscribe((data: any) => {
      console.log(data);
      this.source = data?.source ?? 'detail';
      this.selectedIndex = this.sources.indexOf(this.source);
    });
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
    }
  }

  loadClinicDetails() {
    this.clinicService
      .getSingleClinic(this.clinicId)
      .then((response) => {
        this.clinicData = response;
        console.log(this.clinicData);
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load clinic.');
      });
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.loadClinicDetails();
    if (this.clinicId) {
      this.router.navigate(['clinics', this.clinicId, 'edit'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate(['clinics', 'create'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
