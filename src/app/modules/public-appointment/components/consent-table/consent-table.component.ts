import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AppointmentService } from '../../services/appointment.service';
import HelloSign from 'hellosign-embedded';

@Component({
  selector: 'app-consent-table',
  templateUrl: './consent-table.component.html',
  styleUrls: ['./consent-table.component.css']
})
export class ConsentTableComponent {
  @Output() afterQuestionSubmit = new EventEmitter<any>();

  @Input() consents: any = [];
  constructor(
    private toastService: ToasTMessageService,
    private fileSaverService: FileSaverService,
    private appointmentService: AppointmentService
  ) {}

  downloadAppointmentConsent(appointmentConsent: any) {
    this.appointmentService
      .downloadAppointmentConsent(appointmentConsent.id)
      .then((response: any) => {
        this.fileSaverService.save(response, 'AppointmentConsent.pdf');
      });
  }

  showSignedConsent(appointmentConsent: any) {
    console.log(appointmentConsent);
    this.appointmentService
      .getPatientConsentSignUrl(appointmentConsent.id)
      .then(
        (response: any) => {
          const client = new HelloSign();
          client.open(response.signUrl, {
            clientId: response.helloSignClientId,
            skipDomainVerification: true
          });

          client.on('sign', (data: any) => {
            console.log('Signature ID: ' + data);

            this.appointmentService
              .updatePatientConsentStatus(appointmentConsent.id, 'Signed')
              .then(() => {
                // this.getSeamlessInfo();
                this.afterQuestionSubmit.emit(true);
                this.toastService.success('Consent signed successfully.');
                setTimeout(() => {
                  // this.getSeamlessInfo();
                }, 20000);
              });
          });
        },
        () => {
          this.toastService.error('Unable to create consent sign url.');
        }
      );
  }
}
