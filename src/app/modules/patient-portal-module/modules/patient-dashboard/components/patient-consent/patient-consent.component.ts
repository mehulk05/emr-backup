import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FileSaverService } from 'ngx-filesaver';
import HelloSign from 'hellosign-embedded';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientDashboardService } from '../../service/patient-dashboard.service';

@Component({
  selector: 'app-patient-consent',
  templateUrl: './patient-consent.component.html',
  styleUrls: ['./patient-consent.component.css']
})
export class PatientConsentComponent implements OnInit, OnChanges {
  first = 0;
  rows = 10;
  globalFilterColumn = [
    'name',
    'appointmentId',
    'appointmentConsentStatus',
    'createdAt',
    'appointmentDate',
    'signedDate'
  ];
  columns = [
    { header: 'Consent Name', field: 'name' },
    { header: 'Appointment Id', field: 'appointmentId' },
    { header: 'Status', field: 'appointmentConsentStatus' },
    { header: 'Appointment Date', field: 'appointmentDate' },
    { header: 'Signed Date', field: 'signedDate' },
    { header: 'Created Date', field: 'createdAt' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;

  @Input() currentPaitent: any;
  consents: any = [];
  defaultClinic: any = null;
  showAssignNewConsentForm = false;

  constructor(
    private toastService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private fileSaverService: FileSaverService,
    private patientService: PatientDashboardService
  ) {}

  ngOnInit(): void {
    this.loadDefaultClinic();
  }

  ngOnChanges(): void {
    if (this.currentPaitent) {
      this.loadPatientConsents();
    }
  }

  loadPatientConsents() {
    this.patientService
      .getPatientConsentsOptimized(this.currentPaitent?.id)
      .then(
        (response: any) => {
          this.consents = response;
        },
        () => {
          this.toastService.error('Unable to load patient consents.');
        }
      );
  }

  downloadAppointmentConsent(appointmentConsent: any) {
    this.patientService
      .downloadAppointmentConsent(appointmentConsent.id)
      .then((response: any) => {
        this.fileSaverService.save(response, 'AppointmentConsent.pdf');
      });
  }

  showSignedConsent(appointmentConsent: any) {
    console.log(appointmentConsent);
    this.patientService.getPatientConsentSignUrl(appointmentConsent.id).then(
      (response: any) => {
        const client = new HelloSign();
        client.open(response.signUrl, {
          clientId: response.helloSignClientId,
          skipDomainVerification: true
        });

        client.on('sign', (data: any) => {
          console.log('Signature ID: ' + data);

          this.patientService
            .updatePatientConsentStatus(appointmentConsent.id, 'Signed')
            .then(() => {
              this.loadPatientConsents();
              this.toastService.success(
                'Consent signed successfully. File will be available after some time for download.'
              );
              setTimeout(() => {
                this.loadPatientConsents();
              }, 20000);
            });
        });
      },
      () => {
        this.toastService.error('Unable to create consent sign url.');
      }
    );
  }

  onConsentAssign() {
    this.showAssignNewConsentForm = false;
    this.loadPatientConsents();
  }
  onConsentCancel() {
    this.showAssignNewConsentForm = false;
  }

  formatTime(time: any) {
    return this.formatTimeService.formatTime(time);
  }

  loadDefaultClinic() {
    this.patientService.getDefaultCinicOptimized().then(
      (response: any) => {
        this.defaultClinic = response;
      },
      () => {
        this.toastService.error('Unable to load default clinic.');
      }
    );
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
