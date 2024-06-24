import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PateintAppointmentService } from '../../service/pateint-appointment.service';
import HelloSign from 'hellosign-embedded';

@Component({
  selector: 'app-patient-appointmment-view',
  templateUrl: './patient-appointmment-view.component.html',
  styleUrls: ['./patient-appointmment-view.component.css']
})
export class PatientAppointmmentViewComponent implements OnInit {
  appointmentId: any = null;
  appointment: any = null;
  user: any;
  consents: any = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private patientService: PateintAppointmentService,
    private authenticationService: AuthService
  ) {}

  ngOnInit(): void {
    this.appointmentId = this.activatedRoute.snapshot.params.appointmentId;
    if (this.appointmentId) {
      this.loadAppointment();
    }

    this.authenticationService.currentUser.subscribe((data: any) => {
      this.user = data;
      this.loadPatientConsents();
    });
  }

  loadAppointment() {
    this.patientService.getAppointment(this.appointmentId).then(
      (response: any) => {
        this.appointment = response;
      },
      () => {
        this.toastMessageService.error('Unable to load appointment.');
      }
    );
  }

  loadPatientConsents() {
    if (this.user && this.user.id) {
      this.patientService.getPatientConsents(this.user.id).then(
        (response: any) => {
          this.consents = response.filter((res: any) => {
            return res.appointment?.id == this.appointmentId;
          });
        },
        (e) => {
          console.log(e);
          this.toastMessageService.error(
            'Unable to load appointment consents.'
          );
        }
      );
    }
  }

  openHelloSign(appointmentConsent: any) {
    this.patientService.getPatientConsentSignUrl(appointmentConsent.id).then(
      (response: any) => {
        const client = new HelloSign();
        client.open(response.signUrl, {
          clientId: response.helloSignClientId,
          skipDomainVerification: true
        });

        client.on('sign', (data: any) => {
          console.log('Signature ID: ' + data.signatureId);
          this.patientService
            .updatePatientConsentStatus(appointmentConsent.id, 'Signed')
            .then(() => {
              this.toastMessageService.success(
                'Consent signed successfully. File will be available after some time for download.'
              );
              this.loadPatientConsents();
            });
        });
      },
      () => {
        this.toastMessageService.error('Unable to create consent sign url.');
      }
    );
  }
}
