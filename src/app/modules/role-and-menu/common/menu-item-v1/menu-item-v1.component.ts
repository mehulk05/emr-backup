import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DefaultMenu } from 'src/app/modules/menu/models/menu';

@Component({
  selector: 'app-menu-item-v1',
  templateUrl: './menu-item-v1.component.html',
  styleUrls: ['./menu-item-v1.component.css']
})
export class MenuItemV1Component {
  @Input() menu: any;
  @Input() isLeftPanel: boolean = false;
  @Input() currentMenuList: DefaultMenu[] = [];
  @Input() addedMenus: DefaultMenu[] = [];
  @Output() addToMenu = new EventEmitter<any>();
  @Output() moveDown = new EventEmitter<any>();
  @Output() moveUp = new EventEmitter<any>();
  @Output() deleteMenu = new EventEmitter<any>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMenuDisabled(menu: any): boolean {
    // Implement your logic to determine if the menu should be disabled
    const isMenuInList = (menuList: any[], menuToCheck: any): boolean => {
      return menuList.some((m) => {
        if (m.id === menuToCheck.id) {
          return true;
        }
        if (m.items && m.items.length > 0) {
          return isMenuInList(m.items, menuToCheck);
        }
        return false;
      });
    };

    return isMenuInList(this.addedMenus, menu);
  }

  removeMenu(menu: any) {
    this.deleteMenu.emit({ menu });
  }

  moveUpMenu($event: any) {
    this.moveUp.emit($event);
  }

  moveDownMenu($event: any) {
    this.moveDown.emit($event);
  }
  handleAddToMenu(menu: any) {
    this.addToMenu.emit(menu);
  }
}
