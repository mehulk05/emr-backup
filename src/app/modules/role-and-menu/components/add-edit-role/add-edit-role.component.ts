import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit-role',
  templateUrl: './add-edit-role.component.html',
  styleUrls: ['./add-edit-role.component.css']
})
export class AddEditRoleComponent implements OnInit {
  menus = [
    { id: 1, name: 'Menu 1', selected: false, position: 0 },
    { id: 2, name: 'Menu 2', selected: false, position: 0 },
    { id: 3, name: 'Menu 3', selected: false, position: 0 }
    // Add more menus as needed
  ];
  selectedMenus: any = [];
  constructor() {}

  ngOnInit(): void {
    console.log('get role');
  }
  addSelectedMenu(menu: any) {
    if (menu.selected) {
      menu.position = this.selectedMenus.length; // Set position when added
      this.selectedMenus.push(menu);
    } else {
      const index = this.selectedMenus.findIndex(
        (selectedMenu: any) => selectedMenu.id === menu.id
      );
      if (index !== -1) {
        this.selectedMenus.splice(index, 1);
      }
    }
  }

  moveUp(index: any) {
    if (index > 0) {
      const temp = this.selectedMenus[index];
      this.selectedMenus[index] = this.selectedMenus[index - 1];
      this.selectedMenus[index - 1] = temp;

      // Update positions
      this.selectedMenus[index].position = index;
      this.selectedMenus[index - 1].position = index - 1;
    }
  }

  moveDown(index: any) {
    if (index < this.selectedMenus.length - 1) {
      const temp = this.selectedMenus[index];
      this.selectedMenus[index] = this.selectedMenus[index + 1];
      this.selectedMenus[index + 1] = temp;

      // Update positions
      this.selectedMenus[index].position = index;
      this.selectedMenus[index + 1].position = index + 1;
    }
  }

  deleteMenu(index: number) {
    const menu = this.selectedMenus[index];
    menu.selected = false;

    // Update positions of menus after the deleted one
    for (let i = index + 1; i < this.selectedMenus.length; i++) {
      this.selectedMenus[i].position--;
    }

    const menuIndex = this.menus.findIndex((m: any) => m.id === menu.id);
    if (menuIndex !== -1) {
      this.menus[menuIndex].selected = false;
    }
    this.selectedMenus.splice(index, 1);
  }

  onMenuMoved(event: any) {
    this.selectedMenus = event;
    // Update positions
    this.selectedMenus.forEach((menu: any, index: number) => {
      menu.position = index;
    });
  }

  onSubmit() {
    console.log('here', this.selectedMenus);
  }
}
