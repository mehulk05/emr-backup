/* eslint-disable @angular-eslint/no-output-on-prefix */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../services/appointment.service';
import { BusinessService } from '../../services/business.service';
import { ClinicService } from '../../services/clinic.service';

@Component({
  selector: 'app-provider-selection',
  templateUrl: './provider-selection.component.html',
  styleUrls: ['./provider-selection.component.css']
})
export class ProviderSelectionComponent implements OnInit {
  @Output() onBack = new EventEmitter<any>();
  userId: any;
  showMore = false;
  selectedIndex: number;
  anyProvider = {
    id: 0,
    firstName: 'Any Available Provider',
    lastName: ''
  };
  @Input() booking: any;
  @Output() onProviderSelection = new EventEmitter<any>();
  @Output() onContinue = new EventEmitter<any>();
  providers: any = [];
  isProviderSelected: boolean = false;
  buttonBackgroundColor = '#003B6F';
  buttonForegroundColor = '#FFFFFF';
  // titleColor = "inherit";
  backgroundColor = localStorage.getItem('bcc');
  foregroundColor = localStorage.getItem('fcc');
  titleColor = localStorage.getItem('tc');
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
  serviceId: any;
  providerId: any;
  imgUrlForAnyProvider: any = [];
  landingPageId: any;
  showNoProviderMessage: boolean;

