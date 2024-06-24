import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-service-by-list',
  templateUrl: './service-by-list.component.html',
  styleUrls: ['./service-by-list.component.css']
})
export class ServiceByListComponent {
  @Input() activeLinkStyle: any;
  @Input() buttonForegroundColor: any;
  @Input() titleColor: any;
  @Input() currency: any;
  @Input() buttonBackgroundColor: any;
  @Input() services: any;
  @Input() showRadio: boolean;
  @Input() booking: any;
  @Output() selectedServiceEmitter = new EventEmitter<any>();
  @Output() selectedServiceIdCheck = new EventEmitter<any>();
  serviceImgUrl: any;
  showMore: boolean;
  selectedIndex: number;
  constructor() {}

  setShowMore(showMoreFlag: boolean, index: number) {
    this.showMore = showMoreFlag;
    this.selectedIndex = index;
  }

  onServiceClick = ($event: any, service: any) => {
    this.selectedServiceEmitter.emit({
      checked: $event.checked,
      service: service
    });
  };

  onSelectedService(id: any) {
    this.selectedServiceIdCheck.emit({
      id: id
    });
  }

  isChecked(id: any) {
    let checked = false;
    for (let i = 0; i < this.booking.selectedServices.length; i++) {
      if (this.booking.selectedServices[i].id == id) {
        checked = true;
      }
    }
    return checked;
  }
}
