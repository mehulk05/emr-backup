import { Component, Input, Output, EventEmitter } from '@angular/core';

interface UserData {
  name: string;
  email: string;
  id: any;
}
@Component({
  selector: 'app-notes-userlist-popup',
  templateUrl: './notes-userlist-popup.component.html',
  styleUrls: ['./notes-userlist-popup.component.css']
})
export class NotesUserlistPopupComponent {
  @Input() filteredList: UserData[] = [];
  @Output() userSelected: EventEmitter<UserData> = new EventEmitter<UserData>();

  selectUser(user: UserData) {
    this.userSelected.emit(user);
  }
}
