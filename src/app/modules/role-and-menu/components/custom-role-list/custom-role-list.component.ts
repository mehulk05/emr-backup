import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { CustomRoleService } from '../../services/custom-role.service';

@Component({
  selector: 'app-custom-role-list',
  templateUrl: './custom-role-list.component.html',
  styleUrls: ['./custom-role-list.component.css']
})
export class CustomRoleListComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 50;
  globalFilterColumn = ['id', 'name'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Created At', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  newRoleName: string = '';
  showError: boolean = false;
  showInputField: boolean = false;

  constructor(
    private customRoleService: CustomRoleService,
    private toastService: ToasTMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.customRoleService
      .getAllRoles()
      .then((data: any) => {
        this.rowData = data.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
      })
      .catch(() => {
        this.toastService.error('Unable to load roles');
      });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.fieldName = data.name;
    this.modalData.titleName = 'Role';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    console.log(id);
    // this.customRoleService
    //   .deleteRoleById(id)
    //   .then(() => {
    //     this.loadRoles();
    //     this.toastService.success('Role deleted successfully');
    //   })
    //   .catch(() => {
    //     this.toastService.error('Unable to delete the role');
    //   });
  }

  editTemplate(id: any) {
    this.router.navigate(['/role', 'edit', id]);
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
