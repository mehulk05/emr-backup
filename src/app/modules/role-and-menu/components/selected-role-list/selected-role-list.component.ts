import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-selected-role-list',
  templateUrl: './selected-role-list.component.html',
  styleUrls: ['./selected-role-list.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class SelectedRoleListComponent {
  @Input() selectedMenus: any[];
  @Input() menus: any[];
  @Output() menuDeleted = new EventEmitter<any>(); // Emit event when a menu is deleted
  @Output() moveUp = new EventEmitter<any>(); // Emit event when moving menu up
  @Output() moveDown = new EventEmitter<any>(); // Emit event when moving menu down
  @Output() menuMoved = new EventEmitter<any>();
  constructor() {}

  onDragStarted(event: any) {
    const draggedElement = event;
    console.log('Dragged element HTML:', draggedElement);
  }

  deleteMenu(index: number) {
    this.menuDeleted.emit(index);
  }

  moveMenuUp(index: number) {
    this.moveUp.emit(index);
  }

  moveMenuDown(index: number) {
    this.moveDown.emit(index);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.selectedMenus,
      event.previousIndex,
      event.currentIndex
    );
    this.menuMoved.emit(this.selectedMenus);
  }
}
