import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { reduce, some } from 'lodash';
import { DefaultMenu } from 'src/app/modules/menu/models/menu';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { CustomRoleService } from '../../services/custom-role.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cutom-role-container-v1',
  templateUrl: './cutom-role-container-v1.component.html',
  styleUrls: ['./cutom-role-container-v1.component.css']
})
export class CutomRoleContainerV1Component implements OnInit {
  roleName: string = '';
  defaultMenus: any = [];
  showRoleSelection: boolean = false;
  groupMenuList: any = [];
  headerMenuList: any = [];
  menuList: any = [];
  addedMenus: any = [];
  constructor(
    private localStorageService: LocalStorageService,
    private customRoleService: CustomRoleService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getMenuList();
  }

  showMenuSelection($event: any) {
    console.log($event);
    this.showRoleSelection = $event.showRoleSelection;
    this.roleName = $event.name;
  }
  getMenuList() {
    this.defaultMenus = this.localStorageService.readStorage('sidebarData');
    console.log(this.defaultMenus);
    // Partition menus and groupMenus using lodash
    const categorizedMenus = reduce(
      this.defaultMenus,
      (result: any, menu) => {
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
  }

  addToMenu(menu: DefaultMenu) {
    if (menu.menuType === 'Menu') {
      if (!this.isMenuPresent(menu)) {
        this.addedMenus.push(menu);
      }
    } else if (menu.menuType === 'Group') {
      this.addGroupMenu(menu);
    }
  }

  addGroupMenu(groupMenu: DefaultMenu) {
    // Check if any of the group's items are already in the addedMenus
    const groupMenuWithItems: DefaultMenu = {
      ...groupMenu,
      items: groupMenu.items.filter((item) => !this.isMenuPresent(item))
    };

    if (!this.isMenuPresent(groupMenu)) {
      this.addedMenus.push(groupMenuWithItems);
    }

    console.log(this.addedMenus);
  }

  isMenuPresent(menu: DefaultMenu): boolean {
    // Check if the menu is directly present in addedMenus
    if (some(this.addedMenus, { id: menu.id })) {
      return true;
    }

    // Check if the menu is present in any group's items array
    return some(this.addedMenus, (addedMenu: DefaultMenu) =>
      some(addedMenu.items, { id: menu.id })
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
    const targetContainer = event.container.data;
    const sourceContainer = event.previousContainer.data;

    if (event.previousContainer === event.container) {
      // Move within the same container
      moveItemInArray(targetContainer, event.previousIndex, event.currentIndex);
    } else {
      // Transfer item between different containers
      transferArrayItem(
        sourceContainer,
        targetContainer,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getConnectedDropLists(): string[] {
    console.log(this.addedMenus);
    const groupDropLists = this.addedMenus
      .filter((menu: DefaultMenu) => menu.menuType === 'Group')
      .map((data: any) => `cdkDropList-group-${data.id}`);
    return ['cdkDropList-standalone', ...groupDropLists];
  }

  getGroupDropListId(data: DefaultMenu): string {
    return `cdkDropList-group-${data.id}`;
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
    console.log(menus);
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

  deleteMenu($event: any) {
    const menuToDelete = $event.menu;
    console.log(menuToDelete);
    const deleteRecursively = (
      menus: DefaultMenu[],
      id: number
    ): DefaultMenu[] => {
      return menus.filter((menu) => {
        if (menu.id === id) {
          // Found the menu to delete
          return false;
        }

        // If it's a group menu, we need to check its items recursively
        if (menu.items && menu.items.length > 0) {
          menu.items = deleteRecursively(menu.items, id);
        }

        return true;
      });
    };

    this.addedMenus = deleteRecursively(this.addedMenus, menuToDelete.id);
  }

  saveRoleAndMenuConfig() {
    console.log('here', this.addedMenus, this.roleName);
    const payload = {
      name: this.roleName,
      selectedMenus: this.addedMenus
    };
    this.customRoleService
      .createRole(payload)
      .then(() => {
        this.router.navigate(['role-manager']);
      })
      .catch(() => {
        this.toastrService.error('Unable to load roles');
      });
  }
}
