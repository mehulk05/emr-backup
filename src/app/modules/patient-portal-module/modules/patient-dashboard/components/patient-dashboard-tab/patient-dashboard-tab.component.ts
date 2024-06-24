import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { PatientService } from 'src/app/modules/pateint/services/patient.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PatientProfileService } from '../../../patient-profile/service/patient-profile.service';

@Component({
  selector: 'app-patient-dashboard-tab',
  templateUrl: './patient-dashboard-tab.component.html',
  styleUrls: ['./patient-dashboard-tab.component.css']
})
export class PatientDashboardTabComponent implements OnInit {
  selectedIndex: any = 0;
  sources = ['appointments', 'consents', 'questionarie', 'payments'];
  source: any = 'appointments';
  currentPaitent: any;
  patientId: any;
  patientData: any;
  profileImageUrl: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private patientService: PatientService,
    private userProfileService: PatientProfileService
  ) {
    this.currentPaitent = localStorageService.readStorage('currentUser');
  }

  ngOnInit(): void {
    this.patientId = this.currentPaitent.id;
    this.source =
      this.activatedRoute.snapshot.queryParams?.source ?? 'appointments';
    if (this.source) {
      this.selectedIndex = this.sources.indexOf(this.source);
    }
    this.sendMessage();
  }

  sendMessage() {
    this.userProfileService.getUserById(this.patientId).then((data: any) => {
      this.profileImageUrl = data.profileImageUrl;
      const currentUser = this.localStorageService.readStorage('currentUser');
      currentUser.profileImageUrl = this.profileImageUrl;
      var userResp: any = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        profileImageUrl: currentUser.profileImageUrl,
        id: currentUser.id
      };
      this.authService.sendMessage(userResp);
      currentUser['firstName'] =
        currentUser?.firstName ?? currentUser['firstName'];
      currentUser['lastName'] =
        currentUser?.lastName ?? currentUser['lastName'];
      currentUser['profileImageUrl'] =
        currentUser?.profileImageUrl ?? currentUser['profileImageUrl'];
      this.localStorageService.storeItem('currentUser', currentUser);
    });
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;

    this.router.navigate([], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }
}
