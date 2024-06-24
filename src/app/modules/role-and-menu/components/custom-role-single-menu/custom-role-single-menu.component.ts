import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-role-single-menu',
  templateUrl: './custom-role-single-menu.component.html',
  styleUrls: ['./custom-role-single-menu.component.css']
})
export class CustomRoleSingleMenuComponent {
  @Output() deleteMenu = new EventEmitter<any>();
  @Output() updateMenu = new EventEmitter<any>();
  @Output() dropMenu = new EventEmitter<any>();
  @Output() moveUp = new EventEmitter<any>();
  @Output() moveDown = new EventEmitter<any>();
  @Input() menusIds: any = [];
  @Input() menus: any = [];
  @Input() menu: any = null;
  @Input() connectedList: any = [];
  constructor() {}

  drop(event: CdkDragDrop<string[]>) {
    this.dropMenu.emit(event);
  }

  changeMenu(menu: any) {
    this.updateMenu.emit(menu);
  }

  removeMenu(menu: any) {
    this.deleteMenu.emit(menu);
  }

  moveUpMenu($event: any) {
    this.moveUp.emit($event);
  }

  moveDownMenu($event: any) {
    this.moveDown.emit($event);
  }

  // getConnectedList(): any[] {
  //   const ids: any[] = ['menu-1'];
  //   this.menusIds.forEach((x: any) => ids.push(x));
  //   return ids;
  // }

  getConnectedList(): any[] {
    const ids: any[] = ['menu-1', 'group-1', 'headeer-1'];
    this.menusIds.forEach((x: any) => ids.push(x));
    return ids;
  }
  // this is for another lib
  onMenuDrop($event: any, menu: any) {
    menu.items.push($event.dragData);
  }
}
