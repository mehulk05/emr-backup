import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import moment from 'moment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ClinicService } from 'src/app/modules/account-and-settings/clinic/services/clinic.service';

@Component({
  selector: 'app-booking-history-dashboard',
  templateUrl: './booking-history-dashboard.component.html',
  styleUrls: ['./booking-history-dashboard.component.css']
})
export class BookingHistoryDashboardComponent implements OnInit {
  appointment: any;
  monthlyData: any = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0
  };

  showHide: boolean = false;
  btnName: any = 'Hide Details';
  showModal: boolean = false;

  appointmentData = {
    totalAppointMentCount: 0,
    appointMentCountWeekly: 0,
    appointMentCountMonthly: 0,
    appointMentCountLastWeek: 0,
    appointMentCountLastMonth: 0,
    appointMentCountYesterday: 0,
    appointMentCountToday: 0,
    monthlyAppointmentObj: this.monthlyData,
    appointMentType: {}
  };
  businessId: any;
  bookingData: any = {};
  showAppointmentModal: boolean = false;
  clinicsForFilter: any = [];
  timezone: any;
  isRefreshApiCall = 0;
  servicesForFilter: any[] = [];
  providerList: any[] = [];

  constructor(
    public appointmentService: AppointmentService,
    public toasTMessageService: ToasTMessageService,
    private localStorageService: LocalStorageService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.businessId =
      this.localStorageService.readStorage('businessData')?.businessId;
    if (this.businessId) {
      // this.getAppointmentCountForBusiness();
      this.loadAppointmentDashboardData();
    }
  }

  loadAppointmentDashboardData() {
    this.appointmentService
      .getAppointmentDashboardData('0', null, true)
      .then((data: any) => {
        if (data) {
          if (data.appointmentStats) {
            this.bookingData = data.appointmentStats;
          }
          if (data.clinicList) {
            this.clinicsForFilter = data.clinicList ?? [];
            this.timezone = this.clinicsForFilter[0].timezone;
            localStorage.setItem(
              'clinicTimeZone',
              this.clinicsForFilter[0].timezone
            );
          }
          const obj = [{ id: '0', name: 'All Services' }];
          this.servicesForFilter = obj;
          this.servicesForFilter.splice(1, 0, ...data.services.serviceList);
          // this.servicesForFilter = data.services.serviceList ?? [];
          if (data.serviceProviders) {
            this.setProviderByServiceData(data.serviceProviders);
          }
        }
      })
      .catch(() => {
        this.toasTMessageService.error('Unable to load Booking history data.');
      });
  }

  setProviderByServiceData(response: any) {
    if (response.userDTOList?.length > 0) {
      const obj = [{ id: '0', fullName: 'All Providers' }];
      this.providerList = obj;
      response.userDTOList?.map((data: any) => {
        data['fullName'] = data.firstName + ' ' + data.lastName;
      });
      this.providerList = this.providerList.concat(response.userDTOList ?? []);
    } else {
      this.providerList = [];
    }
  }

  loadClinics() {
    this.clinicService
      .getClinics()
      .then((response: any) => {
        this.clinicsForFilter = response;
        this.timezone = this.clinicsForFilter[0].timezone;
        localStorage.setItem(
          'clinicTimeZone',
          this.clinicsForFilter[0].timezone
        );
      })
      .catch(() => {
        this.toasTMessageService.error('Unable to load clinics.');
      });
  }

  showHideModal() {
    if (this.showHide) {
      this.showHide = false;
      this.btnName = 'Hide Details';
    } else {
      this.showHide = true;
      this.btnName = 'Show Details';
    }
  }

  getAppointmentCountForBusiness() {
    this.appointmentService
      .getAppointmentCountForBusiness(this.businessId)
      .then(
        (response) => {
          if (response) {
            this.bookingData = response;
          }
        },
        () => {
          this.toasTMessageService.error('Unable to load appointments.');
        }
      );
  }

  getOptimizedData() {
    this.appointmentService.getAppointmentsOptimisedBookingDetails().then(
      (data: any) => {
        this.appointmentData.totalAppointMentCount = data.length;
        //console.log('data.....', data);
        this.getLeadsCountForMonthAndWeek(data);
      },
      () => {
        this.toasTMessageService.error('Unable to load appointments.');
      }
    );
  }

  getLeadsCountForMonthAndWeek(data: any) {
    //console.log('data......', data);
    data.forEach((obj: any) => {
      //console.log('onj', obj);
      if (moment(obj.appointmentCreatedDate).isSame(new Date(), 'week')) {
        this.appointmentData.appointMentCountWeekly++;
      }
      if (moment(obj.appointmentCreatedDate).isSame(new Date(), 'day')) {
        this.appointmentData.appointMentCountToday++;
      }
      var monthName = moment(obj.appointmentCreatedDate).format('MMM');
      //console.log('monthnam', monthName);
      this.monthlyData[monthName]++;
      if (moment(obj.appointmentCreatedDate).isSame(new Date(), 'month')) {
        this.appointmentData.appointMentCountMonthly++;
      }
      const from = moment(obj.appointmentCreatedDate);

      const now = moment(new Date());
      const dayDiff = now.diff(from, 'days');

      var yesterday = moment().subtract(1, 'day');
      if (from.isSame(yesterday, 'day')) {
        this.appointmentData.appointMentCountYesterday++;
      }

      if (dayDiff >= 7 && dayDiff <= 14) {
        this.appointmentData.appointMentCountLastWeek++;
      }
    });
  }

  showTable() {
    this.showHide = false;
  }

  showGraph() {
    this.appointmentService.getAppointmentsOptimised().then(
      (data: any) => {
        this.appointment = data;
        this.showHide = true;
      },
      () => {
        this.toasTMessageService.error('Unable to load appointments.');
      }
    );
  }

  getStatsForPercentageChange(lastCount: number, currentCount: number) {
    const denominttor = lastCount == 0 ? 1 : lastCount;
    const result = (
      Number((currentCount - lastCount) / denominttor) * 100
    ).toFixed(2);
    return result;
  }

  onAddAppointment() {
    this.showAppointmentModal = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  closeModal(e: any) {
    this.showAppointmentModal = false;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // afterAppointmentCreated(e: any) {
  //   this.isRefreshApiCall++;
  //   if (this.businessId) {
  //     this.getAppointmentCountForBusiness();
  //   }
  // }
  // After the appointment is created, reset modal state and refresh data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterAppointmentCreated(e: any) {
    this.showAppointmentModal = false; // Reset modal state
    this.isRefreshApiCall++; // Trigger data refresh
    if (this.businessId) {
      this.getAppointmentCountForBusiness();
    }
  }
}
