import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-appointment',
  templateUrl: './user-appointment.component.html',
  styleUrls: ['./user-appointment.component.css']
})
export class UserAppointmentComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'patientFirstname',
    'patientLastName',
    'clinicName',
    'providerName',
    'serviceList[0].serviceName',
    'appointmentType',
    'paymentStatus',
    'appointmentStatus',
    'appointmentDate',
    'createdAt'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Patient', field: 'patientFirstname' },
    { header: 'Clinic', field: 'clinicName' },
    { header: 'Provider', field: 'providerName' },
    // { header: 'Services', field: 'serviceList' },
    { header: 'Type', field: 'appointmentType' },
    { header: 'Appointment Date', field: 'appointmentDate' },
    { header: 'Payment Status', field: 'paymentStatus' },
    { header: 'Appointment Status', field: 'appointmentConfirmationStatus' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: AppointmentDto[] = [];
  userId!: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    const currentUser  = JSON.parse(localStorage.getItem('currentUser') || '{}');;
    console.log('Current User', currentUser);
    this.userId = this.activatedRoute.snapshot.params.userId ?? currentUser.id;
    this.loadAppointment();
  }
  loadAppointment() {
    this.userService
      .getProvidersAppointmentOptimized(this.userId)
      .then((data: any) => {
        this.rowData = data;
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load appointments');
      });
  }

  editAppointment(id: Number) {
    this.router.navigate(['/appointment/booking-history/' + id + '/edit']);
  }

  deleteAppointmentModal(data: any) {
    console.log('data', data.patientFirstname);
    this.modalData = {
      name: data.patientFirstname + ' ' + data.patientLastName,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName =
      data.patientFirstname + ' ' + data.patientLastName;
    this.modalData.titleName = 'Appointment';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteAppointment(this.modalData.id);
    }
  }

  deleteAppointment(id: any) {
    this.userService.deleteAppointment(id).then(
      () => {
        this.toastMessageService.success('Appointment delete successfully');
        this.rowData = [];
        this.loadAppointment();
      },
      () => {
        //this.toastMessageService.error('Unable to delete a appointment');
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
}
