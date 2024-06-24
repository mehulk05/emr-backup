import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserList } from 'src/app/shared/models/user/user';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'id',
    'firstName',
    'lastName',
    'email',
    'createdBy',
    'createdAt',
    'updatedAt',
    'updatedBy'
  ];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'First Name', field: 'firstName' },
    { header: 'Last Name', field: 'lastName' },
    { header: 'Email', field: 'email' },

    { header: 'Created Date', field: 'createdAt' },
    { header: 'Created By', field: 'createdBy' },

    { header: 'Updated Date', field: 'updatedAt' },
    { header: 'Updated By', field: 'updatedBy' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: UserList[] = [];
  userId: any;
  isDtInitialized: boolean = false;
  tableHtml: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService
  ) {}

  ngOnInit(): void {
    this.loadAllUsers();
  }

  loadAllUsers() {
    this.userService
      .getAllUsers()
      .then((data: any) => {
        this.rowData = data;
        this.formatTimeInData();
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load Patients');
      });
  }

  formatPhoneNumber(event: any) {
    const inputValue = event.target.value;
    const phoneNumber = inputValue.replace(/\D/g, '');
    const formattedPhoneNumber = phoneNumber.replace(
      /(\d{3})(\d{3})(\d{4})/,
      '($1) $2-$3'
    );
    event.target.value = formattedPhoneNumber;
  }

  formatTimeInData() {
    this.rowData.map((data, i) => {
      this.rowData[i].createdAt = this.formatTimeService.formatTime(
        data.createdAt
      );
      this.rowData[i].updatedAt = this.formatTimeService.formatTime(
        data.updatedAt
      );
    });
  }

  editUser(id: Number) {
    this.router.navigate(['/users/' + id + '/edit']);
  }

  deleteUserModal(data: any) {
    this.modalData = { name: data.firstName + data.lastName, id: data.id };
    this.modalData.feildName = data.firstName + ' ' + data.lastName;
    this.modalData.titleName = 'User';
    this.showModal = true;
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteUser(this.modalData.id);
    }
  }

  deleteUser(id: any) {
    this.userService.deleteUser(id).then(
      () => {
        this.rowData = [];
        this.toastMessageService.success('User is deleted successfully');
        this.loadAllUsers();
      },
      () => {
        this.toastMessageService.error('Unable to delete a User');
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
}
