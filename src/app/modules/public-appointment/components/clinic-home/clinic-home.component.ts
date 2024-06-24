import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../services/appointment.service';
import { BusinessService } from '../../services/business.service';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-clinic-home',
  templateUrl: './clinic-home.component.html',
  styleUrls: ['./clinic-home.component.css']
})
export class ClinicHomeComponent implements OnInit {
  colorFromParams: any;
  bgColorFromParams: any;
  showMore = false;
  selectedIndex: number;
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  profileImageUrl: string = 'https://dev-emr-asset.s3.amazonaws.com/profile973';
  // currency:any =  JSON.parse(localStorage.getItem("defaultClinic"));
  currency: any;
  serviceImgUrl: any = null;
  showBookAppointmentButton: boolean = false;
  currentUrl: string;
  private geoCoder: {
    geocode: (
      arg0: { address: string },
      arg1: (results: any, status: any) => void
    ) => void;
  };

  toggleFlag: string = 'service';

  @ViewChild('search')
  public searchElementRef: ElementRef;

  headerText = [{ text: 'Services' }, { text: 'Providers' }];

  clinicId: null;
  clinic: any = null;
  userId: any = null;
  services: any;
  providers: any[] = null;
  businessId: any = null;
  landingPageId: any = null;
  //  titleColor = "inherit";
  logoUrl: string = null;
  priceVaries = false;
  buttonBackgroundColor = '#003B6F';
  buttonForegroundColor = '#FFFFFF';
  titleColor = '#000';
  btnStyle = {
    backgroundColor: '#003b6f',
    color: '#fff',
    border: '#003b6f'
  };

  btnTextStyle = {
    color: '#fff'
  };

  titleStyle = {
    color: '#000'
  };

  activeLinkStyle = {
    color: '#003B6F'
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appointmentBookingService: AppointmentService,
    private alertService: ToasTMessageService,
    private mapsAPILoader: MapsAPILoader,
    private businessService: BusinessService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.currentUrl = window.location.href;
    this.clinicId = this.activatedRoute.snapshot.params.clinicId;
    this.businessId = this.activatedRoute.snapshot.params.businessId;
    this.userId = this.activatedRoute.snapshot.params.userId;

    this.activatedRoute.queryParams.subscribe(
      (d: {
        color?: any;
        bgColor?: any;
        c?: any;
        b?: any;
        u?: any;
        lpid?: any;
      }) => {
        this.colorFromParams = d?.color;
        this.bgColorFromParams = d.bgColor;

        if (Object.keys(d).length > 0) {
          this.clinicId = d?.c;
          this.businessId = d.b;
          this.userId = d.u;
          this.landingPageId = d?.lpid;
        }
      }
    );
    this.getCurrency();
    if (this.userId && this.landingPageId) {
      if (this.clinicId) {
        this.router.navigate(['/ap-booking/business'], {
          queryParams: {
            b: this.businessId,
            c: this.clinicId,
            u: this.userId,
            lpid: this.landingPageId
          }
        });
      } else {
        this.router.navigate(['/ap-booking/business'], {
          queryParams: {
            b: this.businessId,
            u: this.userId,
            lpid: this.landingPageId
          }
        });
      }
    } else if (this.userId && !this.landingPageId) {
      if (this.clinicId) {
        this.router.navigate(['/ap-booking/business'], {
          queryParams: { b: this.businessId, c: this.clinicId, u: this.userId }
        });
      } else {
        this.router.navigate(['/ap-booking/business'], {
          queryParams: { b: this.businessId, u: this.userId }
        });
      }
    }

    if (this.clinicId && !this.userId) {
      this.getBuisnesDetails();
    } else {
      this.businessService.getPublicBusinessOptimized(this.businessId).then(
        (res: any) => {
          if (res != null && res.logoUrl != null) this.logoUrl = res.logoUrl;
        },
        () => {
          this.alertService.error('Unable to get Business ');
        }
      );
    }
    this.loadPersonalizationColors();
  }

  private getCurrency(): void {
    this.clinicService
      .getPublicDefaultCinic(this.businessId)
      .then((data: any) => {
        this.currency = data;
        console.log('this.currency', this.currency);
      });
  }

  loadPersonalizationColors() {
    console.log(
      '========================================================= line 140',
      this.colorFromParams,
      this.bgColorFromParams
    );
    if (this.colorFromParams && this.bgColorFromParams) {
      localStorage.removeItem('personalization');

      const response = {
        buttonBackgroundColor: this.bgColorFromParams,
        buttonForegroundColor: this.colorFromParams,
        titleColor: this.bgColorFromParams
      };
      localStorage.setItem('personalization', JSON.stringify(response));
      this.setPersonalizationColors(response);
      setTimeout(() => {
        localStorage.removeItem('personalization');
        localStorage.setItem('personalization', JSON.stringify(response));
        this.setPersonalizationColors(response);
      }, 3000);
    } else if (this.landingPageId) {
      console.log('=====================================152');
      this.businessService
        .getPublicQuestionnaireFromLandingPageId(
          this.businessId,
          this.landingPageId
        )
        .then((response: any) => {
          if (response) {
            this.setPersonalizationColors(response);
          }
        });
    } else {
      console.log(
        '=========================================161 business personalization'
      );
      this.businessService
        .getPublicQuestionnaireOptimized(this.businessId)
        .then(
          (response: any) => {
            this.setPersonalizationColors(response);
          },
          () => {
            this.alertService.error('Unable to load questionnnaire.');
          }
        );
    }
  }

