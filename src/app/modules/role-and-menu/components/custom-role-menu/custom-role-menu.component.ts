import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { reduce } from 'lodash';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { DefaultMenu } from 'src/app/modules/menu/models/menu';
import { MenuConfigService } from 'src/app/modules/menu/services/menu-config.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { CustomRoleService } from '../../services/custom-role.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-custom-role-menu',
  templateUrl: './custom-role-menu.component.html',
  styleUrls: ['./custom-role-menu.component.css']
})
export class CustomRoleMenuComponent implements OnInit {
  roles: string[] = ['Role 1', 'Role 2', 'Role 3'];
  newRoleName: string = '';
  showError: boolean = false;
  showInputField: boolean = false;

  defaultMenus: DefaultMenu[] = [];
  selectedRoleId = '2319';
  businessId = '';
  loggedInUser: any = null;

  menus: any = [];
  menusIds: any[] = [];

  menuList: DefaultMenu[] = [];
  groupMenuList: DefaultMenu[] = [];
  showRoleSelection: boolean;
  headerMenuList: any[];

  constructor(
    private menuService: MenuConfigService,
    private alertService: ToasTMessageService,
    private customRoleService: CustomRoleService,
    private authenticationService: AuthService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((user) => {
      this.loggedInUser = user;
      console.log(this.loggedInUser);
      this.getMenuList();
      this.businessId = user.businessId;
    });

    // this.getMenuList();
  }

  getMenuList() {
    this.defaultMenus = this.localStorageService.readStorage('sidebarData');
    console.log(this.defaultMenus);
    // Partition menus and groupMenus using lodash
    const categorizedMenus = reduce(
      this.defaultMenus,
      (result, menu) => {
        if (menu.menuType === 'Group') {
          result.groupMenuList.push(menu);
        } else if (menu.menuType === 'Header') {
          result.headerMenuList.push(menu);
        } else {
          result.menuList.push(menu);
        }
        return result;
      },
      { groupMenuList: [], headerMenuList: [], menuList: [] }
    );

    this.groupMenuList = categorizedMenus.groupMenuList;
    this.headerMenuList = categorizedMenus.headerMenuList;
    this.menuList = categorizedMenus.menuList;
    console.log(this.menusIds);
  }

  isMenuDisabled(defaultMenu: any) {
    let disabled = false;
    for (let i = 0; i < this.defaultMenus.length; i++) {
      if (this.defaultMenus[i].referenceDefaultMenuId == defaultMenu.id) {
        disabled = true;
        break;
      }
    }

    return disabled;
  }

  addToMenu(defaultMenu: DefaultMenu) {
    this.menus.push(defaultMenu);
    this.menus = this.menus.filter(
      (menu: DefaultMenu) => menu.groupMenu == null
    );

    console.log(this.menus);

    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].menuType == 'Group') {
        this.menusIds.push('menu' + this.menus[i].id);
        this.menus[i].items.sort((a: DefaultMenu, b: DefaultMenu) => {
          return a.position - b.position;
        });
      }

      if (this.menus[i].menuType == 'Header') {
        this.menusIds.push('group' + this.menus[i].id);
        this.menus[i].items.sort((a: DefaultMenu, b: DefaultMenu) => {
          return a.position - b.position;
        });
      }
    }

    // for (let i = 0; i < this.menus.length; i++) {
    //   if (this.menus[i].menuType == 'Header') {
    //     this.menusIds.push('header' + this.menus[i].id);
    //     this.menus[i].items.sort((a: DefaultMenu, b: DefaultMenu) => {
    //       return a.position - b.position;
    //     });
    //   } else if (this.menus[i].menuType == 'Group') {
    //     this.menusIds.push('group' + this.menus[i].id);
    //     this.menus[i].items.sort((a: DefaultMenu, b: DefaultMenu) => {
    //       return a.position - b.position;
    //     });
    //   } else {
    //     this.menusIds.push('menu' + this.menus[i].id);
    //     this.menus[i].items.sort((a: DefaultMenu, b: DefaultMenu) => {
    //       return a.position - b.position;
    //     });
    //   }
    // }
  }

  dropMenu(event: any) {
    console.log(
      'Drop Menu =>',
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // this.updateMenuOrder();
  }

  removeMenu(menu: any) {
    console.log(this.menus, menu);
    const index = this.menus.findIndex((item: any) => item.id === menu.id);
    if (index > -1) {
      this.menus.splice(index, 1);
      this.getMenuList();
    }
    // this.menuService.delete(menu.id).then(
    //   () => {
    //     this.getMenuList();
    //   },
    //   (e: any) => {
    //     console.log(e);
    //   }
    // );
  }

  moveUp($event: any) {
    const menu = $event.menu;
    const menus = $event.menus;
    let currentIndex = 0;
    for (let i = 0; i < menus.length; i++) {
      if (menu.id == menus[i].id) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex == 0) {
      // nothing to do
    } else {
      moveItemInArray(menus, currentIndex, currentIndex - 1);
      // this.updateMenuOrder();
    }
  }

  moveDown($event: any) {
    const menu = $event.menu;
    const menus = $event.menus;
    let currentIndex = 0;
    for (let i = 0; i < menus.length; i++) {
      if (menu.id == menus[i].id) {
        currentIndex = i;
        break;
      }
    }

    if (currentIndex == menus.length - 1) {
      // nothing to do
    } else {
      moveItemInArray(menus, currentIndex, currentIndex + 1);
      // this.updateMenuOrder();
    }
  }

  submitRoles() {
    console.log('menu', this.menus);
  }

  addCustomRole() {
    if (this.newRoleName && !this.roles.includes(this.newRoleName)) {
      // this.roles.push(this.newRoleName);
      // this.newRoleName = ''; // Clear input field
      // this.showInputField = false; // Hide input field after adding role
      // this.showError = false; // Reset error state
      this.showRoleSelection = true;
    } else {
      this.showError = true; // Show error if role name is empty or already exists
    }
  }

  cancelCustomRole() {
    this.showError = false;
    this.showInputField = false;
    this.newRoleName = '';
    this.showRoleSelection = false;
  }
}
