import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-all-role-list',
  templateUrl: './all-role-list.component.html',
  styleUrls: ['./all-role-list.component.css']
})
export class AllRoleListComponent implements OnInit {
  @Input() menus: any[];
  @Output() menuSelected = new EventEmitter<any>();

  selectMenu(menu: any) {
    menu.selected = !menu.selected;
    this.menuSelected.emit(menu);
    console.log(menu);
  }
  constructor() {}

  ngOnInit(): void {
    console.log('h');
  }
}
