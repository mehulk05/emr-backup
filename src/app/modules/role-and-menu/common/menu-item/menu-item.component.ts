import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent {
  @Input() menu: any;
  @Output() addToMenu = new EventEmitter<any>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isMenuDisabled(menu: any): boolean {
    // Implement your logic to determine if the menu should be disabled
    return false; // Replace with actual logic
  }

  handleAddToMenu(menu: any) {
    this.addToMenu.emit(menu);
  }
}
