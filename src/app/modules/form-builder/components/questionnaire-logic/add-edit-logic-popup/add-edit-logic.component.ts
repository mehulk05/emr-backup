import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export enum QuestionType {
  INPUT = 'Input',
  YES_NO = 'Yes_No',
  MULTIPLE_SELECT = 'Multiple_Selection_Text',
  DATE = 'Date',
  FILE = 'File',
  BUSINESS_HOURS = 'Business_Hours',
  ADDRESS = 'Address',
  TERMS_AND_CONDITIONS = 'Terms_And_Conditions',
  PHONE_NUMBER = 'Phone_Number'
}

@Component({
  selector: 'app-add-edit-logic',
  templateUrl: './add-edit-logic.component.html',
  styleUrls: ['./add-edit-logic.component.css']
})
export class AddEditLogicComponent implements OnInit {
  @Input() index: number;
  @Input() condition: any;
  @Input() questions: any[] = [];
  @Output() buttonEvent: EventEmitter<any> = new EventEmitter<any>();
  logicForm!: FormGroup;
  logicQuestionList: any[] = [];
  nextQuestionList: any[] = [];
  mode: string = 'Display';
  conditionTypes: any[] = [
    {
      value: 'EQUALS',
      label: 'Equal to'
    },
    {
      value: 'NOT_EQUALS',
      label: 'Not Equal to'
    },
    {
      value: 'GREATER_THEN',
      label: 'Greater than'
    },
    {
      value: 'LESS_THEN',
      label: 'Less than'
    }
  ];
  filteredConditionTypes: any[] = [];
  allowedQuestionTypes: string[] = [
    'Input',
    'Yes_No',
    'Multiple_Selection_Text'
  ];
  questionType: string = 'Input';
  questionIndex: number;
  multipleSelectionArray: any[] = [];
  isMultipleSelectionAllowed: boolean = false;
  showModal: boolean = false;
  modalData: any;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.logicForm = this.formBuilder.group({
      id: [undefined, []],
      questionId: [undefined, [Validators.required]],
      conditionType: ['EQUALS', [Validators.required]],
      conditionValue: ['', [Validators.required]],
      conditionNextQuestionId: [undefined, [Validators.required]]
    });

    this.logicForm.controls['questionId'].valueChanges.subscribe((value) => {
      if (value && this.questions && this.questions.length > 0) {
        this.setQuestionType(value);
        this.setNextQuestionList(value);
      }
    });
    this.filteredConditionTypes = [...this.conditionTypes];
    if (this.questions && this.questions.length > 0) {
      this.logicQuestionList = this.questions.filter((question) =>
        this.allowedQuestionTypes.includes(question.type)
      );
    }
    if (this.condition.questionId) {
      this.setQuestionType(this.condition.questionId);
      this.setNextQuestionList(this.condition.questionId);
    }
    this.setConditionData();
    this.mode = this.condition?.id ? 'Display' : 'Editing';
    this.changeMode(this.mode);
  }

  setConditionData() {
    if (this.condition) {
      let conditionValue = this.condition.conditionValue;
      const index = this.getQuestionIndex(this.condition.questionId);
      if (index !== -1) {
        this.questionIndex = index;
        if (
          this.questions[this.questionIndex].type ===
            QuestionType.MULTIPLE_SELECT &&
          this.questions[this.questionIndex].allowMultipleSelection
        ) {
          conditionValue = conditionValue.split('$$');
        } else if (
          this.questions[this.questionIndex].type === QuestionType.DATE &&
          this.condition.conditionValue
        ) {
          conditionValue = new Date(conditionValue);
        }
      }

      this.logicForm.patchValue({
        id: this.condition.id,
        questionId: this.condition.questionId,
        conditionType: this.condition.conditionType,
        conditionValue: conditionValue,
        conditionNextQuestionId: this.condition.conditionNextQuestionId
      });
    }
  }

  setQuestionType(questionId: number) {
    const index = this.getQuestionIndex(questionId);
    if (index !== -1) {
      this.questionIndex = index;
      const question = this.questions[index];
      this.questionType = question.type;
      if (question.type === 'Multiple_Selection_Text') {
        this.multipleSelectionArray = question.questionChoices;
        this.isMultipleSelectionAllowed = question.allowMultipleSelection;
      }
    } else {
      this.questionType = 'Input';
    }
    if (!(this.questionType === 'Input' || this.questionType === 'Text')) {
      this.filteredConditionTypes = this.conditionTypes.filter(
        (condition) => !['GREATER_THEN', 'LESS_THEN'].includes(condition.value)
      );
    } else {
      this.filteredConditionTypes = [...this.conditionTypes];
    }
  }

  getQuestionIndex(questionId: number) {
    return this.questions.findIndex((question) => question.id === questionId);
  }

  setNextQuestionList(questionId: any) {
    const curIndex = this.questions.findIndex(
      (question) => question.id === questionId
    );
    if (curIndex !== this.questions.length - 1) {
      this.nextQuestionList = this.questions.slice(curIndex + 1);
    }
  }

  get f() {
    return this.logicForm.controls;
  }

  changeMode(mode: string) {
    this.mode = mode;
    if (this.mode === 'Editing') {
      this.logicForm.enable();
    } else {
      this.setConditionData();
      this.logicForm.disable();
    }
  }

  saveLogic() {
    const formData = this.logicForm.value;
    if (this.questions[this.questionIndex].type === 'Multiple_Selection_Text') {
      if (this.questions[this.questionIndex].allowMultipleSelection) {
        formData.conditionValue = (<string[]>formData.conditionValue).join(
          '$$'
        );
      }
    }
    this.buttonEvent.emit({
      type: 'save',
      data: formData,
      index: this.index
    });
  }

  dicardLogic() {
    if (this.condition.id) {
      this.changeMode('Display');
    } else {
      this.buttonEvent.emit({
        type: 'remove'
      });
    }
  }

  deleteLogic() {
    this.showModal = true;
    this.modalData = {};
    this.modalData.feildName = '';
    this.modalData.titleName = 'Condition';
  }

  onCloseDeleteModal(e: any) {
    this.showModal = false;
    if (this.condition.id && e.isDelete) {
      this.buttonEvent.emit({
        type: 'delete',
        data: this.condition.id
      });
    }
  }
}
