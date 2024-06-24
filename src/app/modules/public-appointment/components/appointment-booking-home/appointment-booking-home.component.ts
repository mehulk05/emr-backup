import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import moment from 'moment';
import { Subscription } from 'rxjs';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { SetPublicClinic } from 'src/app/shared/store-management/store/general-states/general-state.action';
import { getSelectedClinicSelector } from 'src/app/shared/store-management/store/general-states/general-state.selector';
import { AppointmentService } from '../../services/appointment.service';
import { BusinessService } from '../../services/business.service';
import { ClinicService } from '../../services/clinic.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-appointment-booking-home',
  templateUrl: './appointment-booking-home.component.html',
  styleUrls: ['./appointment-booking-home.component.css']
})
export class AppointmentBookingHomeComponent implements OnInit, OnDestroy {
  backgroundColor: any = '';
  titleColor: any;
  colorFromParams: any;
  bgColorFromParams: any;
  userInfo: any;
  clinicLength = -1;
  clinicList: any = [];
  booking: any = {
    businessId: null,
    selectedClinic: null,
    selectedServices: [],
    provider: null,
    date: null,
    time: null,
    appointment: null
  };
  buttonBackgroundColor = '#003B6F';
  buttonForegroundColor = '#FFFFFF';
  // titleColor = "inherit";

  cssStringVar = `3px solid ${this.backgroundColor}`;
  btnStyle = {
    backgroundColor: '#003B6F',
    color: '#FFFFFF',
    border: '#003B6F',
    textTransform: 'uppercase'
  };

  btnTextStyle = {
    color: '#FFFFFF',
    textTransform: 'uppercase'
  };

  titleStyle = {
    color: '#000',
    textTransform: 'uppercase'
  };

  activeLinkStyle = {
    color: '#003B6F'
  };

