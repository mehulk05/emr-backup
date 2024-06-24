import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  ViewChild
} from '@angular/core';
import { QuestionarieService } from '../../services/questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-questionarie-builder',
  templateUrl: './questionarie-builder.component.html',
  styleUrls: ['./questionarie-builder.component.css']
})
export class QuestionarieBuilderComponent implements OnChanges {
  @ViewChild('scrollframe', { static: false }) scrollFrame: ElementRef;
  private scrollContainer: any;

  @Input() buisnessId: any;
  @Input() questionnaireId: any;
  @Input() isLeadCaptureForm: any;
  @Input() isLeadForm: any;
  @Input() enabledModernUi: any;
  questions: any[] = []; // all questions
  businessId = '';
  isChecked = '';
  constructor(
    private questionnaireService: QuestionarieService,
    private toastService: ToasTMessageService
  ) {}

  ngOnChanges(): void {
    if (this.questionnaireId) {
      this.loadQuestions();
    }
  }

  loadQuestions() {
    this.questionnaireService
      .getAllQuestionById(this.questionnaireId)
      .then((response: any) => {
        this.questions = response;
      });
  }

  addNewQuestion() {
    if (
      this.questions?.length > 0 &&
      !this.questions[this.questions.length - 1].id
    ) {
      this.toastService.error(
        'Please save the current question before adding a new one.'
      );
      return;
    }
    this.questions.push({
      name: '',
      type: 'Input',
      required: false,
      answer: '',
      questionOrder: this.questions.length + 1, // this may not be true
      id: null,
      allowMultipleSelection: false,
      allowLabelsDisplayWithImages: false,
      mode: 'Editing'
    });

    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    const el: HTMLElement = this.scrollFrame.nativeElement;
    const h = el.scrollHeight;
    setTimeout(() => {
      window.scrollTo({ top: h });
    }, 200);
  }
  deleteQuestion(event: any) {
    //console.log(event.questionId);
    console.log(this.questions);
    if (event.questionId == null) {
      this.questions = this.questions.filter((question: any) => {
        return question.id != null;
      });
      console.log(this.questions);
    } else {
      this.questionnaireService
        .deleteQuestion(this.questionnaireId, event.questionId)
        .then(() => {
          this.loadQuestions();
        });
    }
  }
  saveQuestion() {
    console.log('In save questions');
    this.loadQuestions();
  }

  drop(event: any) {
    //console.log("Drop Question =>", event.container.data, event.previousIndex, event.currentIndex);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const questionOrders: any = [];
    event.container.data.forEach((element: any, index: any) => {
      element.questionOrder = index;
      questionOrders.push({ questionId: element.id, order: index });
    });

    const form = { questionOrders: questionOrders };
    this.questionnaireService
      .updateQuestionnaireQuestionOrder(this.questionnaireId, form)
      .then(() => {
        this.loadQuestions();
      });
  }

  checkIsEditable(i: number) {
    return !(this.enabledModernUi && i == 0);
  }
}
