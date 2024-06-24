import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CustomRoleService } from '../../services/custom-role.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-add-role-form',
  templateUrl: './add-role-form.component.html',
  styleUrls: ['./add-role-form.component.css']
})
export class AddRoleFormComponent implements OnInit {
  allRoleList: any[] = [];
  newRoleName: string = '';
  roles: any[] = [];
  showRoleSelection: boolean = false;
  showError: boolean = false;
  showInputField: boolean = false;
  @Output() showMenuSelection = new EventEmitter<any>();

  constructor(
    private customRoleService: CustomRoleService,
    private toastrService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles() {
    this.customRoleService
      .getAllRoles()
      .then((data: any) => {
        this.allRoleList = data;
      })
      .catch(() => {
        this.toastrService.error('Unable to load roles');
      });
  }

  addCustomRole() {
    if (
      this.newRoleName &&
      !this.allRoleList.some((role) => role.name === this.newRoleName)
    ) {
      const newRole = { name: this.newRoleName, menuType: 'Custom' };
      this.allRoleList.push(newRole);
      this.showMenuSelection.emit({
        showRoleSelection: true,
        name: this.newRoleName
      });
      this.newRoleName = '';
      this.showInputField = false;
      this.showError = false;
    } else {
      this.showError = true; // Show error if role name is empty or already exists
      this.showMenuSelection.emit({
        showRoleSelection: false,
        name: this.newRoleName
      });
    }
  }

  cancelCustomRole() {
    this.showError = false;
    this.showInputField = false;
    this.newRoleName = '';
    this.showRoleSelection = false;
  }
}
