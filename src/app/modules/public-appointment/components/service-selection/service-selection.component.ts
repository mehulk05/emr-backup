/* eslint-disable @angular-eslint/no-output-on-prefix */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { getSelectedClinicSelector } from 'src/app/shared/store-management/store/general-states/general-state.selector';
import { AppointmentService } from '../../services/appointment.service';
import { BusinessService } from '../../services/business.service';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-service-selection',
  templateUrl: './service-selection.component.html',
  styleUrls: ['./service-selection.component.css']
})
export class ServiceSelectionComponent implements OnInit, OnChanges {
  @Output() onBack = new EventEmitter<any>();
  userId: any;
  showMore = false;
  selectedIndex: number;
  businessId: any = null;

  @Input() serviceSelectionBeforeProvider: boolean = true;
  @Input() booking: any = {};
  @Output() onServiceSelection = new EventEmitter<any>();
  @Output() onContinue = new EventEmitter<any>();
  services: any[] = [];
  checked: boolean = false;
  buttonBackgroundColor = '#003B6F';
  buttonForegroundColor = '#FFFFFF';
  // currency:any =  JSON.parse(localStorage.getItem("defaultClinic"));
  //  titleColor = "inherit";
  currency: any;

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
  providerId: any;
  serviceId: any;
  serviceImgUrl: any = null;
  landingPageId: any;
  titleColor: any;
  clinicId: any;
  showServiceByCategory: boolean;
  subscriptions: Subscription = new Subscription();
  constructor(
    private appointmentBookingService: AppointmentService,
    private alertService: ToasTMessageService,
    private businessService: BusinessService,
    private activatedRoute: ActivatedRoute,
    private clinicService: ClinicService,
    private store: Store
  ) {
    this.subscriptions.add(
      combineLatest([
        this.store.select(getSelectedClinicSelector),
        this.activatedRoute.queryParams
      ])
        .pipe(distinctUntilChanged(isEqual))
        .subscribe(([data, d]: [any, any]) => {
          if (!data) {
            return;
          }
          this.booking.selectedClinic = data;
          if (this.booking?.selectedClinic) {
            console.log(this.booking);
            this.showServiceByCategory =
              this.booking?.selectedClinic?.showCategoriesOnAppointmentBookingPage;
          }
          this.businessId = this.activatedRoute.snapshot.params.businessId;

          if (Object.keys(d).length > 0) {
            this.userId = d.u;
            this.serviceId = d?.service;
            this.clinicId = d?.c;
            this.providerId = d?.providerId;
            this.landingPageId = d?.lpid;
          }
          console.log(this.currency, d);
          this.loadServices();
          if (!this.currency) {
            this.getCurrency();
          }
        })
    );
  }
  ngOnChanges(): void {
    if (this.booking?.selectedClinic) {
      console.log(this.booking);
      this.showServiceByCategory =
        this.booking?.selectedClinic?.showCategoriesOnAppointmentBookingPage;
    }
  }

  ngOnInit(): void {
    if (this.booking?.selectedClinic) {
      console.log(this.booking);
      this.showServiceByCategory =
        this.booking?.selectedClinic?.showCategoriesOnAppointmentBookingPage;
    }
    let response: any;
    if (this.landingPageId) {
      response = JSON.parse(localStorage.getItem('websitePersonalization'));
    } else {
      response = JSON.parse(localStorage.getItem('personalization'));
    }

    if (
      response != null &&
      (response.buttonBackgroundColor != null ||
        response.buttonBackgroundColor != '')
    ) {
      this.setPersonalizationColors(response);
    } else {
      this.loadPersonalizationColors();
    }
  }

  loadPersonalizationColors() {
    if (this.landingPageId) {
      this.businessService
        .getPublicQuestionnaireFromLandingPageId(
          this.booking.businessId,
          this.landingPageId
        )
        .then((response: any) => {
          if (response) {
            this.setPersonalizationColors(response);
          }
        });
    } else {
      this.businessService
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
  setPersonalizationColors(response: {
    buttonForegroundColor: string;
    buttonBackgroundColor: any;
    titleColor: string;
  }) {
    if (response) {
      if (
        response.buttonForegroundColor != null &&
        response.buttonForegroundColor != ''
      ) {
        this.btnTextStyle = {
          color: response.buttonForegroundColor,
          textTransform: 'uppercase'
        };
      }

      this.activeLinkStyle = {
        color: response.buttonBackgroundColor
      };

      this.btnStyle = {
        backgroundColor: response.buttonBackgroundColor,
        color: response.buttonForegroundColor,
        border: response.buttonBackgroundColor,
        textTransform: 'uppercase'
      };
      if (response.titleColor != null && response.titleColor != '') {
        this.titleColor = response.titleColor;
        this.titleStyle = {
          color: response.titleColor,
          textTransform: 'uppercase'
        };
      }
    }
  }
  loadServices() {
    console.log('booking selected data ', this.booking);

    const businessId = this.businessId;
    const clinicId = this.booking?.selectedClinic?.id ?? this.clinicId;
    console.log('clinicid', clinicId);
    let getServicesRequst = null;
    if (this.userId) {
      getServicesRequst =
        this.appointmentBookingService.getClinicServicesForProviderOptmized(
          businessId,
          clinicId,
          this.userId
        );
    } else {
      if (this.serviceSelectionBeforeProvider) {
        getServicesRequst = this.clinicService.getClinicServicesOptimized(
          businessId,
          clinicId
        );
      } else {
        getServicesRequst =
          this.appointmentBookingService.getClinicServicesForProviderOptmized(
            businessId,
            clinicId,
            this.booking.provider.id
          );
      }
    }

    if (this.providerId != 0) {
      getServicesRequst.then(
        (response: any) => {
          this.services = response;
          console.log('services is', this.services);
          if (this.userId) {
            if (this.services.length == 1) {
              this.onServiceSelection.emit({
                checked: true,
                service: this.services[0],
                serviceCount: this.services.length
              });
            }
          } else {
            if (response.length == 1 && this.serviceId) {
              this.onServiceSelection.emit({
                checked: true,
                service: response[0]
              });
              //   this.continue()
            }
          }
        },
        () => {
          this.alertService.error('Unable to load services.');
        }
      );
    } else {
      // All services by clinic f'or any provider
      this.services = this.appointmentBookingService.getCachedClinicServices();
      if (!this.services || !this.services?.length) {
        this.clinicService
          .getClinicServicesOptimized(this.businessId, this.clinicId)
          .then((response: any) => {
            this.services = response;
          });
      }
    }
  }

  onServiceClick = ($event: any) => {
    console.log($event);
    this.onServiceSelection.emit({
      checked: $event.checked,
      service: $event?.service
    });
  };

  goBack() {
    this.onBack.emit('fromService');
  }

  setShowMore(showMoreFlag: boolean, index: number) {
    this.showMore = showMoreFlag;
    this.selectedIndex = index;
  }

  continue = () => {
    this.onContinue.emit('service');
  };

  getCurrency(): void {
    // this.appointmentBookingService
    //   .getPublicDefaultService(this.businessId)
    //   .then((data: any) => {
    //     this.currency = data;
    //     console.log('this.currency', this.currency);
    //   });

    this.clinicService
      .getPublicDefaultCinic(this.businessId)
      .then((data: any) => {
        this.currency = data;
        console.log('this.currency', this.currency);
      });
  }
}
