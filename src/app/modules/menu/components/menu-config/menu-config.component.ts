import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { DefaultMenu, IRole } from '../../models/menu';
import { MenuConfigService } from '../../services/menu-config.service';
import { RoleServiceService } from '../../services/role-service.service';

@Component({
  selector: 'app-menu-config',
  templateUrl: './menu-config.component.html',
  styleUrls: ['./menu-config.component.css']
})
export class MenuConfigComponent implements OnInit {
  showModal: boolean = false;
  loggedInUser: any = null;
  selectedRoleId = '';
  roles: IRole[] = [];
  id = 0;
  defaultMenus: DefaultMenu[] = [];
  allMenus: any = [];
  menus: any = [];
  menusIds: any[] = [];
  menuFor = 'Role';
  businessId = '';
  modalData: any;

  constructor(
    public formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private alertService: ToasTMessageService,
    private menuService: MenuConfigService,
    private roleService: RoleServiceService
  ) {}

  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe((user) => {
      this.loggedInUser = user;
      this.businessId = user.businessId;
    });

    this.loadRoles();
    this.loadDefaultMenus();
  }

  loadRoles() {
    this.roleService.getRoles().then(
      (response: any) => {
        this.roles = response;
        this.roles.push({
          id: 0,
          name: 'My Order',
          createdAt: '',
          updatedAt: '',
          createdBy: undefined,
          updatedBy: undefined,
          deleted: false,
          tenantId: 0,
          permissions: [],
          defaultRole: undefined
        });
      },
      () => {
        this.alertService.error('Unable to load roles.');
      }
    );
  }

  loadDefaultMenus() {
    this.menuService.getDefaultMenus().then(
      (response: any) => {
        this.defaultMenus = response;
      },
      () => {
        this.alertService.error('Unable to load default menus.');
      }
    );
  }

  defaultMenuConfiguration() {
    console.log('Entered in defualt menu configuration ');
    this.menuService
      .getdefaultMenuConfiguration(
        this.menuFor,
        this.loggedInUser.id,
        this.selectedRoleId,
        this.businessId
      )
      .then(
        (response) => {
          this.handleLoadMenus(response);
          this.updateMenuOrder();
        },
        () => {
          this.alertService.error('Unable to get default configuration.');
        }
      );
  }

  // handleLoadMenus(response: any) {
  //   this.allMenus = [];
  //   this.menus = [];

  //   this.allMenus = [...response];
  //   this.menus = [...response];
  //   this.menus.sort((a: any, b: any) => {
  //     return a.position - b.position;
  //   });

  //   this.menusIds = [];
  //   for (let i = 0; i < this.menus.length; i++) {
  //     if (this.menus[i].menuType == 'Group') {
  //       this.menusIds.push('menu' + this.menus[i].id);
  //       this.menus[i].items.sort((a: any, b: any) => {
  //         return a.position - b.position;
  //       });
  //     }
  //   }
  //   console.log(this.menus);
  //   // this.menus = this.menus.filter((menu: any) => menu.groupMenu == null);
  //   // console.log(this.menus);
  // }

  handleLoadMenus(response: any) {
    this.allMenus = [...response];
    this.menus = [...response];
    this.menus.sort((a: any, b: any) => a.position - b.position);
    this.menusIds = [];
    const groupMenus: any[] = [];
    for (let i = 0; i < this.menus.length; i++) {
      if (this.menus[i].menuType == 'Group') {
        this.menusIds.push('menu' + this.menus[i].id);
        this.menus[i].items.sort((a: any, b: any) => a.position - b.position);
        groupMenus.push(this.menus[i]);
      } else {
        if (this.menus[i].groupMenu) {
          const groupMenu = groupMenus.find(
            (menu: any) => menu.id === this.menus[i].groupMenu
          );
          if (groupMenu) {
            groupMenu.items.push(this.menus[i]);
            this.menus.splice(i, 1);
            i--;
          }
        }
      }
    }
    console.log(this.menus);
    this.menus = this.menus.filter((menu: any) => menu.groupMenu == null);
  }

  updateMenuOrder() {
    //console.log(this.menus);
    const menuList = this.processMenus();
    const menuOrders = [];
    for (let i = 0; i < menuList.length; i++) {
      menuOrders.push({
        menuId: menuList[i].id,
        groupMenuId: menuList[i].groupMenuId,
        position: i
      });
    }

    const menuOrderRequest = {
      menuOrders: menuOrders,
      menuFor: this.menuFor,
      roleId: this.selectedRoleId,
      userId: this.loggedInUser.id
    };
    this.menuService.orderMenu(menuOrderRequest).then(() => {
      this.loadMenus();
      // this.sidebarService.sidebarChangedNotify();
    }),
      () => {
        this.alertService.error('Unable to order the menus.');
      };
  }

  loadMenus() {
    this.menuService
      .getMenusForUserOrRole(
        this.menuFor,
        this.loggedInUser.id,
        this.selectedRoleId
      )
      .then(
        (response) => {
          this.handleLoadMenus(response);
        },
        () => {
          this.alertService.error('Unable to load menus.');
        }
      );
  }

  private processMenus() {
    const toReturn = this.menus.map((item: any) => item);
    this.menus.forEach((menu: any) => {
      if (menu.items?.length > 0) {
        const index = toReturn.indexOf(menu) + 1;
        for (let j = 0; j < menu.items.length; j++) {
          const subMenu = menu.items[j];
          subMenu.groupMenuId = menu.id;
          toReturn.splice(index + j, 0, menu.items[j]);
        }
      }
    });
    return toReturn;
  }

  onChangeRole(roleId: any) {
    this.selectedRoleId = roleId;
    if (roleId != '') {
      if (this.selectedRoleId == '0') {
        this.menuFor = 'User';
      } else {
        this.menuFor = 'Role';
      }
      this.loadMenus();
    } else {
      this.menus = [];
    }
  }

  isMenuDisabled(defaultMenu: any) {
    let disabled = false;
    for (let i = 0; i < this.allMenus.length; i++) {
      if (this.allMenus[i].referenceDefaultMenuId == defaultMenu.id) {
        disabled = true;
        break;
      }
    }

    return disabled;
  }

  addToMenu(defaultMenu: any) {
    const menu = {
      name: defaultMenu.name,
      displayName: defaultMenu.displayName,
      icon: defaultMenu.icon,
      routerLink: defaultMenu.routerLink,

      menuType: 'Menu',
      menuFor: this.menuFor,
      userId: this.loggedInUser.id,
      roleId: this.selectedRoleId,
      position: this.allMenus.length + 2,
      referenceDefaultMenuId: defaultMenu.id
    };

    this.menuService.createMenu(menu).then(
      () => {
        this.loadMenus();
      },
      () => {
        this.alertService.error('Unable to add menu.');
      }
    );
  }

  createGroupMenu() {
    this.showModal = true;
    const data = {
      menuType: 'Group',
      operation: 'ADD',
      groupMenu: { id: '' },
      menuFor: this.menuFor,
      userId: this.loggedInUser.id,
      roleId: this.selectedRoleId,
      position: this.allMenus.length + 2
    };
    this.modalData = data;
  }

  createMenu() {
    console.log('j');
    const data = {
      menuType: 'Menu',
      operation: 'ADD',
      groupMenu: { id: '' },
      menuFor: this.menuFor,
      userId: this.loggedInUser.id,
      roleId: this.selectedRoleId,
      position: this.allMenus.length + 2
    };
    this.modalData = data;
    this.showModal = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onModalClosed(e: any) {
    this.showModal = false;

    if (e.isUpdate) {
      this.loadMenus();
    }
  }

  updateMenu(menu: any) {
    this.showModal = true;
    this.modalData = menu;
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

    this.updateMenuOrder();
  }

  removeMenu(menu: any) {
    this.menuService.delete(menu.id).then(
      () => {
        this.loadMenus();
      },
      (e: any) => {
        console.log(e);
      }
    );
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
      this.updateMenuOrder();
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
      this.updateMenuOrder();
    }
  }
}