  constructor(
    private appointmentBookingService: AppointmentService,
    private alertService: ToasTMessageService,
    private businessService: BusinessService,
    private activatedRoute: ActivatedRoute,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((d: any) => {
      if (Object.keys(d).length > 0) {
        this.userId = d.u;
        this.serviceId = d?.service;
        this.providerId = d?.providerId;
        this.landingPageId = d?.lpid;
        console.log('provider', this.serviceId, d);
      }
    });

    if (this.booking.provider) {
      this.isProviderSelected = true;
    }

    let response: any;
    if (this.landingPageId) {
      response = JSON.parse(localStorage.getItem('websitePersonalization'));
    } else {
      response = JSON.parse(localStorage.getItem('personalization'));
    }

    if (response != null && response.buttonBackgroundColor) {
      this.setPersonalizationColors(response);
    }
    this.loadProviders();
    // this.loadPersonalizationColors()
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

  goBack() {
    this.onBack.emit('fromProvider');
  }

  setPersonalizationColors(response: {
    buttonForegroundColor: any;
    buttonBackgroundColor: any;
    titleColor: string;
  }) {
    if (response) {
      if (response.buttonForegroundColor) {
        this.btnTextStyle = {
          color: response.buttonForegroundColor,
          textTransform: 'uppercase'
        };
      }

      this.btnStyle = {
        backgroundColor: response.buttonBackgroundColor,
        color: response.buttonForegroundColor,
        border: response.buttonBackgroundColor,
        textTransform: 'uppercase'
      };

      this.activeLinkStyle = {
        color: response.buttonBackgroundColor
      };
      if (response.titleColor != null && response.titleColor != '') {
        this.titleColor = response.titleColor;
        this.titleStyle = {
          color: response.titleColor,
          textTransform: 'uppercase'
        };
      }

      // this.btnStyle = {
      //     backgroundColor: response.buttonBackgroundColor,
      //     color: response.buttonForegroundColor,
      //     border: response.buttonBackgroundColor,
      //     textTransform:'uppercase'
      // }
      // this.btnTextStyle.color = response.buttonForegroundColor
      // this.titleStyle.color = response.titleColor
      // this.activeLinkStyle.color =  response.buttonBackgroundColor
      // this.activeLinkBorder.borderColor = response.buttonBackgroundColor
    }
  }
  loadProviders() {
    console.log(this.booking);
    const businessId = this.booking.businessId;
    let clinicId = this.booking?.selectedClinic?.id;
    const serviceIds: any[] = [];
    this.booking.selectedServices.map((value: any) => {
      serviceIds.push(value.id);
    });
    console.log(serviceIds);

    if (serviceIds.length == 0) {
      this.loadAllProviders(businessId, clinicId);
    } else {
      if (clinicId) {
        this.getProvidersFromClinicAndService(businessId, clinicId, serviceIds);
      } else {
        this.activatedRoute.queryParams.subscribe((data: any) => {
          clinicId = data.c;
          this.getProvidersFromClinicAndService(
            businessId,
            clinicId,
            serviceIds
          );
        });
      }
    }
  }

  // getProvidersFromClinicAndService(
  //   businessId: any,
  //   clinicId: any,
  //   serviceIds: any[]
  // ) {
  //   this.appointmentBookingService
  //     .getProvidersOptmized(businessId, clinicId, serviceIds)
  //     .then(
  //       (response: any) => {
  //         console.log('res', response, this.userId);

  //         this.providers = response;
  //         if (this.userId) {
  //           this.onProviderSelection.emit({ provider: response[0] });
  //           this.onContinue.emit('provider');
  //         } else {
  //           if (this.providers.length == 1 && this.providerId) {
  //             this.onProviderSelection.emit({ provider: response[0] });
  //             //  this.onContinue.emit('provider');
  //           } else {
  //             if (this.providers.length == 1) {
  //               this.onProviderSelection.emit({ provider: response[0] });
  //               //   this.onContinue.emit('provider');
  //             } else {
  //               this.providers.push(this.anyProvider);
  //             }
  //           }
  //         }
  //       },
  //       () => {
  //         this.alertService.error('Unable to load providers.');
  //       }
  //     );
  // }
  // getProvidersFromClinicAndService(
  //   businessId: any,
  //   clinicId: any,
  //   serviceIds: any[]
  // ) {
  //   this.appointmentBookingService
  //     .getProvidersOptmized(businessId, clinicId, serviceIds)
  //     .then(
  //       (response: any) => {
  //         console.log('res', response, this.userId);

  //         this.providers = response;

  //         // Check if providers are available
  //         if (this.providers && this.providers.length > 0) {
  //           // Providers are available, no need to show the "No provider available" message
  //           this.showNoProviderMessage = false;
  //         } else {
  //           // No providers available, show the "No provider available" message
  //           this.showNoProviderMessage = true;
  //         }
  //       },
  //       () => {
  //         this.alertService.error('Unable to load providers.');
  //       }
  //     );
  // }
  getProvidersFromClinicAndService(
    businessId: any,
    clinicId: any,
    serviceIds: any[]
  ) {
    this.appointmentBookingService
      .getProvidersOptmized(businessId, clinicId, serviceIds)
      .then(
        (response: any) => {
          console.log('Providers fetched successfully:', response);
          this.providers = response;

          // Check if providers are available
          if (this.providers && this.providers.length > 0) {
            // Providers are available, no need to show the "No provider available" message
            this.showNoProviderMessage = false;
            // If a provider ID is selected, emit the first provider's details
            if (this.userId) {
              this.onProviderSelection.emit({ provider: response[0] });
              this.onContinue.emit('provider');
            } else {
              // If there's only one provider and no provider ID is selected, emit its details
              if (this.providers.length == 1 && this.providerId) {
                this.onProviderSelection.emit({ provider: response[0] });
              }
            }
          } else {
            // No providers available, show the "No provider available" message
            this.showNoProviderMessage = true;
          }
        },
        (error: any) => {
          console.error('Error fetching providers:', error);
          this.alertService.error('Unable to load providers.');
        }
      );
  }

  loadAllProviders(businessId: any, clinicId: any) {
    this.appointmentBookingService
      .getClinicProviders(businessId, clinicId)
      .then(
        (response: any) => {
          this.providers = response;
          if (this.providers.length > 1) {
            this.providers.push(this.anyProvider);
          }
        },
        () => {
          this.alertService.error('Unable to load providers.');
        }
      );
  }

  continue = (provider: any) => {
    console.log(provider);
    this.isProviderSelected = !this.isProviderSelected;
    this.onProviderSelection.emit({ provider: provider });
    this.onContinue.emit('provider');
  };

  setShowMore(showMoreFlag: boolean, index: number) {
    this.showMore = showMoreFlag;
    this.selectedIndex = index;
  }
}
