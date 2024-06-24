import { Component, OnInit } from '@angular/core';
import { QuestionariePageService } from 'src/app/modules/form-builder/services/questionarie-page.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-support-center',
  templateUrl: './support-center.component.html',
  styleUrls: ['./support-center.component.css']
})
export class SupportCenterComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 10;
  globalFilterColumn = ['id', 'name'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Actions', field: 'actions' }
  ];
  selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  questionnaireData: any;
  userId: any;
  data: any;
  bid: any;
  constructor(
    private questionarieService: QuestionariePageService,
    private toastMessageService: ToasTMessageService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.bid = this.localStorageService.readStorage('businessInfo')?.id;
    this.getRowList();
    // this.rowData = [
    //   {
    //     id: 1,
    //     name: 'Onboarding Form'
    //   }
    // ];
  }

  getRowList() {
    this.rowData = [];
    this.questionarieService.getSupportCenter(this.bid).then(
      (response: any) => {
        this.rowData = response;
      },
      () => {
        this.toastMessageService.error('Data Not Available');
      }
    );
  }

  download(data: any) {
    if (data === 1) {
      this.questionarieService.getAllQuestionnaireListBusinessId(this.bid).then(
        (data: any) => {
          this.questionnaireData = data;
          this.downloadAsPDF();
        },
        (error: any) => {
          this.toastMessageService.error(error?.error?.errorMessage);
        }
      );
    }
  }

  getTextAnswerValue(answer: any) {
    return answer ? answer.replace(/\n/g, '<br/>') : '';
  }

  downloadAsPDF() {
    console.log('pfd', this.questionnaireData?.id);
    const questionnaireList = this.questionnaireData.questionAnswers;
    const doc = new jsPDF('l', 'mm', 'a4');
    const dataArray = new Array();
    console.log();
    questionnaireList.forEach((data: any) => {
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
