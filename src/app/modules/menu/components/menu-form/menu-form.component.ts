import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { Icons } from '../../models/icons';
import { MenuConfigService } from '../../services/menu-config.service';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css']
})
export class MenuFormComponent implements OnInit {
  @Input() showModal: boolean = false;
  data: any;
  menuId: any;
  groupMenus: any;
  @Input() set modalData(value: any) {
    this.data = value;
  }
  @Output() modalClosed = new EventEmitter<any>();
  menuForm: FormGroup;
  iconsArray = Icons;
  constructor(
    public formBuilder: FormBuilder,
    private menuService: MenuConfigService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.menuForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      icon: ['', []],
      routerLink: ['', []],
      groupMenuId: ['', []],

      menuType: ['Menu', []],
      menuFor: ['Role', []],
      userId: ['', []],
      roleId: ['', []],
      referenceDefaultMenuId: ['', []]
    });

    if (this.data && this.data?.menuFor) {
      this.getGroupMenuForUserRole();
    } else {
      this.loadGroupMenus();
    }
    if (this.data) {
      this.patchFormValues();
    }
  }

  patchFormValues() {
    this.menuId = this.data.id;
    this.menuForm.patchValue({
      name: this.data.name,
      displayName: this.data.displayName,
      icon: this.data.icon,
      routerLink: this.data.routerLink,
      groupMenuId:
        this.data.groupMenu && this.data.groupMenu != null
          ? this.data.groupMenu.id
          : '',

      menuType: this.data.menuType,
      menuFor: this.data.menuFor,
      userId: this.data.userId,
      roleId: this.data.roleId,
      referenceDefaultMenuId: this.data.referenceDefaultMenuId,
      position: this.data.position
    });
  }

  loadGroupMenus() {
    this.menuService.getMenus().then(
      (response: any) => {
        this.groupMenus = response;
      },
      () => {
        this.alertService.error('Unable to load menus.');
      }
    );
  }

  getGroupMenuForUserRole() {
    this.menuService
      .getGroupMenusForUserOrRole(
        this.data.menuFor,
        this.data.userId,
        this.data.roleId
      )
      .then((response) => {
        this.groupMenus = response;
      });
  }

  hideModal(flag?: boolean) {
    this.modalClosed.emit({ close: true, isUpdate: flag });
    this.showModal = false;
  }

  submitForm() {
    console.log(this.menuForm.value);

    if (this.menuForm.invalid) {
      return;
    }

    const formData = this.menuForm.value;
    if (this.menuId) {
      this.menuService.updateMenu(this.menuId, formData).then(
        () => {
          this.alertService.success('Menu updated successfully.');
          // this.sidebarService.sidebarChangedNotify();
          this.hideModal(true);
          // this.dialogRef.close({ menu : response, operation : 'Updated' });
        },
        () => {
          this.alertService.error('Unable to update menu.');
        }
      );
    } else {
      this.menuService.createMenu(formData).then(
        () => {
          this.alertService.success('Menu created successfully.');
          // this.sidebarService.sidebarChangedNotify();
          this.hideModal(true);
          // this.dialogRef.close({ menu : response, operation : 'Added' });
        },
        () => {
          this.alertService.error('Unable to create menu.');
        }
      );
    }
  }

  get f() {
    return this.menuForm.controls;
  }
}
