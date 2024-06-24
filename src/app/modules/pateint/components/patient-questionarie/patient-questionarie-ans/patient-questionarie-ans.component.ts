import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { QuestionarieService } from '../../../services/questionarie.service';

@Component({
  selector: 'app-patient-questionarie-ans',
  templateUrl: './patient-questionarie-ans.component.html',
  styleUrls: ['./patient-questionarie-ans.component.css']
})
export class PatientQuestionarieAnsComponent implements OnInit {
  questionnaireId: any = null;
  patientId: any = null;
  rowData: any = [];
  questionnaireName: any = null;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionarieService: QuestionarieService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.patientId = this.activatedRoute.snapshot.params.patientId;
    this.questionnaireId = this.activatedRoute.snapshot.params.questionnaireId;
    this.loadPatientQuestionnaire();
    console.log('her');
  }

  loadPatientQuestionnaire() {
    this.questionarieService
      .getQuestions(this.patientId, this.questionnaireId)
      .then(
        (response: any) => {
          this.questionnaireName = response.questionnaireName;
          this.rowData = response.patientQuestionAnswers;
        },
        () => {
          this.toastService.error('Unable to load patient questions.');
        }
      );
  }

  showEditPatient() {
    this.router.navigate(['/patients/' + this.patientId + '/edit'], {
      queryParams: { source: 'questionarie' }
    });
  }

  printData(data: any) {
    console.log(data);
  }

  renderDataForMultiSelect(data: any) {
    const selectedChoices = data?.patientQuestionChoices.filter(
      (choice: any) => choice.selected === true
    );
    console.log(data.patientQuestionChoices, selectedChoices);
    let answerText = '';
    if (selectedChoices.length > 0) {
      answerText = selectedChoices
        .map((choice: any) => choice.choiceName)
        .join(',');
    } else {
      answerText = data?.answerText;
    }
    console.log(answerText);
    return answerText;
  }
}
