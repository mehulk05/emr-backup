import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { QuestionarieService } from 'src/app/modules/pateint/services/questionarie.service';

@Component({
  selector: 'app-angular-form',
  templateUrl: './angular-form.component.html',
  styleUrls: ['./angular-form.component.css']
})
export class AngularFormComponent implements OnInit {
  questions: FormArray = new FormArray([]);
  form: FormGroup = new FormGroup({
    questions: this.questions
  });

  contactFormQuestions: any;

  constructor(
    private fb: FormBuilder,
    private questionarieService: QuestionarieService
  ) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  getControls() {
    return (this.form.get('questions') as FormArray).controls;
  }

  loadQuestions() {
    this.questionarieService.getQuestions(45778, 9244).then((response: any) => {
      const questionAns: any = response.patientQuestionAnswers.sort(
        (a: any, b: any) => a.id - b.id
      );
      this.contactFormQuestions = questionAns;
      this.addItems();
    });
  }

  addItems() {
    // this.contactFormQuestions.forEach((question: any) => {
    //   const control: FormControl = new FormControl('', [Validators.required, Validators.pattern(question.regex)]);
    //   this.form.push(control);
    // });
    for (const question of this.contactFormQuestions) {
      let control: FormControl;
      switch (question.questionType) {
        case 'Input':
          control = new FormControl('', [
            Validators.required,
            Validators.pattern(question.regex)
          ]);
          break;
        case 'Date':
          control = new FormControl('', Validators.required);
          break;
        case 'Multiple_Selection_Text':
          control = new FormControl('', Validators.required);
          break;
        default:
          control = new FormControl('');
      }
      this.questions.push(control);
    }

    console.log(this.form.get('items'));
  }

  setQuestionChoices(x: any) {
    const arr = new FormArray([]);
    //let arr = x.get("patientQuestionChoices") as FormArray;
    x.patientQuestionChoices.forEach((y: any) => {
      arr.push(
        this.fb.group({
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

  get itemsFormArray() {
    return this.form.get('items') as FormArray;
  }

  print(flag: any) {
    console.log(flag);
    console.log(this.getControls()[flag].get('c'));
  }
}
