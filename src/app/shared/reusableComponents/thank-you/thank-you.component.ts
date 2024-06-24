import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClinicService } from 'src/app/modules/public-appointment/services/clinic.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {
  clientWebsite: any = null;
  isHide: boolean = false;
  //loggedInUser: any = null;

  website = '';
  web = false;
  facebook = '';
  fac = false;
  instagram: any = null;
  ins = false;
  twitter: any = null;
  sub: any = null;
  businessId: number = null;
  payNow = 'no';

  constructor(
    private activatedRoute: ActivatedRoute,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.sub = this.activatedRoute.queryParams.subscribe((params: any) => {
      // Defaults to 0 if no query param provided.
      this.businessId = +params['bid'] || null;
      this.payNow = params['paynow'] || 'no';
      //Commenting social medial links
      // if (this.businessId != null) {
      //     this.getClinicData();
      // }
      console.log('Pay Now:-' + this.payNow);
    });
  }

  getClinicData() {
    this.clinicService.getAllCinicList(this.businessId).then(
      (response: any) => {
        if (response && response.length > 0) {
          this.website = response[0].website;
          this.facebook = response[0].facebook;
          this.instagram = response[0].instagram;
          this.twitter = response[0].twitter;
          if (this.website !== null) {
            this.web = true;
          }
          if (this.facebook !== null) {
            this.fac = true;
          }
          if (this.instagram !== null) {
            this.ins = true;
          }
        }
      },
      () => {
        //this.alertService.error("Unable to load business information.");
      }
    );
  }

  getClinicsData() {
    this.clinicService.getPublicDefaultCinic(this.businessId).then(
      (response: any) => {
        this.website = response.website;
        this.facebook = response.facebook;
        this.instagram = response.instagram;
        if (this.website !== null) {
          this.web = true;
        }
        if (this.facebook !== null) {
          this.fac = true;
        }
        if (this.instagram !== null) {
          this.ins = true;
        }
      },
      () => {
        //this.alertService.error("Unable to load business information.");
      }
    );
  }

  gotoHome() {
    //  window.open(this.clientWebsite);
    //this.router.navigate(['/users/profile']);
  }
}
