import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Paginator } from 'primeng/paginator';
import { AppointmentService } from 'src/app/modules/appointment/services/appointment.service';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.css']
})
export class PaymentListComponent implements OnInit {
  first = 0;
  rows = 10;
  totalDataCount = 0;
  searchText = '';
  globalFilterColumn = [
    'id',
    'patientFirstName',
    'patientLastName',
    'serviceList',
    'appointmentType',
    'appointmentStatus',
    'paymentSource',
    'paymentStatus'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Patient', field: 'patientFirstName' },
    { header: 'Services', field: 'serviceList' },
    { header: 'Appointment Date', field: 'appointmentStartDate' },
    { header: 'Payment Status', field: 'paymentStatus' },
    { header: 'Payment Source', field: 'paymentSource' },
    { header: 'Created Date', field: 'appointmentCreatedDate' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: AppointmentDto[] = [];
  userId!: string;
  @ViewChild('paymentPaginator', { static: false }) paginator: Paginator;
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 50, //rows,
    recordArray: [10, 50, 100],
    currentRecordIndex: 1
  };
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadAppointment();
  }
  loadAppointment() {
    this.appointmentService
      .getAppointmentsByPage(
        this.searchText,
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      )
      .then((data: any) => {
        try {
          data.appointmentDTOList = data.elements.map((item: any) => {
            //console.log('datass', item.serviceList);
            item['serviceList'] = item.serviceList
              .map((e: any) => e.serviceName)
              .join(',');
            return item;
          });
          this.totalDataCount = data.count;
          this.rowData = data.elements;
        } catch (e) {
          //this.toastMessageService.error('Unable to load');
          console.log(e);
        }
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load appointments');
      });
  }

  searchPayment() {
    if (this.paginator.getPage() != 0) {
      this.paginator.changePage(0);
    } else {
      this.loadAppointment();
    }
  }

  editAppointment(id: Number) {
    this.router.navigate(['/payments/' + id + '/details'], {
      queryParams: {
        from: 'payments'
      }
    });
  }

  // editAppointment(id: Number) {
  //   this.router.navigate(['/appointment/' + id + '/payment']);
  // }

  deleteAppointmentModal(data: any) {
    this.appointmentService.deleteAppointment(data.id).then(
      () => {
        this.rowData = [];
        this.loadAppointment();
      },
      () => {
        this.toastMessageService.error('Unable to delete a appointment');
      }
    );
  }

  formatWord(word: string) {
    if (word === 'PartiallyRefunded') {
      return 'Partially refunded';
    }
    if (word === 'PartiallyPaid') {
      return 'Partially paid';
    }
    if (word === 'PartiallyDeposit') {
      return 'Partially deposit';
    }
    if (word === 'DepositPaid') {
      return 'Deposit Paid';
    } else {
      return word;
    }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentRecordIndex = event.first;
    console.log(event);
    this.loadAppointment();
  }
}
