import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs';
// import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
// import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
// import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-booking-history',
  templateUrl: './booking-history.component.html',
  styleUrls: ['./booking-history.component.css']
})
export class BookingHistoryComponent implements OnInit {
  // @ViewChild(DataTableDirective) dtElement!: DataTableDirective;
  // dtOptions: DataTables.Settings = {
  //   columns: [
  //     { data: 'Id' },
  //     { data: 'Patient' },
  //     { data: 'Clinic' },
  //     { data: 'Provider' },
  //     { data: 'Services' },
  //     { data: 'Type' },
  //     { data: 'Appointment Date' },
  //     { data: 'Payment Status' },
  //     { data: 'Appointment Status' },
  //     { data: 'Created Date' },
  //     { data: 'Actions' }
  //   ]
  // };
  // dtTrigger: Subject<any> = new Subject();
  // rowData: any[] = [];
  // columns = [
  //   { value: 'Id', isChecked: true },
  //   { value: 'Patient', isChecked: true },
  //   { value: 'Clinic', isChecked: true },
  //   { value: 'Provider', isChecked: true },
  //   { value: 'Services', isChecked: true },
  //   { value: 'Type', isChecked: true },
  //   { value: 'Appointment Date', isChecked: true },
  //   { value: 'Payment Status', isChecked: true },
  //   { value: 'Appointment Status', isChecked: true },
  //   { value: 'Created Date', isChecked: true },
  //   { value: 'Actions', isChecked: true }
  // ];
  // userId: any;
  // isDtInitialized: boolean = false;
  // tableHtml: any;

  // constructor(
  //   private appointmentService: AppointmentService,
  //   private router: Router,
  //   private toastMessageService: ToasTMessageService,
  //   public formatTimeService: FormatTimeService
  // ) {}

  ngOnInit(): void {
    // this.loadAppointment();
    console.log('here');
  }

  // loadAppointment() {
  //   this.appointmentService
  //     .getAppointments()
  //     .then((data: any) => {
  //       this.rowData = data.appointmentDTOList;
  //       this.setViewOfData();
  //     })
  //     .catch(() => {
  //       this.toastMessageService.error('Unable to load appointments');
  //     });
  // }

  // showColumns(c: { isChecked: any; value: any }) {
  //   if (c.isChecked) {
  //     this.onColSelect(c.value);
  //   } else {
  //     this.onColDeSelect(c.value);
  //   }
  // }

  // onColDeSelect(colDeselected: any) {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     for (var i = 0; i < this.columns.length; i++) {
  //       if (this.columns[i].value == colDeselected) {
  //         dtInstance.column(i).visible(false, false);
  //         break;
  //       }
  //     }
  //     dtInstance.columns.adjust().draw(false);
  //   });
  // }

  // onColSelect = (colSelected: any) => {
  //   this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
  //     console.log(dtInstance);
  //     for (var i = 0; i < this.columns.length; i++) {
  //       if (this.columns[i].value == colSelected) {
  //         dtInstance.column(i).visible(true, false);
  //         break;
  //       }
  //     }
  //     dtInstance.columns.adjust().draw(false);
  //   });
  // };

  // editAppointment(id: Number) {
  //   this.router.navigate(['/appointment/' + id + '/edit/' + this.userId]);
  // }

  // deleteAppointmentModal(data: any) {
  //   this.appointmentService.deleteAppointment(data.id).then(
  //     () => {
  //       this.rowData = [];
  //       this.loadAppointment();
  //     },
  //     () => {
  //       this.toastMessageService.error('Unable to delete a appointment');
  //     }
  //   );
  // }

  // ngAfterViewInit(): void {
  //   this.tableHtml = $('.table-header').remove();
  // }

  // setViewOfData() {
  //   setTimeout(() => {
  //     console.log($('#datatable_wrapper .row').length);
  //     $('.dataTables_wrapper .row:nth-child(1) .col-sm-12:nth-child(2)').append(
  //       this.tableHtml
  //     );
  //   }, 100);
  // }
}
