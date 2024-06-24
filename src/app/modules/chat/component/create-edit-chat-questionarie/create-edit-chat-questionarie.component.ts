import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatQuestionarieService } from '../../service/chat-questionarie.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-create-edit-chat-questionarie',
  templateUrl: './create-edit-chat-questionarie.component.html',
  styleUrls: ['./create-edit-chat-questionarie.component.css']
})
export class CreateEditChatQuestionarieComponent implements OnInit {
  questionnaireForm: FormGroup;
  chatQuestionnaireId: any = null;
  previousUrl: any;
  constructor(
    public formBuilder: FormBuilder,
    private chatQuestionaireService: ChatQuestionarieService,
    private alertService: ToasTMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public location: Location
  ) {
    router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log('prev:', event.url);
        this.previousUrl = event.url;
      });
  }

  ngOnInit() {
    this.questionnaireForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    });
    this.activatedRoute.params.subscribe((routeParams) => {
      this.chatQuestionnaireId = routeParams.chatQuestionnaireId;
      if (this.chatQuestionnaireId != null) {
        this.loadChatQuestionnaire();
      }
    });
  }

  get f() {
    return this.questionnaireForm.controls;
  }

  loadChatQuestionnaire() {
    console.log('chat', this.chatQuestionnaireId);
    this.chatQuestionaireService
      .getChatQuestionnaire(this.chatQuestionnaireId)
      .then(
        (response: any) => {
          this.questionnaireForm.patchValue({
            name: response.name
          });
        },
        () => {
          this.alertService.error('Unable to load the questionnaire.');
        }
      );
  }

  submitForm = () => {
    if (this.questionnaireForm.invalid) {
      return;
    }
    const formData = this.questionnaireForm.value;
    if (this.chatQuestionnaireId) {
      this.chatQuestionaireService
        .updateChatQuestionnaire(this.chatQuestionnaireId, formData)
        .then(
          () => {
            this.alertService.success(
              'Chat questionnaire updated successfully.'
            );
          },
          () => {
            this.alertService.error('Unable to save the questionnaire.');
          }
        );
    } else {
      this.chatQuestionaireService.createChatQuestionnaire(formData).then(
        (response: any) => {
          this.alertService.success('Chat questionnaire saved successfully.');
          this.router.navigate([
            '/chat/chat-questionnaire/' + response.id + '/edit'
          ]);
        },
        () => {
          this.alertService.error('Unable to save the questionnaire.');
        }
      );
    }
  };

  backToChatConfig() {
    this.router.navigate(['chat', 'chat-config'], {
      queryParams: {
        source: 'chat-questionarie'
      },
      queryParamsHandling: 'merge'
    });
    //this.router.navigate(['/chat/chat-config?source=chat-questionarie']);
    //console.log('prevvvv', this.previousUrl);
    //this.location.back();
  }
}
