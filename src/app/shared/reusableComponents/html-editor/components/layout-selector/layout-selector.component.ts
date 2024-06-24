import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-layout-selector',
  templateUrl: './layout-selector.component.html',
  styleUrls: ['./layout-selector.component.css']
})
export class LayoutSelectorComponent {
  @Output() layoutSelected: EventEmitter<any> = new EventEmitter();
  constructor() {}

  selectLayout(layout: string) {
    this.layoutSelected.emit(layout);
  }
}