  setPersonalizationColors(response: {
    buttonBackgroundColor: any;
    buttonForegroundColor: any;
    titleColor: any;
  }) {
    console.log('===================183', response);
    if (response.buttonBackgroundColor)
      this.buttonBackgroundColor = response.buttonBackgroundColor;
    this.activeLinkStyle = {
      color: response.buttonBackgroundColor
    };
    if (response.buttonForegroundColor) {
      this.btnTextStyle = {
        color: response.buttonForegroundColor
      };

      this.buttonForegroundColor = response.buttonForegroundColor;
      this.btnStyle = {
        backgroundColor: response.buttonBackgroundColor,
        color: response.buttonForegroundColor,
        border: response.buttonBackgroundColor
      };
    }
    const personalizationColors = {
      buttonBackgroundColor: response.buttonBackgroundColor,
      buttonForegroundColor: response.buttonForegroundColor,
      titleColor: response.titleColor
    };
    console.log('personalizationColors', personalizationColors);
    localStorage.setItem(
      'personalization',
      JSON.stringify(personalizationColors)
    );
    if (response.titleColor != null && response.titleColor != '') {
      this.titleColor = response.titleColor;
      this.titleStyle = {
        color: response.titleColor
      };
    }
  }
  getBuisnesDetails() {
    if (this.clinicId != undefined) {
      this.loadClinic().then((response: any) => {
        this.mapsAPILoader.load().then(() => {
          // this.setCurrentLocation();
          this.geoCoder = new google.maps.Geocoder();
          this.getClinicAddress();

          if (response.logoUrl != null) {
            this.logoUrl = response.logoUrl + '?t=' + new Date();
          }
        });
      });
      this.loadServices();
      this.loadAllProviders();
    }
  }

  loadClinic() {
    const clinicPromise = new Promise((resolve) => {
      if (this.clinicId && this.clinicId != undefined) {
        this.clinicService
          .getClinicOptimized(this.businessId, this.clinicId)
          .then((response: any) => {
            console.log('clinic is', response);
            this.clinic = response;
            this.showBookAppointmentButton = response.showBookAppointmentButton;
            if (response.logoUrl != null) {
              this.logoUrl = response.logoUrl + '?t=' + new Date();
            }

            if (response.priceVaries) {
              this.priceVaries = true;
            }
            resolve('clinic Loaded');
          })
          .catch(() => {
            this.alertService.error('Unable to load clinics.');
          });
      }
    });
    return clinicPromise;
  }

  getUsformattedPhoneNumber(phoneNumber: any) {
    if (phoneNumber?.length <= 10) {
      return phoneNumber
        .replace(/\D/g, '')
        .replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      return phoneNumber;
    }
  }

  loadServices() {
    this.clinicService
      .getClinicServicesOptimized(this.businessId, this.clinicId)
      .then(
        (response: any) => {
          this.services = response;
          // Caching all services for any provider booking
          this.appointmentBookingService.setClinicServices(response);
        },
        () => {
          this.alertService.error('Unable to load services.');
        }
      );
  }

  loadAllProviders() {
    this.clinicService
      .getClinicProvidersOptimized(this.businessId, this.clinicId)
      .then(
        (response: any) => {
          this.providers = response;
          if (this.providers.length > 1) {
            this.providers.push(this.getAnyProvider());
          }
        },
        () => {
          this.alertService.error('Unable to load providers.');
        }
      );
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(() => {
        this.getClinicAddress();
      });
    }
  }

  getClinicAddress() {
    var clinic_address = JSON.stringify(this.clinic?.address);
    clinic_address = clinic_address.replace(/"/g, '');
    this.clinic.address = clinic_address;
    this.geoCoder.geocode(
      { address: clinic_address },
      (results: any, status: string) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 8;
            this.address = results[0].formatted_address;
            this.latitude = results[0].geometry.location.lat();
            this.longitude = results[0].geometry.location.lng();
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  toggleServiceProvider(toggleFlag: string) {
    this.toggleFlag = toggleFlag;
  }

  setShowMore(showMoreFlag: boolean, index: number) {
    this.showMore = showMoreFlag;
    this.selectedIndex = index;
  }

  getAnyProvider() {
    return this.appointmentBookingService.getAnyProvider();
  }

  onSelectService(serviceObj: any) {
    console.log('here', serviceObj);
    const serviceId = serviceObj?.id;

    const queryParams: any = {
      b: this.businessId,
      c: this.clinicId,
      service: serviceId
    };

    if (this.landingPageId) {
      queryParams['lpid'] = this.landingPageId;
    }
    this.router.navigate(['/ap-booking/business'], { queryParams });
  }
}
