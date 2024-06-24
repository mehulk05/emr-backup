import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-calendar-tooltip',
  templateUrl: './calendar-tooltip.component.html',
  styleUrls: ['./calendar-tooltip.component.css']
})
export class CalendarTooltipComponent {
  @Input() data: any;
  @Input() appointments: any;
  constructor() {}

  getFieldsByName(name: string, id: any) {
    const filteredData = this.appointments.filter((data: any) => data.id == id);
    if (filteredData.length > 0) {
      const data = filteredData[0];
      switch (name) {
        case 'Services Name':
          return data.serviceList
            .map((service: any) => service.serviceName)
            .toString();
        case 'Provider Name':
          return data?.providerName;
        case 'Appointment Status':
          return data?.appointmentStatus;
        case 'Payment Status':
          // return data?.paymentStatus;
          return this.formatPaymentStatus(data?.paymentStatus);
        case 'Patient Name':
          return data?.patientFirstName + ' ' + data?.patientLastName;
        case 'Payment Icon':
          return data?.paymentStatus === 'Unpaid'
            ? '<img style="max-width:50px" src="assets/images/unpaid.png" />'
            : '<img style="max-width:50px" src="assets/images/paid.png" />';

        case 'Document Icon':
          if (data?.documentPresent) {
            return data?.documentSigned
              ? '<img style="max-width:50px" src="assets/images/docSigned.png" />'
              : '<img style="max-width:50px" src="assets/images/docUnsigned.png" />';
          }
          return '';
      }
    }
    return '';
  }
  formatPaymentStatus(status: string): string {
    // Replace camel case with spaced words and capitalize the first letter of each word
    return status
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
  }
}
