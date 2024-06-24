import { Component, Input, OnChanges } from '@angular/core';
import { DoghnutChat, LineChart } from 'src/app/shared/models/charts';
//import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import moment from 'moment';
@Component({
  selector: 'app-booking-history-graph',
  templateUrl: './booking-history-graph.component.html',
  styleUrls: ['./booking-history-graph.component.css']
})
export class BookingHistoryGraphComponent implements OnChanges {
  @Input() appointment: any;
  lineChart: LineChart = new LineChart();
  lineChartForServicePayment = new LineChart();
  ChartForServiceWiseAppointmentStatus = new LineChart();

  providername = {
    firstName: 'All',
    lastName: '',
    id: -1
  };

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

  lineChartCommonOption: any = {
    layout: {
      padding: 15
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      labels: {
        render: 'value'
      }
    },
    legend: {
      position: 'bottom',
      labels: {
        fontColor: 'black',
        boxWidth: 20,
        padding: 20,
        fontFamily: 'Raleway',
        fontSize: 13
      }
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  //LeadsDataLineChart: LineChart = new LineChart();
  LeadsBYLandingPageLineChart: LineChart = new LineChart();
  month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  LeadbySourcePieChart: DoghnutChat = new DoghnutChat();

  constructor() {
    this.lineChartForServicePayment.lineChartOptions =
      this.lineChartCommonOption;
    console.log(
      'line',
      this.lineChartForServicePayment.lineChartData[0].lineChartLabels
    );
    this.ChartForServiceWiseAppointmentStatus.lineChartOptions =
      this.lineChartCommonOption;
  }

  ngOnChanges(): void {
    if (this.appointment) {
      this.onFilters(this.appointment);
      this.getLeadsCountForMonthAndWeek(this.appointment);
    }
  }

  onFilters(data: any) {
    data === null ? (this.appointment = []) : (this.appointment = data);

    if (this.providername && this.providername?.firstName == 'All') {
    } else {
      this.appointment = this.appointment.filter(
        (apt: any) => apt.providerId == this.providername.id
      );
    }
    if (this.appointment) {
      this.getAppointMentTypeForPieMap(this.appointment);
      this.getServiceWiseDataForPayment(this.appointment);
      this.getServiceWiseDataForAppointmntStatus(this.appointment);
    }
  }

  getServiceWiseDataForPayment(data: any) {
    const serviceWiseData: any = {};
    const payMent = {
      total: 0,
      average: 0
    };

    data.forEach((data: any) => {
      if (data.paymentStatus == 'Paid') {
        data.serviceList.forEach((service: any) => {
          if (service.serviceName in serviceWiseData) {
            serviceWiseData[service.serviceName].count++;
            serviceWiseData[service.serviceName].cost += service.serviceCost;
            serviceWiseData[service.serviceName].avg =
              service.serviceCost / serviceWiseData[service.serviceName].count;
          } else {
            serviceWiseData[service.serviceName] = {
              count: 1,
              cost: service.serviceCost,
              avg: service.serviceCost
            };
          }
        });
      }
    });
    const chartDataForPayments: any = [];

    for (var propt in serviceWiseData) {
      console.log('propt', propt);
      const obj = {
        data: [] as string[],
        label: ''
      };
      if (serviceWiseData[propt].avg % 1 !== 0) {
        serviceWiseData[propt].avg = serviceWiseData[propt].avg.toFixed(1);
      }
      obj.label = propt;
      obj.data.push(serviceWiseData[propt].cost, serviceWiseData[propt].avg);
      chartDataForPayments.push(obj);
    }

    this.lineChartForServicePayment.lineChartData = chartDataForPayments;
    this.lineChartForServicePayment.lineChartLabels = Object.keys(payMent);
  }

  getServiceWiseDataForAppointmntStatus(data: any) {
    const serviceWiseData: any = {};

    const apptStatus = {
      Pending: 0,
      Confirmed: 0,
      Cancelled: 0,
      Completed: 0
    };

    data.forEach((data: any) => {
      data.serviceList.forEach((service: any) => {
        if (service.serviceName in serviceWiseData) {
          if (data.appointmentStatus == 'Pending') {
            serviceWiseData[service.serviceName].pending++;
          }

          if (data.appointmentStatus == 'Canceled') {
            serviceWiseData[service.serviceName].cancelled++;
          } else if (data.appointmentStatus == 'Confirmed') {
            serviceWiseData[service.serviceName].confirmed++;
          } else if (data.appointmentStatus == 'Completed') {
            serviceWiseData[service.serviceName].completed++;
          }
        } else {
          serviceWiseData[service.serviceName] = {
            pending: 0,
            confirmed: 0,
            cancelled: 0,
            completed: 0
          };
          if (data.appointmentStatus == 'Pending') {
            serviceWiseData[service.serviceName].pending++;
          }

          if (data.appointmentStatus == 'Canceled') {
            serviceWiseData[service.serviceName].cancelled++;
          } else if (data.appointmentStatus == 'Confirmed') {
            serviceWiseData[service.serviceName].confirmed++;
          } else if (data.appointmentStatus == 'Completed') {
            serviceWiseData[service.serviceName].completed++;
          }
        }
      });
    });

    const chartDataForApptStatus = [];
    for (var propt in serviceWiseData) {
      const obj2 = { data: [] as string[], label: '' };

      obj2.label = propt;

      obj2.data.push(
        serviceWiseData[propt].pending,
        serviceWiseData[propt].confirmed,
        serviceWiseData[propt].cancelled,
        serviceWiseData[propt].completed
      );

      chartDataForApptStatus.push(obj2);
    }

    (this.ChartForServiceWiseAppointmentStatus.lineChartData =
      chartDataForApptStatus),
      (this.ChartForServiceWiseAppointmentStatus.lineChartLabels =
        Object.keys(apptStatus));
  }

  getLeadsCountForMonthAndWeek(data: any) {
    console.log('data......', data);
    const currentYear = new Date().getFullYear();
    const currentMonth = this.month[moment().month()];
    const currentMonthNo = moment(new Date()).month();
    data.forEach((obj: any) => {
      //console.log('onj', obj);
      const formattedData = moment(obj.appointmentCreatedDate);
      if (formattedData.isSame(new Date(), 'week')) {
        this.appointmentData.appointMentCountWeekly++;
      }
      if (formattedData.isSame(new Date(), 'day')) {
        this.appointmentData.appointMentCountToday++;
      }
      var monthName = moment(obj.appointmentCreatedDate).format('MMM');
      var year = moment(obj.appointmentCreatedDate).year();

      const monthNo = moment(obj.appointmentCreatedDate).month();
      console.log(currentMonth, year, currentYear);
      if (currentYear === year) {
        if (currentMonthNo >= monthNo) {
          this.monthlyData[monthName]++;
        }
      } else if (currentMonthNo < monthNo) {
        this.monthlyData[monthName]++;
      }
      //console.log('monthnam', monthName);
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
      const monthDiff = now.month() - from.month();
      if (monthDiff > 0 && monthDiff <= 1) {
        return this.appointmentData.appointMentCountLastMonth++;
      } else {
        return this.appointmentData;
      }
    });
    this.setLineChartData(this.appointmentData);
  }

  addYearToGraphData() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    for (let i = 0; i < 12; i++) {
      const year = i <= currentMonth ? currentYear : currentYear - 1;
      const key = `${this.month[i]} ${year}`;
      const oldKey = `${this.month[i]}`;
      this.appointmentData.monthlyAppointmentObj[key] =
        this.appointmentData.monthlyAppointmentObj[this.month[i]];
      delete this.appointmentData.monthlyAppointmentObj[oldKey];
    }
  }
  setLineChartData(data: any) {
    this.addYearToGraphData();
    console.log('da....', data);
    console.log(
      'data!!!!!!!!!!',
      data,
      this.appointmentData.monthlyAppointmentObj
    );
    this.lineChart.lineChartLabels = Object.keys(
      this.appointmentData.monthlyAppointmentObj
    );
    this.lineChart.lineChartData = [
      {
        data: Object.values(this.appointmentData.monthlyAppointmentObj),
        label: 'Appointments per Month'
      }
    ];
  }

  changeGraph(ChartNo: any) {
    if (ChartNo == 'appointmentPerMonth') {
      this.lineChart.isLineGraph = !this.lineChart.isLineGraph;
      this.lineChart.lineChartType = this.lineChart.isLineGraph
        ? 'line'
        : 'bar';
      this.lineChart.lineChartOptions = this.lineChartCommonOption;
    } else if (ChartNo == 'apt-payment') {
      this.lineChartForServicePayment.isLineGraph =
        !this.lineChartForServicePayment.isLineGraph;
      this.lineChartForServicePayment.lineChartType = this
        .lineChartForServicePayment.isLineGraph
        ? 'line'
        : 'bar';
      this.lineChartForServicePayment.lineChartOptions =
        this.lineChartCommonOption;
    } else if (ChartNo == 'apt-status') {
      this.ChartForServiceWiseAppointmentStatus.isLineGraph =
        !this.ChartForServiceWiseAppointmentStatus.isLineGraph;
      this.ChartForServiceWiseAppointmentStatus.lineChartType = this
        .ChartForServiceWiseAppointmentStatus.isLineGraph
        ? 'line'
        : 'bar';
      this.ChartForServiceWiseAppointmentStatus.lineChartOptions =
        this.lineChartCommonOption;
    }
  }

  getAppointMentTypeForPieMap(data: any) {
    let result: any = {};
    result = data.reduce(
      (acc: any, o: any) => (
        (acc[o.appointmentType] = (acc[o.appointmentType] || 0) + 1), acc
      ),
      {}
    );
    if ('null' in result) {
      const inPerson = result.InPerson;
      delete Object.assign(result, { ['InPerson']: result['null'] })['null'];
      result.InPerson += inPerson;
    }

    this.setPieChart(result);
    const leadsByLandingPageType: any = {};
    let count: any = 0;
    data.forEach((el: any) => {
      //console.log('el', el);
      if (el.landingPage) {
        leadsByLandingPageType[el.landingPage] =
          (leadsByLandingPageType[el.landingPage] || 0) + 1;
      } else {
        leadsByLandingPageType['others'] = count++;
      }
    });
  }

  setPieChart(result: any) {
    const data: number[] = Object.values(result);

    this.LeadbySourcePieChart.pieChartLabels = Object.keys(result);
    this.LeadbySourcePieChart.pieChartData = data;
  }
}
