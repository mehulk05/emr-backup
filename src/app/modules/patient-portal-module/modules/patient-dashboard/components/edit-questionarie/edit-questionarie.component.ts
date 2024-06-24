import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientDashboardService } from '../../service/patient-dashboard.service';

@Component({
  selector: 'app-edit-questionarie',
  templateUrl: './edit-questionarie.component.html',
  styleUrls: ['./edit-questionarie.component.css']
})
export class EditQuestionarieComponent implements OnInit {
  acceptable_types = [
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  questionnaireId: any;
  patientId: any;
  patientQuestionnaireForm!: FormGroup | any;
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private questionarieService: PatientDashboardService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.patientId = this.activatedRoute.snapshot.params.patientId;
    this.questionnaireId = this.activatedRoute.snapshot.params.questionnaireId;
    this.initializeForm();
    this.loadQuestions();
  }

  initializeForm() {
    this.patientQuestionnaireForm = this.formBuilder.group({
      id: ['', []],
      questionnaireId: ['', []],
      patientId: ['', []],
      questionnaireName: ['', []],
      patientQuestionAnswers: this.formBuilder.array([])
    });
  }

  get patientQuestionAnswers(): any {
    return this.patientQuestionnaireForm.get(
      'patientQuestionAnswers'
    ) as FormArray;
  }

  get f() {
    return this.patientQuestionnaireForm.controls;
  }

  loadQuestions() {
    this.questionarieService
      .getQuestions(this.patientId, this.questionnaireId)
      .then(
        (response: any) => {
          this.patientQuestionnaireForm.patchValue({
            id: response.id,
            patientId: response.patientId,
            questionnaireId: response.questionnaireId
          });
          if (
            response.patientQuestionAnswers != null &&
            response.patientQuestionAnswers.length > 0
          ) {
            const control = <FormArray>(
              this.patientQuestionnaireForm.controls.patientQuestionAnswers
            );
            response.patientQuestionAnswers.forEach((x: any) => {
              control.push(
                this.formBuilder.group({
                  questionId: x.questionId,
                  questionName: x.questionName,
                  questionType: x.questionType,
                  answer: x.answer,
                  answerText: x.answerText,
                  answerComments: x.answerComments,
                  patientQuestionChoices: this.setQuestionChoices(x),
                  allowMultipleSelection: x.allowMultipleSelection,
                  preSelectCheckbox: x.preSelectCheckbox,
                  required: x.required,
                  hidden: x.hidden,
                  showDropDown: x.showDropDown,
                  fileSource: null
                })
              );
            });
          }
        },
        () => {
          this.toastService.error('Unable to load patient questions.');
        }
      );
  }

  setQuestionChoices(x: any) {
    const arr = new FormArray([]);
    //let arr = x.get("patientQuestionChoices") as FormArray;
    x.patientQuestionChoices.forEach((y: any) => {
      arr.push(
        this.formBuilder.group({
          choiceId: y.choiceId,
          choiceName: y.choiceName,
          selected: y.selected
        })
      );
    });
    if (arr != null && arr.length > 0) {
      console.log(arr);
    }
    return arr;
  }

  onChangeSingleSelection(
    event: any,
    parentIndex: number,
    choiceIndex: number,
    pqa: any
  ) {
    pqa.value.patientQuestionChoices.forEach((choice: any, index: number) => {
      if (index !== choiceIndex) {
        choice.selected = false;
      }
    });
    pqa.value.patientQuestionChoices[choiceIndex].selected =
      event.target.checked;
    if (event.target.checked) {
      pqa.value.answerText =
        pqa.value.patientQuestionChoices[choiceIndex].choiceName;
    }
  }

  onCheckboxChange(
    event: any,
    pqc: any,
    pqa: any,
    pqaIndex: any,
    pqcIndex: any
  ) {
    console.log(event.target.checked, pqc, pqa, pqaIndex, pqcIndex);
    const arr = <FormArray>(
      this.patientQuestionnaireForm.get('patientQuestionAnswers')
    );
    const quesChoiceObj = (<FormArray>(
      arr.controls[pqaIndex].get('patientQuestionChoices')
    )).at(pqcIndex);
    if (event.target.checked && quesChoiceObj) {
      quesChoiceObj.value.selected = true;
    } else if (!event.target.checked && quesChoiceObj) {
      quesChoiceObj.value.selected = false;
    }
  }

  onRadioChange(event: any, pqc: any, pqa: any, pqaIndex: any, pqcIndex: any) {
    console.log(event.target.checked, pqc, pqa, pqaIndex, pqcIndex);
    const arr = <FormArray>(
      this.patientQuestionnaireForm.get('patientQuestionAnswers')
    );

    (<FormArray>(
      arr.controls[pqaIndex].get('patientQuestionChoices')
    )).controls.forEach((choice) => {
      choice.value.selected = false;
    });

    const quesChoiceObj = (<FormArray>(
      arr.controls[pqaIndex].get('patientQuestionChoices')
    )).at(pqcIndex);
    if (event.target.checked && quesChoiceObj) {
      quesChoiceObj.value.selected = true;
    } else if (!event.target.checked && quesChoiceObj) {
      quesChoiceObj.value.selected = false;
    }
  }

  isChecked(pqaIndex: any, pqcIndex: any) {
    const arr = <FormArray>(
      this.patientQuestionnaireForm.get('patientQuestionAnswers')
    );
    const quesChoiceObj = (<FormArray>(
      arr.controls[pqaIndex].get('patientQuestionChoices')
    )).at(pqcIndex);
    console.log(quesChoiceObj.value.choiceName, quesChoiceObj.value.selected);
    return quesChoiceObj.value.selected;
  }

  submitForm() {
    const formData = this.patientQuestionnaireForm.value;

    if (formData.id) {
      this.questionarieService.updatePatientQuestionnaire(formData).then(
        () => {
          this.toastService.success(
            'Patient questionnaire updated successfully.'
          );
          this.backToDashboard();
        },
        () => {
          this.toastService.error('Unable to save the Patient questionnaire.');
        }
      );
    } else {
      this.questionarieService.createPatientQuestionnaire(formData).then(
        () => {
          this.toastService.success(
            'Patient questionnaire updated successfully.'
          );
          this.backToDashboard();
        },
        () => {
          this.toastService.error('Unable to save the Patient questionnaire.');
        }
      );
    }
  }

  backToDashboard = () => {
    this.router.navigate(['/patient-portal/patient/dashboard'], {
      queryParams: { source: 'questionarie' }
    });
  };
}
