import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { SetPublicClinic } from 'src/app/shared/store-management/store/general-states/general-state.action';
import { AppointmentService } from '../../services/appointment.service';
import { BusinessService } from '../../services/business.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-clinic-selection',
  templateUrl: './clinic-selection.component.html',
  styleUrls: ['./clinic-selection.component.css']
})
export class ClinicSelectionComponent implements OnInit {
  @Input() booking: any;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClinicSelection = new EventEmitter<any>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onContinue = new EventEmitter<any>();

  selectedClinic: any;
  clinics: any = [];

  clinicId: any;
  businessId: any;
  userId: any;

  isComingFromUserPage = false;

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

  landingPageId: any;
  titleColor: any;
  constructor(
    private appointmentBookingService: AppointmentService,
    private alertService: ToasTMessageService,
    private businessService: BusinessService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((d: any) => {
      if (Object.keys(d).length > 0) {
        this.clinicId = d?.c;
        this.businessId = d.b;
        this.userId = d.u;
        this.landingPageId = d?.lpid;
      }

      if (this.userId) {
        this.isComingFromUserPage = true;
      }

      if (this.booking.businessId != undefined || this.businessId) {
        this.loadClinics();
      }

      setTimeout(() => {
        this.handlePersonalizationSettings();
      }, 500);
    });

    //this.loadPersonalizationColors()
  }

  handlePersonalizationSettings() {
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
  setPersonalizationColors(response: any) {
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
  loadClinics() {
    if (this.userId) {
      this.userService
        .getPublicUserClinic(this.userId, this.businessId)
        .then((data: any) => {
          console.log('data ', data);
          this.clinicId = data[0].clinic.id;
          this.clinicId = data.forEach((element: any) => {
            this.clinics.push(element.clinic);
            // this.appointmentBookingService
            //   .getClinicOptimized(this.businessId, element.clinic.id)
            //   .then((response: any) => {
            //     this.clinics.push(response);
            //   });
          });
        });
    } else {
      this.appointmentBookingService.getAllCinicList(this.businessId).then(
        (response: any) => {
          this.clinics = response;
        },
        () => {
          this.alertService.error('Unable to load clinics.');
        }
      );
    }
  }

  onRadioClick = ($event: any, clinic: any) => {
    this.store.dispatch(new SetPublicClinic(clinic));
    this.onClinicSelection.emit(clinic);
  };

  continue = () => {
    this.onContinue.emit('clinic');
  };
}
