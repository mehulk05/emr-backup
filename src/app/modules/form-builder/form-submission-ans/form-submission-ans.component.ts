import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { QuestionarieService } from '../services/questionarie.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-form-submission-ans',
  templateUrl: './form-submission-ans.component.html',
  styleUrls: ['./form-submission-ans.component.css']
})
export class FormSubmissionAnsComponent implements OnInit {
  questionnaireId: any = null;
  questionnaireSubmissionId: any = null;
  rowData: any = [];
  questionnaireName: any = null;
  isReviewForm = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionarieService: QuestionarieService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.questionnaireSubmissionId =
      this.activatedRoute.snapshot.params.questionnaireSubmissionId;
    this.questionnaireId = this.activatedRoute.snapshot.params.questionnaireId;
    if (window.location.pathname.includes('review-form')) {
      this.isReviewForm = true;
    }
    this.loadQuestionAnswers();
  }

  loadQuestionAnswers() {
    this.questionarieService
      .getQuestionAnswers(this.questionnaireSubmissionId)
      .then(
        (response: any) => {
          this.questionnaireName = response.questionnaireName;
          this.rowData = response.questionAnswers;
        },
        () => {
          this.toastService.error('Unable to load  questions.');
        }
      );
  }

  showQuestionnaireSubmissions() {
    this.router.navigate(
      [
        (this.isReviewForm ? '/review-form/' : '/form-builder/') +
          this.questionnaireId +
          '/edit'
      ],
      {
        queryParams: {
          source: 'submission',
          type: this.isReviewForm ? 'review-form' : 'form-builder'
        }
      }
    );
  }

  symptomsValue(answerText: any, questionType: any) {
    if (questionType === 'Symptoms') {
      try {
        const obj = JSON.parse(answerText);
        let ans = '';
        for (const [key, value] of Object.entries(obj)) {
          ans = ans + key.toUpperCase() + ': ' + [].concat(value).join() + ';';
        }

        if (ans.length > 1) {
          ans = ans.substring(0, ans.length - 1);
        }

        return ans;
      } catch (e) {
        return answerText;
      }
    } else {
      return answerText;
    }
  }

  getBusinessHours(hours: string) {
    return hours.split(',').map((hour) => hour.split('-'));
  }

  getTextAnswerValue(answer: any) {
    return answer ? answer.replace(/\n/g, '<br/>') : '';
  }

  downloadAsPDF() {
    console.log('pfd', this.questionnaireSubmissionId);
    const doc = new jsPDF('l', 'mm', 'a4');
    const dataArray = new Array();
    console.log();
    this.rowData.forEach((data: any) => {
      console.log(data);
      const temp = [
        data.questionName,
        this.answer(data?.answerText, data.questionType, data.questionName)
      ];
      dataArray.push(temp);
    });
    console.log(dataArray);
    const columns = [['Question', 'Answer']];

    autoTable(doc, {
      head: columns,
      body: dataArray,
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 180 }
        // etc
      },
      theme: 'grid',
      headStyles: { fillColor: [128, 128, 128] }
    });
    // doc.text('Leads List', 140, 10, { align: 'center' });
    doc.setTextColor(0);
    doc.save('questionnaire_submission.pdf');
  }

  answer(answerText: any, questionType: any, questionName: any) {
    if (questionName === 'Symptoms') {
      try {
        const obj = JSON.parse(answerText);
        let ans = '';
        for (const [key, value] of Object.entries(obj)) {
          ans = ans + key.toUpperCase() + ': ' + [].concat(value).join() + ';';
        }

        if (ans.length > 1) {
          ans = ans.substring(0, ans.length - 1);
        }

        return ans;
      } catch (e) {
        return answerText;
      }
    }
    if (questionType === 'Business_Hours') {
      return answerText;
    }
    if (questionType === 'Yes_No' || questionType === 'Terms_And_Conditions') {
      if (answerText === true || answerText === 'true') {
        return 'Yes';
      }
      if (answerText === false || answerText === 'false') {
        return 'No';
      }
      return answerText;
    } else {
      return answerText;
    }
  }
}