  activeLinkBorder = {
    borderColor: '#003B6F'
  };
  serviceSelectedCount = 0;
  showClinicInfo: any;
  stepNumber: number = 0;
  clinicId: null;
  serviceId: null;
  providerId: null;
  userId: any = null;
  clinic: any[] = null;
  services: string | any[] = null;
  provider: any = null;
  servicesClinic: null;
  isProvider: boolean = false;
  buisnessId: any;
  businessInfo: any;
  businessLogoUrl: any;
  landingPageId: any;
  timezone: string;
  subscriptions: Subscription = new Subscription();
  constructor(
    private activatedRoute: ActivatedRoute,
    private appointmentBookingService: AppointmentService,
    private alertService: ToasTMessageService,
    private userService: UserService,
    private buisnessService: BusinessService,
    private clinicService: ClinicService,
    private store: Store
  ) {
    this.subscriptions.add(
      this.store
        .select(getSelectedClinicSelector)
        .pipe()
        .subscribe((data) => {
          console.log('selected', data);
          if (!data) {
            return;
          }
          this.booking.selectedClinic = data;
        })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    // this.booking.businessId = this.activatedRoute.snapshot.params.businessId;
    // this.clinicId = this.activatedRoute.snapshot.params.clinicId;
    // this.serviceId = this.activatedRoute.snapshot.params.serviceId;
    // this.providerId = this.activatedRoute.snapshot.params.providerId;

    this.activatedRoute.queryParams.subscribe(async (d: any) => {
      this.colorFromParams = d?.color;
      this.bgColorFromParams = d.bgColor;
      if (Object.keys(d).length > 0) {
        this.clinicId = d?.c;
        if (this.clinicId) {
          await this.loadClinicById(this.clinicId);
        }
        this.booking.businessId = d.b;
        this.buisnessId = d?.b;
        this.userId = d.u;
        this.serviceId = d?.service;
        this.providerId = d?.providerId;
        this.landingPageId = d?.lpid;
      }
      if (this.userId) {
        console.log('jere');
        await this.loadBuisness(this.buisnessId);
        await this.getUserInfo(this.userId, this.buisnessId);
      }

      if (this.clinicId != '') {
        if (this.serviceId != '' && this.serviceId != undefined) {
          this.loadService();
        } else if (this.providerId == 0) {
          this.loadAnyProvider();
        }
        if (
          this.providerId != '' &&
          this.providerId != undefined &&
          this.providerId != 0
        ) {
          this.loadProvider();
        }
      }

      this.handlePersonalizationSettings();
    });

    this.loadClinic();
  }

  handlePersonalizationSettings() {
    if (this.colorFromParams && this.bgColorFromParams) {
      const response = {
        buttonBackgroundColor: this.bgColorFromParams,
        buttonForegroundColor: this.colorFromParams,
        titleColor: this.bgColorFromParams
      };
      this.setPersonalizationColors(response, 'websitePersonalization');
    } else if (this.buisnessId && this.clinicId && this.landingPageId) {
      this.loadPersonalizationColors();
    } else if (this.buisnessId && this.clinicId) {
      const response = JSON.parse(localStorage.getItem('personalization'));
      if (response && response.buttonBackgroundColor) {
        this.setPersonalizationColors(response);
      } else {
        localStorage.removeItem('personalization');
        this.loadPersonalizationColors();
      }
    } else {
      localStorage.removeItem('personalization');
      this.loadPersonalizationColors();
    }
  }

  async loadClinicById(id: any) {
    try {
      const response: any = await this.clinicService.getClinicOptimized(
        this.booking.businessId,
        id
      );
      this.clinic = response;
      this.booking.selectedClinic = this.clinic;
      localStorage.setItem('clinicTimeZone', response.timezone);
      //this.activeStep(1)
    } catch (e) {
      this.alertService.error('Unable to load clinic information.');
    }
  }
  loadPersonalizationColors() {
    if (this.landingPageId) {
      this.buisnessService
        .getPublicQuestionnaireFromLandingPageId(
          this.booking.businessId,
          this.landingPageId
        )
        .then((response: any) => {
          if (response) {
            this.setPersonalizationColors(response, 'websitePersonalization');
          }
        });
    } else {
      this.buisnessService
        .getPublicQuestionnaireOptimized(this.booking.businessId)
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

  setPersonalizationColors(
    response: {
      buttonBackgroundColor: any;
      buttonForegroundColor: any;
      titleColor: any;
    },
    personalizationFrom?: string
  ) {
    if (response.buttonBackgroundColor) {
      this.activeLinkBorder.borderColor = response.buttonBackgroundColor;
      this.buttonBackgroundColor = response.buttonBackgroundColor;
      this.activeLinkStyle = {
        color: response.buttonBackgroundColor
      };
    }
    if (response.buttonForegroundColor) {
      this.btnTextStyle = {
        color: response.buttonForegroundColor,
        textTransform: 'uppercase'
      };

      this.buttonForegroundColor = response.buttonForegroundColor;
      this.btnStyle = {
        backgroundColor: response.buttonBackgroundColor,
        color: response.buttonForegroundColor,
        border: response.buttonBackgroundColor,
        textTransform: 'uppercase'
      };
      const personalizationColors = {
        buttonBackgroundColor: response.buttonBackgroundColor,
        buttonForegroundColor: response.buttonForegroundColor,
        titleColor: response.titleColor
      };
      if (personalizationFrom == 'websitePersonalization') {
        localStorage.setItem(
          'websitePersonalization',
          JSON.stringify(personalizationColors)
        );
      } else {
        localStorage.setItem(
          'personalization',
          JSON.stringify(personalizationColors)
        );
      }
    }

    if (response.titleColor != null && response.titleColor != '') {
      this.titleColor = response.titleColor;
      this.titleStyle = {
        color: response.titleColor,
        textTransform: 'uppercase'
      };
    }
  }

  loadBuisness(buisnessId: any) {
    this.buisnessService.getPublicBusinessOptimized(buisnessId).then(
      (response: any) => {
        this.businessInfo = response;
        if (response.logoUrl != null) {
          this.businessLogoUrl = response.logoUrl;
        }
      },
      () => {
        this.alertService.error('Unable to load business information.');
      }
    );
  }
  getUserInfo(userId: any, businessId: any) {
    this.userService.getPublicUser(userId, businessId).then((res: any) => {
      this.userInfo = res;
    });
  }
  async loadDefaultClinic() {
    const result = await this.clinicService.getPublicDefaultCinic(
      this.buisnessId
    );
    console.log(result);
    this.store.dispatch(new SetPublicClinic(result));
  }
  async loadClinic() {
    if (this.clinicId) {
    } else if (this.userId) {
      let userClinicList: any;
      this.loadDefaultClinic();
      // eslint-disable-next-line prefer-const
      userClinicList = await this.userService.getPublicUserClinic(
        this.userId,
        this.booking.businessId
      ); //data 1
      console.log(userClinicList);
      for (const clinic of userClinicList) {
        this.clinicList.push(clinic.clinic);
      }

      if (this.clinicList.length == 1) {
        this.showClinicInfo = this.clinicList[0];
        this.clinicLength = 1;
        this.booking.selectedClinic = this.clinicList[0];
        this.activeStep(1);
      } else {
        this.clinicLength = this.clinicList.length;
        const index = this.clinicList.filter((obj: { isDefault: boolean }) => {
          return obj.isDefault == true;
        });
        console.log(this.clinicList);
        this.booking.selectedClinic = index[0];
        this.showClinicInfo = index[0];
      }
      if (this.booking.selectedClinic?.timezone) {
        localStorage.setItem(
          'clinicTimeZone',
          this.booking.selectedClinic.timezone
        );
      }
    } else {
      this.clinicService.getAllCinicList(this.booking.businessId).then(
        (response: any) => {
          this.clinic = response.filter((obj: { isDefault: boolean }) => {
            return obj.isDefault === true;
          });
          this.booking.selectedClinic = this.clinic[0];
          localStorage.setItem(
            'clinicTimeZone',
            this.booking.selectedClinic.timezone
          );
          this.activeStep(1);
        },
        () => {
          this.alertService.error('Unable to load clinic information.');
        }
      );
    }
  }

  loadService() {
    console.log('In Load Service');
    this.appointmentBookingService
      .getServiceOptimized(this.booking.businessId, this.serviceId)
      .then(
        (response: any) => {
          console.log('load sevice', response, this.booking);
          this.services = response;
          this.booking.selectedServices.push(this.services);
          this.isProvider = false;
          this.activeStep(2);
          if (
            this.booking &&
            this.booking.selectedClinic?.isProviderBasedAppointment
          ) {
            this.redirectToDate();
          }
        },
        () => {
          this.alertService.error('Unable to load services1.');
        }
      );
  }

  redirectToDate() {
    this.activeStep(3);
    this.booking.provider = { id: null };
  }

  loadProvider() {
    this.appointmentBookingService
      .getProviderOptimized(this.booking.businessId, this.providerId)
      .then(
        (response: any) => {
          this.provider = response;
          this.booking.provider = this.provider;
          this.isProvider = true;
          this.activeStep(2);
        },
        () => {
          this.alertService.error('Unable to load services1.');
        }
      );
  }
  getUsformattedPhoneNumber(phoneNumber: any) {
    if (phoneNumber && phoneNumber?.length <= 10) {
      return phoneNumber
        .replace(/\D/g, '')
        .replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3');
    } else {
      return phoneNumber;
    }
  }
  activeStep = (number: number) => {
    console.log(number);
    this.stepNumber = number;
    this.store.dispatch(new SetPublicClinic(this.booking.selectedClinic));
  };

  onBackStep(event: any) {
    console.log(event, this.booking.selectedClinic);
    if (event === 'fromDate') {
      if (this.booking.selectedClinic.isProviderBasedAppointment) {
        this.activeStep(1);
      } else {
        this.isProvider ? this.activeStep(1) : this.activeStep(2);
      }
    } else if (event === 'fromProvider') {
      this.isProvider ? this.activeStep(0) : this.activeStep(1);
    } else if (event === 'fromService') {
      this.isProvider ? this.activeStep(1) : this.activeStep(0);
    } else if (event == 'fromPatientInfo') {
      this.activeStep(3);
    } else {
      console.log(event);
      this.stepNumber = this.stepNumber - 1;
      this.activeStep(this.stepNumber);
    }
  }

  onClinicSelection = (clinic: any) => {
    console.log(clinic);
    this.store.dispatch(new SetPublicClinic(clinic));
    this.booking.selectedClinic = clinic;
    this.serviceSelectedCount = 0;
    this.booking.selectedServices = [];
    localStorage.setItem(
      'clinicTimeZone',
      this.booking.selectedClinic.timezone
    );
  };

  onServiceSelection = ($event: any) => {
    console.log($event, this.booking.selectedServices.length);
    this.timezone = localStorage.getItem('selectedTimezone');
    localStorage.setItem(
      'selectedTimezone',
      this.booking.selectedClinic.timezone
    );
    this.serviceSelectedCount++;
    const checked = $event.checked;
    if (!$event.service.id) {
      $event.service.id = $event.service.serviceId;
    }
    console.log(this.booking.selectedServices);
    if (checked) {
      console.log(
        this.booking.selectedServices,
        this.booking.selectedServices.length
      );
      const isServicePresent = this.booking.selectedServices.some(
        (service: any) => service.id === $event.service.id
      );
      console.log('isServicePresent', isServicePresent);
      if (!isServicePresent) {
        this.booking.selectedServices.push($event.service);
      }
    } else {
      this.booking.selectedServices = this.booking.selectedServices.filter(
        function (value: any) {
          return value.id != $event.service.id;
        }
      );
    }

    if (this.userId) {
      if (
        $event?.serviceCount &&
        $event.serviceCount == 1 &&
        this.serviceSelectedCount == 1 &&
        $event.checked
      ) {
        this.booking?.selectedClinic?.isProviderBasedAppointment
          ? (this.stepNumber = 1)
          : (this.stepNumber = 2);
      }
    } else {
      if (
        this.services &&
        this.services.length == 1 &&
        this.serviceSelectedCount == 1 &&
        $event.checked
      ) {
        this.stepNumber = 2;
      }
    }
  };

  onProviderSelection = ($event: any) => {
    this.timezone = localStorage.getItem('selectedTimezone');
    localStorage.setItem(
      'selectedTimezone',
      this.booking.selectedClinic.timezone
    );
    this.booking.provider = $event.provider;
    //   this.activeStep(3);
  };

  onDateSelection = ($event: {
    date: any;
    time: { user: any; timeSlot: any };
  }) => {
    this.booking.date = $event.date;
    if (this.booking.provider.id == 0) {
      this.booking.provider = $event.time?.user;
      this.booking.time = $event.time?.timeSlot;
    } else {
      this.booking.time = $event.time;
    }

    this.activeStep(4);
  };

  onAppointmentSuccess = ($event: any) => {
    this.booking.appointment = $event.appointment;
  };

  onContinue = (step: any) => {
    console.log(step);
    if (step == 'clinic') {
      this.store.dispatch(new SetPublicClinic(this.booking.selectedClinic));
      this.activeStep(1);
    } else if (step == 'service') {
      if (!this.booking.selectedClinic.isProviderBasedAppointment) {
        this.isProvider ? this.activeStep(3) : this.activeStep(2);
      } else {
        this.redirectToDate();
      }
    } else if (step == 'provider') {
      this.isProvider ? this.activeStep(2) : this.activeStep(3);
    } else if (step == 'date') {
      this.activeStep(4);
    }
  };

  formatTime(time: string | number | Date) {
    var input: any = new Date(time);
    var fmt = 'hh:mm A'; // must match the input
    var zone = this.timezone;
    var m = moment.tz(input, fmt, zone);
    // convert it to utc
    m.utc();
    // format it for output
    time = m.format(fmt);
    return time;
  }

  loadAnyProvider() {
    this.provider = this.appointmentBookingService.getAnyProvider();
    this.booking.provider = this.provider;
    this.isProvider = true;
    this.activeStep(2);
  }
}
