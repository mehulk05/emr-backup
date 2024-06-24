import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClinicService } from 'src/app/modules/account-and-settings/clinic/services/clinic.service';
import { MService } from 'src/app/modules/account-and-settings/mservice/service/mservice.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../services/appointment.service';
import { CalendarService } from '../../services/calendar.service';
import { filter } from 'rxjs/operators';
import moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  filterForm!: FormGroup;
  appointments: any;
  defaultClinicId: any = '0';
  defaultProviderId: any = '0';
  defaultServiceId: any = '0';

  clinicsForFilter: any = [];
  providersForFilter: any = [];
  servicesForFilter: any = [
    {
      id: '0',
      name: 'All Services'
    }
  ];

  userId: any = null;
  currentSelectedProvider: any;
  timezone: any;
  providerColorObj: any = {};
  providerColors: any = [
    {
      id: 0,
      color: 'rgb(64 226 64)'
    },

    {
      id: 0,
      color: 'rgb(73 199 240)'
    },

    {
      id: 0,
      color: '#df03fc'
    },
    {
      id: 0,
      color: '#FF7F7F'
    },
    {
      id: 0,
      color: '#f0b961'
    },
    {
      id: 0,
      color: '#9300de'
    },
    {
      id: 0,
      color: '#de008d'
    },
    {
      id: 0,
      color: '#de0000'
    },
    {
      id: 0,
      color: '#00de81'
    }
  ];
  businessId: any;
  currentUserResponse: any;
  startDate: any;
  endDate: any;
  constructor(
    public formBuilder: FormBuilder,
    private clinicService: ClinicService,
    private toastService: ToasTMessageService,
    private mService: MService,
    private calendarService: CalendarService,
    private appointmentService: AppointmentService,
    private authenticationService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      clinicIdForFilter: [''],
      serviceIdForFilter: [''],
      providerIdForFilter: ['']
    });
    this.authenticationService.currentUserSubject
      .pipe(filter((data) => data != null))
      .subscribe((data) => {
        this.businessId = data?.businessId;
        this.userId = data?.id;
        this.defaultClinicId =
          this.localStorageService.readStorage('defaultClinic')?.id;
        this.loadAppointmentDashboardData();
      });
    this.startDate = moment().startOf('week').format('yyyy-MM-DD HH:mm');
    this.endDate = moment().endOf('week').format('yyyy-MM-DD HH:mm');
  }

  loadAppointmentDashboardData() {
    this.appointmentService
      .getAppointmentDashboardData(this.defaultServiceId, this.userId)
      .then((data: any) => {
        if (data) {
          if (data.clinicList) {
            this.setClinicsData(data.clinicList);
          }
          if (data.services) {
            this.servicesForFilter = this.servicesForFilter.concat(
              data.services.serviceList
            );
          }
          if (data.serviceProviders) {
            this.setProviderByServiceData(data.serviceProviders);
          }
          if (data.currentUserDetails) {
            this.setCurrentUserData(data.currentUserDetails);
          } else {
            this.loadUser();
          }
        }
      })
      .catch(() => {
        this.toastService.error('Unable to load calendar data.');
      });
  }

  loadClinics() {
    this.clinicService
      .getClinics()
      .then((response: any) => {
        this.setClinicsData(response);
      })
      .catch(() => {
        this.toastService.error('Unable to load clinics.');
      });
  }

  setClinicsData(response: any) {
    this.clinicsForFilter = response;
    this.timezone = this.clinicsForFilter[0].timezone;
    localStorage.setItem('clinicTimeZone', this.clinicsForFilter[0].timezone);
    if (!this.defaultClinicId) {
      this.defaultClinicId = this.clinicsForFilter[0]?.id;
    }
  }

  loadServices() {
    this.mService
      .getAllServices()
      .then((response: any) => {
        this.servicesForFilter = this.servicesForFilter.concat(
          response.serviceList
        );
      })
      .catch(() => {
        this.toastService.error('Unable to load services.');
      });
  }

  loadProviders() {
    this.calendarService
      .getProviderByServiceIds(this.defaultServiceId)
      .then((response: any) => {
        this.setProviderByServiceData(response);
      })
      .catch(() => {
        // this.toastService.error('Unable to load providers.');
      });
  }

  setProviderByServiceData(response: any) {
    if (response.userDTOList?.length > 0) {
      const obj = [{ id: '0', fullName: 'All Providers' }];
      this.providersForFilter = obj;
      response.userDTOList?.map((data: any) => {
        data['fullName'] = data.firstName + ' ' + data.lastName;
      });
      this.providersForFilter = this.providersForFilter.concat(
        response.userDTOList ?? []
      );

      const pdata: any = {};
      this.providersForFilter.map((data: any, i: any) => {
        const randomColor = this.getRandomColor();
        if (i < this.providerColors.length) {
          pdata[data.id] = { color: this.providerColors[i].color };
          this.providerColors[i][data.id] = {
            color: this.providerColors[i].color
          };
        } else {
          pdata[data.id] = { color: randomColor };
          this.providerColors.push({ id: data.id, color: randomColor });
        }
      });
      console.log(pdata, this.providerColors);
      this.providerColorObj = pdata;
    } else {
      this.providersForFilter = [];
      this.appointments = [];
      // this.currentSelectedProvider = undefined;
    }
  }

  loadUser() {
    this.calendarService
      .getOptimziedUser(this.userId)
      .then((response: any) => {
        this.setCurrentUserData(response);
      })
      .catch(() => {
        this.toastService.error('Unable to load Appointment Details.');
      });
  }

  setCurrentUserData(response: any) {
    this.currentUserResponse = response;
    if (response.isProvider) {
      if (response.roles.name === 'Provider' || response.isProvider) {
        //LoggedIn Provider as Default
        this.defaultProviderId = response.id;
      } else {
        //First provider of all providers is selected as default
        this.defaultProviderId =
          this.providersForFilter?.length > 0
            ? this.providersForFilter[0].id
            : [];
      }

      this.filterForm.patchValue({
        clinicIdForFilter: this.defaultClinicId,
        serviceIdForFilter: this.defaultServiceId,
        providerIdForFilter: this.defaultProviderId
      });

      this.loadFilterAppointments(
        this.defaultClinicId,
        this.defaultProviderId,
        this.defaultServiceId
      );
    } else {
      if (response.clinics?.length > 0 || this.clinicsForFilter.length > 0) {
        this.filterForm.patchValue({
          clinicIdForFilter: this.defaultClinicId,
          serviceIdForFilter: this.defaultServiceId,
          providerIdForFilter: this.defaultProviderId
        });
        this.loadFilterAppointments(
          this.defaultClinicId,
          this.defaultProviderId,
          this.defaultServiceId
        );
      }
    }
    this.currentSelectedProvider = this.getProviderObjById(
      this.defaultProviderId
    );
  }

  onClinicSelect(e: any) {
    this.defaultClinicId = e.value;
    this.loadFilterAppointments(
      this.defaultClinicId,
      this.defaultProviderId,
      this.defaultServiceId
    );
  }

  onServiceSelect(e: any) {
    this.defaultServiceId = e.value;
    this.loadProviders();
    this.loadFilterAppointments(
      this.defaultClinicId,
      this.defaultProviderId,
      this.defaultServiceId
    );
    //this.loadFilterAppointments(this.defaultClinicId, this.defaultProviderId, this.defaultServiceId);
  }
  onProviderSelect(e: any) {
    console.log(e);
    this.currentSelectedProvider = this.getProviderObjById(e.value);
    console.log(e.value);
    this.defaultProviderId = e.value;
    this.loadFilterAppointments(
      this.defaultClinicId,
      this.defaultProviderId,
      this.defaultServiceId
    );
  }

  loadFilterAppointments(clinicId: any, providerId: any, serviceId: any) {
    if (!this.startDate) {
      this.startDate = moment().startOf('week').format('yyyy-MM-DD HH:mm');
    }
    if (!this.endDate) {
      this.endDate = moment().endOf('week').format('yyyy-MM-DD HH:mm');
    }
    this.appointmentService
      .getOptimizedCalendarfilterAppointments(
        clinicId,
        providerId,
        serviceId,
        this.startDate,
        this.endDate
      )
      .then(
        (response: any) => {
          this.appointments = response.appointmentDTOList;
          // this.createCalenderEvents();
          // this.getVacationSchedule(clinicId, providerId);
        },
        () => {
          this.toastService.error('Unable to load appointments');
        }
      );
  }

  getProviderObjById(id: any) {
    return this.providersForFilter.find((x: any) => x.id === id);
  }

  onAppointmentCreated(e: any) {
    const formData = this.filterForm.value;
    console.log(e, formData);
    this.loadFilterAppointments(
      formData.clinicIdForFilter,
      formData.providerIdForFilter,
      formData.serviceIdForFilter
    );
  }
  OnProviderSelection(id: any) {
    this.filterForm.patchValue({
      clinicIdForFilter: this.filterForm.value.clinicIdForFilter,
      serviceIdForFilter: '0',
      providerIdForFilter: id.id
    });
    const formData = this.filterForm.value;
    this.currentSelectedProvider = this.getProviderObjById(id.id);
    this.defaultProviderId = formData.providerIdForFilter;
    this.loadFilterAppointments(
      formData.clinicIdForFilter,
      formData.providerIdForFilter,
      formData.serviceIdForFilter
    );
  }

  afterVacationCreated() {
    this.loadClinics();
  }

  loadAppointmentsCallback(e: any) {
    if (e) {
      this.startDate = e.startDate;
      this.endDate = e.endDate;
      this.loadFilterAppointments(
        this.defaultClinicId,
        this.defaultProviderId,
        this.defaultServiceId
      );
    }
  }

  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';

    // Function to calculate luminance (brightness) of a color
    const getLuminance = (hexColor: string) => {
      const rgb = parseInt(hexColor.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      // Calculate luminance using the relative luminance formula
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    do {
      color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
    } while (getLuminance(color) < 128); // Ensure the color is bright enough for black text

    return color;
  }
}
