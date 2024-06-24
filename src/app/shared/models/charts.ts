import { ChartType } from 'chart.js';

export interface IPieChart {
  pieChartPlugins: [];
  pieChartLegend: boolean;
  pieChartType: string;
  pieChartData: any;
  pieChartLabels: any;
  pieChartOptions?: any;
  isPieChartPercentage: boolean;
}

export interface IDoghnut {
  pieChartPlugins: [];
  pieChartLegend: boolean;
  pieChartType: string;
  pieChartData: any;
  pieChartPercentageVal: any;
  pieChartLabels: any;
  pieChartOptions?: any;
  isPieChartPercentage: boolean;
  pieChartColors: any;
}

export interface ILineChart {
  lineChartColors: {};
  lineChartOptions: {};
  lineChartLabels: any;
  lineChartData: any;
  lineChartType: string;
  lineChartLegend: boolean;
  isLineGraph: boolean;
  fill: boolean;
}

export class LineChart implements ILineChart {
  lineChartColors: any = [
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
  lineChartOptions: any = {
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

  lineChartLabels: any = [];
  lineChartData: any = [{ data: [], label: 'Series A', barThickness: 20 }];
  lineChartType: any = 'bar';
  lineChartLegend = true;
  isLineGraph = false;
  fill = true;
}
export class PieChart implements IPieChart {
  pieChartPlugins: [] = [];
  pieChartLegend: boolean = true;
  pieChartType = 'doughnut';
  pieChartData = [0, 0, 0];
  pieChartLabels: any = [];
  pieChartOptions = {};
  isPieChartPercentage: boolean = false;
}

export class DoghnutChat implements IDoghnut {
  pieChartPlugins: [] = [];
  pieChartLegend: boolean = true;
  pieChartType: any = 'doughnut';
  pieChartData = [0, 0, 0, 0, 0, 0];
  pieChartPercentageVal: any = [0, 0, 0, 0, 0, 0];
  pieChartLabels: any = [];
  pieChartOptions: any = {
    cutoutPercentage: 80,
    legend: {
      display: false
    },
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      callbacks: {
        label: (ttItem: any, data: any) =>
          `${data.labels[ttItem.index]}: ${
            data.datasets[ttItem.datasetIndex].data[ttItem.index]
          }%`
      }
    },
    plugins: {
      labels: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: function (args: any) {
          return '';
        },
        fontColor: ['black', 'black', 'black'],
        precision: 2
      }
    },
    // legend: {
    //   position: 'bottom',
    //   labels: {
    //     fontColor: 'black',
    //     boxWidth: 15,
    //     padding: 10,
    //     fontFamily: 'Raleway',
    //     fontSize: 12,
    //     fontStyle: 600
    //   }
    // },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };
  isPieChartPercentage: boolean = true;
  pieChartColors = [
    {
      backgroundColor: [
        'rgb(144, 238, 144)',
        '#ADD8E6',
        '#ffff80',
        '#e0eafc',
        '#f0b961',
        'black'
      ]
    }
  ];
}

export class SplineChart {
  public splineChartOptions: any = {
    legend: {
      display: false
    },
    responsive: true
  };
  public splineChartColors: Array<any> = [
    {
      backgroundColor: '#f0f2fa',
      borderColor: '#2a52f5',
      pointBackgroundColor: '#2a52f5',
      pointBorderColor: 'green',
      pointHoverBackgroundColor: 'pink',
      pointHoverBorderColor: 'yellow'
    }
  ];
  public splineChartLegend: boolean = true;
  public splineChartType: ChartType = 'line';
}
