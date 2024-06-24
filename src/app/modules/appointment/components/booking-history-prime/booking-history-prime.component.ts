import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FileSaverService } from 'ngx-filesaver';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../services/appointment.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Table } from 'primeng/table';
import * as XLSX from 'xlsx';
import { Paginator } from 'primeng/paginator';
import moment from 'moment';

@Component({
  selector: 'app-booking-history-prime',
  templateUrl: './booking-history-prime.component.html',
  styleUrls: ['./booking-history-prime.component.css']
})
export class BookingHistoryPrimeComponent implements OnChanges {
  @Input() isRefreshApiCall: number;
  @Input() clinicList: any[];
  @Input() serviceList: any[];
  @Input() providerList: any[];
  startDateValLoad: any = moment('0001-01-01')
    .startOf('day')
    .format('YYYY-MM-DD HH:mm'); //start date while loading the leads
  endDateValLoad: any = moment('9999-12-31')
    .endOf('day')
    .format('YYYY-MM-DD HH:mm'); //end date while loading the leads
  appointmentFilter: any = {
    clinic: null,
    provider: '0',
    service: '0',
    startDate: this.startDateValLoad,
    endDate: this.endDateValLoad
  };
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'patientFirstName',
    'patientLastName',
    'clinicName',
    'providerName',
    'serviceList[0].serviceName',
    'appointmentType',
    'paymentStatus',
    'appointmentStatus',
    'source',
    'appointmentCreatedDate',
    'appointmentStartDate',
    'fullName',
    'serviceNames'
  ];
  columns = [
    { header: 'Checkbox', field: 'Checkbox' },
    { header: 'Id', field: 'id' },
    { header: 'Patient', field: 'patientFirstName' },
    { header: 'Clinic', field: 'clinicName' },
    { header: 'Provider', field: 'providerName' },
    { header: 'Services', field: 'serviceList' },
    { header: 'Type', field: 'appointmentType' },
    { header: 'Source', field: 'source' },
    { header: 'Appointment Date', field: 'appointmentStartDate' },
    { header: 'Payment Status', field: 'paymentStatus' },
    { header: 'Appointment Status', field: 'appointmentStatus' },
    { header: 'Created Date', field: 'appointmentCreatedDate' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: AppointmentDto[] = [];
  appointmentList: any[] = [];

  userId!: string;

  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 50, 100],
    currentRecordIndex: 1
  };
  @ViewChild('appointmentPaginator', { static: false }) paginator: Paginator;

  totalDataCount = 0;
  searchText = '';
  showExportModal: boolean = false;
  selectedRows: any[] = [];
  isSingleDelete: boolean = false;
  selectedRowsText: any;
  paidStatus: String;
  unpaidStatus: String;
  depositeStatus: String;
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private fileSaverService: FileSaverService
  ) {}

  ngOnChanges(): void {
    if (this.isRefreshApiCall !== 0) {
      this.loadOptimisedAppointment(
        this.appointmentFilter.clinic,
        this.appointmentFilter.provider,
        this.appointmentFilter.service,
        this.appointmentFilter.startDate,
        this.appointmentFilter.endDate
      );
    }
  }

  loadOptimisedAppointment(
    clinicId?: any,
    providerId?: any,
    serviceId?: any,
    startDate?: string,
    endDate?: string
  ) {
    this.appointmentService
      .getOptimizedfilterAppointmentsByPage(
        clinicId,
        providerId,
        serviceId,
        this.searchText,
        startDate,
        endDate,
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord
      )
      .then((data: any) => {
        try {
          data.elements.map((data: any) => {
            const serviceNames: any[] = [];
            data['fullName'] =
              data.patientFirstName + ' ' + data.patientLastName;
            data.serviceList.forEach((elm: any) => {
              serviceNames.push(elm.serviceName);
            });
            data['services'] = serviceNames;
            data['serviceNames'] = serviceNames.join(', ');
          });

          this.rowData = data.elements;
          this.totalDataCount = data.count;
        } catch (e) {
          //this.toastMessageService.error('Unable to load');
          console.log(e);
        }
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load appointments');
      });
  }

  editAppointment(id: Number) {
    this.router.navigate(['/appointment/booking-history/' + id + '/edit']);
  }

  deleteAppointmentModal(data: any) {
    // const index = this.selectedRows.findIndex(item => item.id === data.id);
    // if (index !== -1) {
    //   this.selectedRows.splice(index, 1);
    //   this.updateSelectedRowsText();

    this.paidStatus = data.paymentStatus;
    console.log(this.paidStatus);
    this.modalData = {
      name: data.patientFirstName + ' ' + data.patientLastName,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName =
      data.patientFirstName + ' ' + data.patientLastName;
    this.modalData.titleName = 'Appointment';
    this.isSingleDelete = true;
    // this.deleteWarningComponent.selectedRows;
  }
  updateSelectedRowsText() {
    if (this.paidStatus == 'Unpaid') {
      console.log('not null');
      this.selectedRowsText = this.selectedRows.length - 1;
      // console.log(this.selectedRowsText);
      this.selectedRows.length = this.selectedRowsText;
      // console.log(this.selectedRows.length);
    }
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      if (this.isSingleDelete) {
        this.deleteAppointment(this.modalData.id);
      } else {
        this.deleteAppointmentMass();
      }
    }
  }

  deleteAllSelectedTemplateModal() {
    // const index = this.selectedRows.findIndex(item => item.id === this.selectedRows);
    //       console.log(index);
    //       if (index == -1) {
    //           this.selectedRows.splice(index, 1);
    //           this.updateSelectedRowsText();
    //           console.log(this.selectedRows);
    //       }
    console.log(this.selectedRows);
    const appointmentIds = this.selectedRows.map((o) => o.id);

    if (appointmentIds.length === 1) {
      const data = this.selectedRows[0];
      this.modalData = {
        name: data.patientFirstName + ' ' + data.patientLastName,
        id: data.id
      };
      this.showModal = true;
      this.modalData.feildName =
        data.patientFirstName + ' ' + data.patientLastName;
      this.modalData.titleName = 'Appointment';
      this.isSingleDelete = true;
    } else {
      this.isSingleDelete = false;
      this.modalData = {};
      this.showModal = true;
      this.modalData.feildName = 'all selected appointments';
      this.modalData.titleName = 'All Selected Appointments';
      this.modalData.count = this.selectedRows.length;
      this.modalData.moduleName = 'appointments';
    }
  }

  deleteAppointmentMass() {
    const appointmentIds = this.selectedRows.map((o) => o.id);
    console.log(this.selectedRows);

    let isAnyUnpaid = false;
    let isAnyPaid = false;
    for (const obj of this.selectedRows) {
      if (obj.paymentStatus === 'Unpaid') {
        isAnyUnpaid = true;
        break;
      }
    }
    for (const obj of this.selectedRows) {
      if (obj.paymentStatus === 'Paid') {
        isAnyPaid = true;
        break;
      }
    }
    // if (isAnyUnpaid) {
    //   console.log("At least one appointment has a paymentStatus of 'UnPaid'.");
    // } else {
    //   console.log("None of the appointments have a paymentStatus of 'UnPaid'.");
    // }

    this.appointmentService.deleteAppointmentsMass(appointmentIds).then(
      () => {
        this.selectedRows = [];
        this.rowData = [];
        console.log(this.selectedRows);
        this.loadOptimisedAppointment(
          this.appointmentFilter.clinic,
          this.appointmentFilter.provider,
          this.appointmentFilter.service,
          this.appointmentFilter.startDate,
          this.appointmentFilter.endDate
        );
        if (isAnyUnpaid) {
          this.toastMessageService.success(
            'Appointments deleted successfully.'
          );
        } else {
          // this.toastMessageService.error('Unable to delete a appointment.');
        }
        if (isAnyPaid) {
          this.toastMessageService.error('Unable to delete paid appointments.');
        }
        // this.toastMessageService.success('Appointments deleted successfully');
      },
      () => {
        // this.toastMessageService.error('Unable to delete a appointment');
      }
    );
  }

  deleteAppointment(id: any) {
    this.appointmentService.deleteAppointment(id).then(
      () => {
        this.rowData = [];
        if (this.selectedRows?.length === 1 && this.selectedRows[0].id === id) {
          this.selectedRows = [];
        }
        this.loadOptimisedAppointment(
          this.appointmentFilter.clinic,
          this.appointmentFilter.provider,
          this.appointmentFilter.service,
          this.appointmentFilter.startDate,
          this.appointmentFilter.endDate
        );
        this.toastMessageService.success('Appointment deleted successfully');
      },
      () => {
        // this.toastMessageService.error('Unable to delete a appointment');
      }
    );
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  @ViewChild('dt1') pTableRef: Table;

  openExportFile() {
    this.showExportModal = true;
  }

  onCloseExportFileModal(e: any) {
    this.showExportModal = false;
    if (e.isExcel) {
      this.downloadAsExcel();
    }
    if (e.isPdf) {
      this.downloadAsPdf();
    }
  }

  downloadAsPdf() {
    this.download(false);
  }

  downloadAsExcel() {
    this.download(true);
  }

  download(isExcel: boolean) {
    const appointmentIds = this.selectedRows?.map((row) => row.id) || [];
    this.appointmentService
      .getAppointmentsExportList(appointmentIds)
      .then((data: any) => {
        try {
          data.appointmentDTOList.map((data: any) => {
            const serviceNames: any[] = [];
            data['fullName'] =
              data.patientFirstName + ' ' + data.patientLastName;
            data.serviceList.forEach((elm: any) => {
              serviceNames.push(elm.serviceName);
            });
            data['serviceNames'] = serviceNames.join(', ');
          });
          if (isExcel) {
            this.downloadExcelIntenal(data?.appointmentDTOList);
          } else {
            this.downloadAsPdfIntenal(data?.appointmentDTOList);
          }
          this.selectedRows = [];
        } catch (e) {
          //this.toastMessageService.error('Unable to load');
          console.log(e);
        }
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load appointments');
      });
  }

  downloadExcelIntenal(data: any) {
    data?.forEach((data1: any) => {
      let temp = {};
      var patientName = data1.patientFirstName + ' ' + data1.patientLastName;
      temp = {
        Id: data1.id,
        Patient: patientName,
        Clinic: data1.clinicName,
        Provider: data1.providerName,
        Services: data1.serviceNames,
        'Appointment Date': this.formatTimeService.formatBookingHistoryTime(
          data1.appointmentStartDate
        ),
        'Payment Status': data1.paymentStatus,
        'Appointment Status': data1.appointmentStatus,
        'Appointment Source': data1.source,
        'Appointment Type': data1.appointmentType,
        'Created Date': this.formatTimeService.formatTime(
          data1.appointmentCreatedDate
        )
      };

      this.appointmentList.push(temp);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.appointmentList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, 'appointmentList.xls');
  }

  downloadAsPdfIntenal(data: any) {
    const doc = new jsPDF('l', 'mm', 'a4');

    const dataArray = new Array();
    data?.forEach((data: any) => {
      var patientName = data.patientFirstName + ' ' + data.patientLastName;
      const temp = [
        data.id,
        patientName,
        data.clinicName,
        data.providerName,
        data.serviceNames,
        this.formatTimeService.formatBookingHistoryTime(
          data.appointmentStartDate
        ),
        data.paymentStatus,
        data.appointmentStatus,
        this.formatTimeService.formatTime(data.appointmentCreatedDate)
        // new Date(Date.parse(data.appointmentCreatedDate)).toLocaleString(
        //   'en-US'
        // )
      ];

      dataArray.push(temp);
    });
    const columns = [
      [
        'Id',
        'Patient',
        'Clinic',
        'Provider',
        'Services',
        'Appointment Date',
        'Payment Status',
        'Appointment Status',
        'Created Date'
      ]
    ];

    autoTable(doc, {
      head: columns,
      body: dataArray,
      theme: 'grid',
      headStyles: { fillColor: [128, 128, 128] }
    });
    // doc.text('Appointments List', 140, 10, { align: 'center' });
    doc.setTextColor(0);
    doc.save('Appointments.pdf');
  }

  formatWord(word: string) {
    if (word === 'PartiallyRefunded') {
      return 'Partial Refund';
    }
    if (word === 'PartiallyPaid') {
      return 'Partly Paid';
    }
    if (word === 'PartiallyDeposit') {
      return 'Partial Deposit';
    }
    if (word === 'DepositPaid') {
      return 'Deposit Paid';
    } else {
      return word;
    }
  }

  onAppointmentFilter(e: any) {
    console.log(e);
    this.rowData = [];
    this.appointmentFilter = e;
    this.appointmentFilter.startDate = e.startDate
      ? e.startDate
      : this.startDateValLoad;
    this.appointmentFilter.endDate = e.endDate
      ? e.endDate
      : this.endDateValLoad;
    this.loadOptimisedAppointment(
      this.appointmentFilter.clinic,
      this.appointmentFilter.provider,
      this.appointmentFilter.service,
      this.appointmentFilter.startDate,
      this.appointmentFilter.endDate
    );
  }

  searchPayment() {
    // this.paginatorConfig.currentPage = 0;
    // this.paginatorConfig.currentRecordIndex = 1;
    if (this.paginator.getPage() != 0) {
      this.paginator.changePage(0);
    } else {
      this.loadOptimisedAppointment(
        this.appointmentFilter.clinic,
        this.appointmentFilter.provider,
        this.appointmentFilter.service,
        this.appointmentFilter.startDate,
        this.appointmentFilter.endDate
      );
    }
  }

  resetSearchh() {
    this.searchText = '';
    this.loadOptimisedAppointment(
      this.appointmentFilter.clinic,
      this.appointmentFilter.provider,
      this.appointmentFilter.service,
      this.appointmentFilter.startDate,
      this.appointmentFilter.endDate
    );
  }

  paginate(event: any) {
    console.log(event);
    this.paginatorConfig.currentPage = event.page;
    this.paginatorConfig.noOfRecord = event.rows;
    this.paginatorConfig.currentRecordIndex = event.first;
    console.log(event);
    this.loadOptimisedAppointment(
      this.appointmentFilter.clinic,
      this.appointmentFilter.provider,
      this.appointmentFilter.service,
      this.appointmentFilter.startDate,
      this.appointmentFilter.endDate
    );
  }

  startMeeting(id: any) {
    this.router.navigate(['appointment', id, 'meeting']);
  }

  viewPayment(id: any) {
    this.router.navigate(['/appointment', id, 'payment']);
  }

  unselectRows() {
    this.selectedRows = [];
  }
}
