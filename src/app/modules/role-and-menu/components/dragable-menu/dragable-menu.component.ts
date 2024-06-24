import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { reduce } from 'lodash';
import { DefaultMenu } from 'src/app/modules/menu/models/menu';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-dragable-menu',
  templateUrl: './dragable-menu.component.html',
  styleUrls: ['./dragable-menu.component.css']
})
export class DragableMenuComponent implements OnInit {
  defaultMenus: any;
  groupMenuList: any = [];
  headerMenuList: any = [];
  menuList: any = [];
  addedMenus: any = [];

  constructor(private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.getMenuList();
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
  }

  // addToMenu(defaultMenu: DefaultMenu) {
  //   this.menus.push(defaultMenu);
  //   this.menus = this.menus.filter(
  //     (menu: DefaultMenu) => menu.groupMenu == null
  //   );
  // }

  addToMenu(menu: DefaultMenu) {
    if (menu.menuType === 'Menu') {
      this.addedMenus.push(menu);
    } else if (menu.menuType === 'Group') {
      this.addGroupMenu(menu);
    }
  }

  addGroupMenu(groupMenu: DefaultMenu) {
    const groupMenuWithItems = {
      ...groupMenu,
      items: [] as DefaultMenu[]
    };

    // Add all child items of the group menu
    if (groupMenu.items && groupMenu.items.length > 0) {
      groupMenu.items.forEach((item) => {
        groupMenuWithItems.items.push(item);
      });
    }

    this.addedMenus.push(groupMenuWithItems);
    console.log(this.addedMenus);
  }
  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.addedMenus, event.previousIndex, event.currentIndex);
  // }

  drop(event: CdkDragDrop<any[]>) {
    console.log(event);
    const targetContainer = event.container.data;
    const sourceContainer = event.previousContainer.data;

    // if (
    //   draggedItem.menuType === 'Group' &&
    //   targetContainer !== this.addedMenus
    // ) {
    //   // Prevent moving group menus into other containers
    //   return;
    // }

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

  // getConnectedDropLists(): string[] {
  //   const groupDropListIds = this.addedMenus.map(
  //     (menu: DefaultMenu, i: number) =>
  //       menu.menuType === 'Group' ? `cdkDropList-group-${i}` : ''
  //   );
  //   return [
  //     'cdkDropList-standalone',
  //     ...groupDropListIds.filter((id: number) => id)
  //   ];
  // }
  getConnectedDropLists(): string[] {
    const groupDropLists = this.addedMenus
      .filter((menu: DefaultMenu) => menu.menuType === 'Group')
      .map((data: any) => `cdkDropList-group-${data.id}`);
    return ['cdkDropList-standalone', ...groupDropLists];
  }

  getGroupDropListId(data: DefaultMenu): string {
    return `cdkDropList-group-${data.id}`;
  }
}
