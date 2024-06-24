import { Component, Input, OnChanges } from '@angular/core';
import { LeadsService } from '../../../leads/service/leads.service';
import { PatientService } from '../../../pateint/services/patient.service';

@Component({
  selector: 'app-two-way-text-chat-side-bar',
  templateUrl: './two-way-text-chat-side-bar.component.html',
  styleUrls: ['./two-way-text-chat-side-bar.component.css']
})
export class TwoWayTextChatSideBarComponent implements OnChanges {
  @Input() chat: any[] = [];
  @Input() businessName: string;
  firstName: any;
  lastName: any;
  constructor(
    private leadService: LeadsService,
    private patientService: PatientService
  ) {}

  ngOnChanges(): void {
    if (this.chat.length > 0) {
      this.chat[0].sourceType === 'Lead'
        ? this.loadLeadInfo(this.chat[0].sourceId)
        : this.loadPatientInfo(this.chat[0].sourceId);
    }
  }

  async loadPatientInfo(sourceId: number) {
    const patientData = (await this.patientService.getPatientOptimized(
      sourceId
    )) as any;
    this.firstName = patientData.firstName;
    this.lastName = patientData.lastName;
  }

  loadLeadInfo(sourceId: number) {
    this.leadService
      .getQuestionnaireSubmission(sourceId)
      .then((response: any) => {
        for (let i = 0; i < response.questionAnswers.length; i++) {
          response.questionAnswers[i].questionName.toLowerCase() ===
          'first name'
            ? (this.firstName = response.questionAnswers[i].answerText)
            : response.questionAnswers[i].questionName.toLowerCase() ===
              'last name'
            ? (this.lastName = response.questionAnswers[i].answerText)
            : null;
        }
      });
  }
}
