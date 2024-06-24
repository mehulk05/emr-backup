import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatQuestionarieService } from '../../service/chat-questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-create-edit-question',
  templateUrl: './create-edit-question.component.html',
  styleUrls: ['./create-edit-question.component.css']
})
export class CreateEditQuestionComponent implements OnInit, OnChanges {
  @Input() showCreateEditModal: boolean = false;
  @Input() createEditModalData: any;
  @Input() modalMessage: any;
  @Output() createModalClosed = new EventEmitter<any>();
  chatQuestionForm: FormGroup;
  chatQuestionnaireId: any = null;
  isEdit = false;
  chatQuestion: any = null;
  constructor(
    public formBuilder: FormBuilder,
    private chatQuestionnaireService: ChatQuestionarieService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    console.log('createEditModalData', this.createEditModalData);
  }

  ngOnChanges() {
    this.chatQuestionnaireId = this.createEditModalData.chatQuestionnaireId;
    this.chatQuestion = this.createEditModalData.data;
    this.chatQuestionForm = this.formBuilder.group({
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]],
      referenceLink: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      id: ['', []]
    });

    if (this.chatQuestion.id != null) {
      this.chatQuestionForm.patchValue({
        question: this.chatQuestion.question,
        answer: this.chatQuestion.answer,
        referenceLink: this.chatQuestion.referenceLink,
        id: this.chatQuestion.id
      });
    }
  }

  get f() {
    return this.chatQuestionForm.controls;
  }

  hideModal() {
    this.createModalClosed.emit({ close: true, isCreate: false });
    this.showCreateEditModal = false;
  }

  submitForm() {
    if (this.chatQuestionForm.invalid) {
      return;
    }
    var formData = this.chatQuestionForm.value;
    this.chatQuestionnaireService
      .saveQuestion(this.chatQuestionnaireId, formData)
      .then(
        () => {
          this.isEdit
            ? this.alertService.success('Question updated successfully.')
            : this.alertService.success('Question added successfully.');
          this.hideModal();
        },
        () => {
          this.alertService.error('Unable to update question.');
        }
      );
  }
}
