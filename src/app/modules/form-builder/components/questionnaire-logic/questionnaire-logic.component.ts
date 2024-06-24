import { Component, Input, OnChanges } from '@angular/core';
import { QuestionarieService } from '../../services/questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-questionnaire-logic',
  templateUrl: './questionnaire-logic.component.html',
  styleUrls: ['./questionnaire-logic.component.css']
})
export class QuestionnaireLogicComponent implements OnChanges {
  @Input() questionnaireId: any;
  conditions: any[] = [];
  questions: any[] = [];
  questionnaire: any;

  constructor(
    private questionnaireService: QuestionarieService,
    private alertService: ToasTMessageService
  ) {}

  ngOnChanges() {
    if (this.questionnaireId) {
      this.loadQuestionnaire();
    }
  }

  loadQuestionnaire() {
    this.questionnaireService
      .getQuestionnaire(this.questionnaireId)
      .then((response: any) => {
        this.questionnaire = response;
        this.loadQuestions();
      });
  }

  loadQuestionnaireConditions() {
    this.questionnaireService
      .getQuestionnaireConditions(this.questionnaireId)
      .then(
        (response: any) => {
          this.conditions = response;
        },
        () => {
          this.alertService.error('Error While fetching conditions.');
        }
      );
  }

  loadQuestions() {
    this.questionnaireService
      .getAllQuestionById(this.questionnaireId)
      .then((response: any) => {
        this.questions = response;
        this.loadQuestionnaireConditions();
      });
  }

  addCondition() {
    if (
      this.conditions?.length > 0 &&
      !this.conditions[this.conditions.length - 1].questionId
    ) {
      this.alertService.error('Please save current condition first!');
      return;
    }
    this.conditions.push({
      questionId: undefined,
      conditionType: 'EQUALS',
      conditionValue: '',
      conditionNextQuestionId: undefined
    });
  }

  handleButtonEvent(e: any) {
    if (e.type === 'save') {
      this.saveQuestionnaireCondition(e.data, e.index);
    } else if (e.type === 'delete') {
      this.deleteQuestionnaireCondition(e.data);
    } else if (e.type === 'remove') {
      this.conditions.pop();
    }
  }

  saveQuestionnaireCondition(formData: any, i: number) {
    const index = this.conditions.findIndex((condition) => {
      return condition.questionId === formData.questionId;
    });
    if (index !== -1 && index !== i) {
      this.alertService.error('Condition for question already present.');
      return;
    }
    this.questionnaireService
      .saveQuestionnaireCondition(this.questionnaireId, formData)
      .then((response: any) => {
        if (response) {
          this.alertService.success('Condition Saved Successfully.');
          this.loadQuestionnaireConditions();
        }
      });
  }

  deleteQuestionnaireCondition(questionnaireConditionId: any) {
    this.questionnaireService
      .deleteQuestionnaireCondition(
        this.questionnaireId,
        questionnaireConditionId
      )
      .then(() => {
        this.alertService.success('Condition Deleted Successfully.');
        this.loadQuestionnaireConditions();
      });
  }
}
