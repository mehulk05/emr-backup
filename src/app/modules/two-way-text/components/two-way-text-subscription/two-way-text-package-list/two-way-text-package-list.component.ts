import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-two-way-text-package-list',
  templateUrl: './two-way-text-package-list.component.html',
  styleUrls: ['./two-way-text-package-list.component.css']
})
export class TwoWayTextPackageListComponent {
  @Output() buttonClickedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  packageList: any[] = [
    {
      id: 1,
      name: 'STANDARD',
      amount: '2.35',
      amountDescription: 'per month',
      description: 'Two-way Text Only'
    },
    {
      id: 2,
      name: 'ENTERPRISE',
      amount: '27',
      amountDescription: 'per year',
      description: 'Two-way Text Only'
    },
    {
      id: 3,
      name: 'STANDARD PLUS',
      amount: '10',
      amountDescription: 'for the first month, $2.5 per month thereafter',
      description: 'Two-way Text 1000 SMS'
    },
    {
      id: 4,
      name: 'ENTERPRISE PLUS',
      amount: '50',
      amountDescription: 'per year',
      description: 'Two-way Text 5000 SMS'
    }
  ];
  selectedPackageId: number;
  constructor() {}

  selectPackage(id: number) {
    this.selectedPackageId = this.selectedPackageId === id ? undefined : id;
  }

  buttonClicked(type: string) {
    this.buttonClickedEvent.emit({
      type,
      data: this.selectedPackageId
    });
  }
}
