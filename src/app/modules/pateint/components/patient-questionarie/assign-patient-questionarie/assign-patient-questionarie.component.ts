import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { QuestionarieService } from '../../../services/questionarie.service';

@Component({
  selector: 'app-assign-patient-questionarie',
  templateUrl: './assign-patient-questionarie.component.html',
  styleUrls: ['./assign-patient-questionarie.component.css']
})
export class AssignPatientQuestionarieComponent implements OnInit {
  @Input() patientId: any;
  @Output() handleQuestionnaireAssign = new EventEmitter();
  @Output() handleCancel = new EventEmitter();

  first = 0;
  rows = 10;
  globalFilterColumn = ['id', 'Select', 'name'];
  questionnaireIds: any = [];
  columns = [
    { header: 'Select', field: 'Select' },
    { header: 'Questionnaire Id', field: 'id' },
    { header: 'Questionnaire Name', field: 'name' }
  ];
  _selectedColumns: any[] = this.columns;

  questionarieList: any = [];
  constructor(
    private questionarieService: QuestionarieService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.loadQuestionnaires();
  }

  loadQuestionnaires() {
    this.questionarieService.getAllQuestionnaireListOptimized().then((data) => {
      this.questionarieList = data;
    });
  }

  selectCheckbox(event: any, questionnaireId: any) {
    console.log(event.target.checked);
    if (event.target.checked) {
      this.questionnaireIds.push(questionnaireId);
    } else {
      var index = this.questionnaireIds.indexOf(questionnaireId);
      if (index !== -1) {
        this.questionnaireIds.splice(index, 1);
      }
    }
  }

  sendQuestionnaireToPatient() {
    this.questionarieService
      .sendQuestionnaireToPatient(this.patientId, this.questionnaireIds)
      .then(
        (response: any) => {
          if (response.length == 0) {
            this.toastService.success(
              'Questionnaires already sent to patient before.'
            );
          } else {
            this.toastService.success('Questionnaire(s) Sent Successfully.');
          }

          this.handleQuestionnaireAssign.emit({ length: response.length });
        },
        () => {
          this.toastService.error('Unable to send questionnaires to patient.');
        }
      );
  }

  back() {
    this.handleCancel.emit();
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }
}
