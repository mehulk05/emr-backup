import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../../services/appointment.service';
import moment from 'moment';

@Component({
  selector: 'app-appointment-filter',
  templateUrl: './appointment-filter.component.html',
  styleUrls: ['./appointment-filter.component.css']
})
export class AppointmentFilterComponent implements OnInit {
  @Input() clinicList: any = [];
  @Input() providerList: any = [];
  @Input() serviceList: any = [
    {
      id: '0',
      name: 'All Services'
    }
  ];

  selectedService: any = '0';
  selectedClinic: any;
  selectedProvider: any = '0';
  afterDate: any = moment('0001-01-01').endOf('day').format('YYYY-MM-DD HH:mm'); // default after date for after filter
  beforeDate: any = moment('9999-12-31')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm'); // default before date for before filter
  startDate: any = null; //start date for date filter 'between'
  endDate: any = null; // end date for date filter 'between'
  startDateValLoad: any = moment('0001-01-01')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm'); //start date while loading
  endDateValLoad: any = moment('9999-12-31')
    .endOf('day')
    .format('YYYY-MM-DD HH:mm'); //end date while loading
  startDateVal: any = moment('0001-01-01')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm'); //start date for filters
  endDateVal: any = moment('9999-12-31')
    .endOf('day')
    .format('YYYY-MM-DD HH:mm'); //end date for filters
  activeDateFilter: string = '';
  activePriorityFilter: string = '';
  minDate: string;
  maxDate: string;

  @Output() appointmentFilter = new EventEmitter<any>();
  constructor(
    private appointmentService: AppointmentService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    // this.loadClinics();
    // this.loadServices();
    // this.loadProviders();
    console.log('Inside Appointment Filter');
    this.appointmentFilter.emit({
      clinic: this.selectedClinic,
      service: this.selectedService,
      provider: this.selectedProvider,
      startDate: this.startDateVal,
      endDate: this.endDateVal
    });
  }

  onClinicSelect(e: any, flag: any) {
    console.log(e);
    if (flag == 'clinic') {
      this.selectedClinic = e.value;
    } else if (flag == 'service') {
      this.selectedService = e.value;
    } else {
      this.selectedProvider = e.value;
    }
    this.appointmentFilter.emit({
      clinic: this.selectedClinic,
      service: this.selectedService,
      provider: this.selectedProvider,
      startDate: this.startDateVal,
      endDate: this.endDateVal
    });
  }

  loadClinics() {
    this.appointmentService
      .getAllOptimizedCinicList()
      .then((response: any) => {
        this.clinicList = response;
      })
      .catch(() => {
        this.toastService.error('Unable to load clinics.');
      });
  }

  loadServices() {
    console.log('Inside loadServices ');
    this.appointmentService
      .getAllServicesForDropdown(null)
      .then((response: any) => {
        const obj = [{ id: '0', name: 'All Services' }];
        this.serviceList = obj;
        console.log(this.serviceList);

        this.serviceList.splice(1, 0, ...response.serviceList);

        console.log(this.serviceList);

        // this.serviceList = this.serviceList.concat(response.serviceList);
      })
      .catch(() => {
        this.toastService.error('Unable to load services.');
      });
  }

  loadProviders() {
    this.appointmentService
      .getProviderByServiceIds(this.selectedProvider)
      .then((response: any) => {
        const obj = [{ id: '0', fullName: 'All Providers' }];
        this.providerList = obj;
        response.userDTOList.map((data: any) => {
          data['fullName'] = data.firstName + ' ' + data.lastName;
        });
        this.providerList = this.providerList.concat(response.userDTOList);
      })
      .catch(() => {
        // this.toastService.error('Unable to load providers.');
      });
  }

  onDateFilter(dateValue: any) {
    this.startDateVal = null;
    this.endDateVal = null;
    const today = moment().startOf('day').format('YYYY-MM-DD HH:mm');
    const yesterday = moment()
      .subtract(1, 'days')
      .startOf('day')
      .format('YYYY-MM-DD HH:mm');
    const lastWeekStart = moment()
      .subtract(1, 'weeks')
      .startOf('week')
      .format('YYYY-MM-DD HH:mm');
    const lastWeekEnd = moment()
      .subtract(1, 'weeks')
      .endOf('week')
      .format('YYYY-MM-DD HH:mm');
    const lastMonthStart = moment()
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD HH:mm');
    const lastMonthEnd = moment()
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD HH:mm');
    switch (dateValue) {
      case 'Today':
        this.startDateVal = today;
        this.endDateVal = moment(today).endOf('day').format('YYYY-MM-DD HH:mm');
        break;
      case 'Yesterday':
        this.startDateVal = yesterday;
        this.endDateVal = moment(yesterday)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm');
        break;
      case 'LastWeek':
        this.startDateVal = lastWeekStart;
        this.endDateVal = lastWeekEnd;
        break;
      case 'LastMonth':
        this.startDateVal = lastMonthStart;
        this.endDateVal = lastMonthEnd;
        break;
      case 'After':
        this.startDateVal = moment(this.afterDate)
          .endOf('day')
          .format('YYYY-MM-DD HH:mm');
        this.endDateVal = moment('9999-12-31')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm');
        break;
      case 'Before':
        this.startDateVal = moment('0001-01-01')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm');
        this.endDateVal = moment(this.beforeDate)
          .startOf('day')
          .format('YYYY-MM-DD HH:mm');
        break;
      case 'Between':
        this.startDateVal =
          this.startDate == null
            ? null
            : moment(this.startDate).startOf('day').format('YYYY-MM-DD HH:mm');
        this.endDateVal =
          this.endDate == null
            ? null
            : moment(this.endDate).endOf('day').format('YYYY-MM-DD HH:mm');
        break;
      default:
        this.startDateVal = this.startDateValLoad;
        this.endDateVal = this.endDateValLoad;
        break;
    }
    // console.log("START DATE: "+this.startDateVal+"END DATE: "+this.endDateVal)
    this.appointmentFilter.emit({
      clinic: this.selectedClinic,
      service: this.selectedService,
      provider: this.selectedProvider,
      startDate: this.startDateVal,
      endDate: this.endDateVal
    });
  }
}
