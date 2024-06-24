import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { IBooking } from '../../models/booking.model';
import { IConsents } from '../../models/consent.mode';
import { IQuestionaire } from '../../models/questionarie.model';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-seamless-booking',
  templateUrl: './seamless-booking.component.html',
  styleUrls: ['./seamless-booking.component.css']
})
export class SeamlessBookingComponent implements OnInit {
  subscriptions: Subscription = new Subscription();
  booking: IBooking;
  consents: IConsents[] = [];
  questionnaires: IQuestionaire[];
  allQuestionsSubmited: boolean;
  allStatusesAreTrue: boolean;
  constructor(
    private appointmentService: AppointmentService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.booking = this.localStorageService.readStorage('appointmentDataObj');
    console.log(this.booking);
    this.getSeamlessInfo();
    // if(this.booking  && this.booking?.selectedServices[0]){
    //   this.consents = this.booking?.selectedServices[0].consents;
    //   this.questionaries = this.booking.selectedServices[0].questionnaires;
    // }

    // if(this.consents?.length> 0){
    //   this.signAllConsents()
    // }
  }

  getSeamlessInfo() {
    this.appointmentService
      .getConsentFaqInfo(this.booking.businessId, this.booking.appointment.id)
      .then((data: any) => {
        console.log(data);
        this.consents = data?.appointmentConsents;
        this.questionnaires = data?.appointmentQuestionnaires;

        this.allStatusesAreTrue = this.consents.every(
          (obj) => obj.appointmentConsentStatus === 'Signed'
        ); // true
        this.allQuestionsSubmited = this.questionnaires.every(
          (obj) => obj.questionnaireStatus === 'Submitted'
        ); // true

        if (this.consents.length == 0 && this.questionnaires.length == 0) {
          this.router.navigateByUrl('thankyou?bid=' + this.booking.businessId);
        }
      });
  }

  signAllConsents() {
    const ids = this.getValueByKey(this.consents, 'id');
    console.log(ids);
  }

  getValueByKey(array: any, key: any) {
    const ids: any = array.map((object: any) => object[key]);
    return ids;
  }

  onAfterSubmit(e: any) {
    console.log(e);
    this.getSeamlessInfo();
  }

  onSubmit() {
    this.router.navigateByUrl('thankyou?bid=' + this.booking.businessId);
  }
}
