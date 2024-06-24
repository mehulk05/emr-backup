import { Component, Input, OnChanges } from '@angular/core';
import {
  DoghnutChat,
  LineChart,
  SplineChart
} from 'src/app/shared/models/charts';

@Component({
  selector: 'app-leads-graph',
  templateUrl: './leads-graph.component.html',
  styleUrls: ['./leads-graph.component.css']
})
export class LeadsGraphComponent implements OnChanges {
  @Input() leadsData: any;
  seletedFilterYearValue: string = new Date().getFullYear().toString();
  yearsList: string[] = [];
  leadByStatus: number = 0;
  leadBySource: number = 0;
  leadByTag: number = 0;
  leadByLandingPage: number = 0;
  statusCounts: any = {};

  lineChartCommonOption: any = {
    layout: {
      padding: 15
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
            precision: 0
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

  backgroundColor: any = [
    '#5DD969',
    '#ADD8E6',
    '#ffff80',
    '#e0eafc',
    '#f0b961',
    '#277399',
    '#FF7F50',
    '#2a52eb',
    '#cae00d',
    '#00b571',
    '#00b5f1',
    '#ffb90f',
    '#5f6ff2',
    '#7c2727',
    '#f93f0b',
    '#ace1af',
    '#b4c2c2',
    '#5d3954',
    '#007f66'
  ];

  lineChartCommonColors = [
    {
      // grey
      backgroundColor: '#2656C9',
      borderColor: '#2656C9',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      borderWidth: 3
    }
  ];

  SplineDataChart: SplineChart = new SplineChart();
  LeadsDataLineChart: LineChart = new LineChart();
  LeadsBYLandingPageLineChart: LineChart = new LineChart();
  LeadByTagLineChart: LineChart = new LineChart();
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

  LeadbySourceLineChart: LineChart = new LineChart();
  LeadBStatusPieChart: DoghnutChat = new DoghnutChat();
  leadByStatusColors: any = {
    COLD: '#109bc7',
    DEAD: '#000',
    HOT: '#fe2000',
    NEW: '#01b700',
    WARM: '#fb6900',
    WON: '#aa4ee7',
    PENDING: '#F9C005',
    JUNK: '#9F9F9F'
  };
  byStatusTotalCount: number = 0;
  bySourceTotalCount: number = 0;
  constructor() {
    this.LeadsDataLineChart.lineChartOptions = this.lineChartCommonOption;
    this.LeadsBYLandingPageLineChart.lineChartOptions =
      this.lineChartCommonOption;
    this.LeadByTagLineChart.lineChartOptions = this.lineChartCommonOption;

    this.LeadsDataLineChart.lineChartColors = this.lineChartCommonColors;
    this.LeadsBYLandingPageLineChart.lineChartColors =
      this.lineChartCommonColors;
    this.LeadByTagLineChart.lineChartColors = this.lineChartCommonColors;
  }

  ngOnChanges(): void {
    if (this.leadsData) {
      if (this.leadsData?.totalLeadCount) {
        this.getLeadDashboardStats();
      }
      if (this.yearsList.length === 0) {
        const yearsArray = this.leadsData?.leadByMonthCount.map(
          (object: any) => object.year
        );
        const uniqueYears: string[] = [];
        yearsArray?.forEach((year: any) => {
          !uniqueYears.includes(year) && uniqueYears.push(year);
        });
        this.yearsList = uniqueYears.sort().reverse();
        this.seletedFilterYearValue = this.yearsList[0]?.toString();
        this.onYearSelect();
      }
    }
  }

  getLeadDashboardStats() {
    this.formatLeadDataByMonth(this.leadsData?.leadByMonthCount);
    this.formatLeadDataBySource(this.leadsData?.leadBySource);
    this.formatLeadDataByStatus(this.leadsData?.leadByStatus);
    this.formatLeadDataByLandingPage(this.leadsData?.leadByLandingPage);
    this.formatLeadDataByTag(this.leadsData?.leadByTags);
    this.getLeadsCount();
  }

  getLeadsCount() {
    this.leadByTag =
      this.leadsData?.leadByTags?.length > 0
        ? this.leadsData?.leadByTags.reduce(
            (a: number, o: any) => a + o.count,
            0
          )
        : 0;
    this.leadBySource =
      this.leadsData?.leadBySource?.length > 0
        ? this.leadsData?.leadBySource.reduce(
            (a: number, o: any) => a + o.count,
            0
          )
        : 0;
    this.leadByStatus =
      this.leadsData?.leadByStatus?.length > 0
        ? this.leadsData?.leadByStatus.reduce(
            (a: number, o: any) => a + o.count,
            0
          )
        : 0;
    this.leadByLandingPage =
      this.leadsData?.leadByLandingPages?.length > 0
        ? this.leadsData?.leadByLandingPages.reduce(
            (a: number, o: any) => a + o.count,
            0
          )
        : 0;
  }

  onYearSelect() {
    this.formatLeadDataByMonth(this.leadsData?.leadByMonthCount);
    this.formatLeadDataByStatus(this.leadsData?.leadByStatus);
    this.formatLeadDataByLandingPage(this.leadsData?.leadByLandingPage);
    this.formatLeadDataByTag(this.leadsData?.leadByTags);
    this.formatLeadDataBySource(this.leadsData?.leadBySource);
  }

  formatLeadDataBySource(data: any) {
    const leadsBySourceType: any = {};
    let sourceCount = 0;
    data.forEach((el: any) => {
      if (
        el.source &&
        (el.source != null || el.source != undefined || el.source != 'null')
      ) {
        if (
          this.seletedFilterYearValue &&
          this.seletedFilterYearValue === '' + el.year
        ) {
          el.source = el.source.split('?')[0];
          leadsBySourceType[el.source] = el.count;
          sourceCount += el.count;
        }
      } else {
      }
    });
    this.bySourceTotalCount = sourceCount;
    this.LeadbySourceLineChart.lineChartLabels = Object.keys(leadsBySourceType);
    this.LeadbySourceLineChart.lineChartData = [
      {
        data: Object.values(leadsBySourceType),
        label: 'Leads By Source',
        barThickness: 20
      }
    ];
    console.log('leadsBySourceType===> ' + JSON.stringify(leadsBySourceType));
  }

  formatLeadDataByStatus(data: any) {
    const labels: any[] = [];
    const piechartData: any = [];
    const pieChartPercentageVal: any = [];
    let totalCount = 0;
    data.map((item: any) => {
      if (
        this.seletedFilterYearValue &&
        this.seletedFilterYearValue === '' + item.year
      ) {
        totalCount += item.count;
      }
    });
    let statusCount = 0;
    const leadsByStatus: any = {};
    data.map((item: any) => {
      if (
        this.seletedFilterYearValue &&
        this.seletedFilterYearValue === '' + item.year
      ) {
        leadsByStatus[item.leadStatus] =
          (leadsByStatus[item.leadStatus] || 0) + 1;
        item['percentageValue'] = ((item.count / totalCount) * 100).toFixed(2);
        labels.push(item.leadStatus);
        pieChartPercentageVal.push(item['percentageValue']);
        piechartData.push(item.count);
        this.statusCounts[item.leadStatus] = item.count;
        statusCount += item.count;
      }
    });
    this.byStatusTotalCount = statusCount;

    const leadsByStatuskeys = Object.keys(leadsByStatus).sort();
    this.LeadBStatusPieChart.pieChartColors[0].backgroundColor = [];
    leadsByStatuskeys.map((data) => {
      this.LeadBStatusPieChart.pieChartColors[0].backgroundColor.push(
        this.leadByStatusColors[data]
      );
    });
    console.log(leadsByStatuskeys);
    console.log(leadsByStatus);

    this.LeadBStatusPieChart.pieChartData = piechartData;
    this.LeadBStatusPieChart.pieChartPercentageVal = pieChartPercentageVal;
    this.LeadBStatusPieChart['pieChartLabels'] = labels;
  }

  formatLeadDataByMonth(leadMonthlyData: any) {
    const newMonthlyData: any = {
      ...{
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
      }
    };
    console.log('newMonthlyData==> ' + JSON.stringify(newMonthlyData));
    leadMonthlyData?.sort((a: any, b: any) => a.month - b.month); // sort by month number
    console.log('leadMonthlyData==> ' + JSON.stringify(leadMonthlyData));

    leadMonthlyData?.forEach((data: any) => {
      const monthName = this.month[data.month - 1];
      const year = data.year.toString();
      console.log('called');
      console.log(
        year,
        this.seletedFilterYearValue,
        year == this.seletedFilterYearValue
      );
      if (year == this.seletedFilterYearValue) {
        delete newMonthlyData[monthName]; // delete the old key
        newMonthlyData[`${monthName}`] = data.count; // append the year to the month's key
      } else {
        delete newMonthlyData[monthName]; // delete the old key
        newMonthlyData[`${monthName}`] = 0; // append the year to the month's key
      }
    });
    console.log('Latest newMonthlyData==> ' + JSON.stringify(newMonthlyData));
    this.monthlyData = newMonthlyData;
    this.LeadsDataLineChart.lineChartLabels = Object.keys(this.monthlyData);
    this.LeadsDataLineChart.lineChartData = [
      {
        data: Object.values(this.monthlyData),
        label: 'Leads per month',
        barThickness: 20
      }
    ];
  }

  formatLeadDataByLandingPage(data: any) {
    const leadsByLandingPageType: any = {};
    data.forEach((el: any) => {
      if (
        el.landingPageName &&
        (el.landingPageName != null ||
          el.landingPageName != undefined ||
          el.landingPageName != 'null')
      ) {
        if (
          this.seletedFilterYearValue &&
          this.seletedFilterYearValue === '' + el.year
        ) {
          el.landingPageName = el.landingPageName.split('?')[0];
          leadsByLandingPageType[el.landingPageName] = el.count;
        }
      } else {
      }
    });
    this.LeadsBYLandingPageLineChart.lineChartLabels = Object.keys(
      leadsByLandingPageType
    );
    this.LeadsBYLandingPageLineChart.lineChartData = [
      {
        data: Object.values(leadsByLandingPageType),
        label: 'Leads By Landing Page',
        barThickness: 20
      }
    ];
    console.log(leadsByLandingPageType);
  }

  formatLeadDataByTag(data: any) {
    const leadsByTagType: any = {};
    data.forEach((el: any) => {
      if (
        el.tag &&
        (el.tag != null || el.tag != undefined || el.tag != 'null')
      ) {
        if (
          this.seletedFilterYearValue &&
          this.seletedFilterYearValue === '' + el.year
        ) {
          el.tag = el.tag.split('?')[0];
          leadsByTagType[el.tag] = el.count;
        }
      } else {
      }
    });
    this.LeadByTagLineChart.lineChartLabels = Object.keys(leadsByTagType);
    this.LeadByTagLineChart.lineChartData = [
      {
        data: Object.values(leadsByTagType),
        label: 'Leads By Tag',
        barThickness: 20
      }
    ];
    console.log(leadsByTagType);
  }

  getStatsForPercentageChange(lastCount: any, currentCount: any) {
    // lastCount =50
    // currentCount=100
    const denominttor = lastCount == 0 ? 1 : lastCount;
    const result = (
      Number((currentCount - lastCount) / denominttor) * 100
    ).toFixed(2);
    return result;
  }
}
