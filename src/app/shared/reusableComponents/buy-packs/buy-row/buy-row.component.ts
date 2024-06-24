import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'buy-row',
  templateUrl: './buy-row.component.html',
  styleUrls: ['./buy-row.component.css']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class BuyRow {
  @Input() package: any;
  @Output() callOnBuy = new EventEmitter<any>();
  showButton: Boolean;

  constructor() {}

  submitBuy(pack: any) {
    this.callOnBuy.emit(pack);
  }
}
