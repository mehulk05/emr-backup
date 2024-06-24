import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-patient-profile-tab',
  templateUrl: './patient-profile-tab.component.html',
  styleUrls: ['./patient-profile-tab.component.css']
})
export class PatientProfileTabComponent implements OnInit {
  selectedIndex: any = 0;
  sources = ['profile', 'change-password'];
  source: any = 'profile';
  currentPaitent: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.currentPaitent = localStorageService.readStorage('currentUser');
  }

  ngOnInit(): void {
    // this.source = this.activatedRoute.snapshot.queryParams?.source ?? 'profile';
    // if (this.source) {
    //   this.selectedIndex = this.sources.indexOf(this.source);
    // }
    this.source = this.activatedRoute.snapshot.queryParams?.source ?? 'profile';
    // const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const currentUser = this.localStorageService.readStorage('currentUser');
    console.log(currentUser);

    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data?.source ?? 'profile';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
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
