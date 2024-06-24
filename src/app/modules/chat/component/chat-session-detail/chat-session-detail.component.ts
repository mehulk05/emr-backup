import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage } from 'src/app/shared/models/chat-session/chat-message';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ChatSessionService } from '../../service/chat-session.service';

@Component({
  selector: 'app-chat-session-detail',
  templateUrl: './chat-session-detail.component.html',
  styleUrls: ['./chat-session-detail.component.css']
})
export class ChatSessionDetailComponent implements OnInit {
  chatSessionId: any = null;
  messages: any = [];
  constructor(
    private toastMessageService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private chatSessionService: ChatSessionService
  ) {}

  ngOnInit(): void {
    this.chatSessionId = this.activatedRoute.snapshot.params.chatSessionId;
    if (this.chatSessionId) {
      this.loadChatSessionMessages();
    }
  }

  formatWord(word: string) {
    if (word === 'chooseOption') {
      return 'Choose Option';
    } else {
      return word;
    }
  }

  loadChatSessionMessages() {
    this.chatSessionService.getChatSessionMessages(this.chatSessionId).then(
      (response: any) => {
        response.forEach((element: any) => {
          const parseJsonResponse = this.tryParseJSON(element.message);
          if (parseJsonResponse) {
            const msg: ChatMessage = new ChatMessage().create(
              this.getDisplayName(element.messageBy),
              'Card',
              parseJsonResponse.message,
              parseJsonResponse.payload
            );
            this.messages.push(msg);
            console.log('this message', this.messages);
          } else {
            const msg: ChatMessage = new ChatMessage().create(
              this.getDisplayName(element.messageBy),
              'Text',
              element.message,
              null
            );
            this.messages.push(msg);
          }
        });
      },
      () => {
        this.toastMessageService.error(
          'Unable to load the chat session messages.'
        );
      }
    );
  }

  getDisplayName(value: any) {
    if (value == 'Bot') {
      return 'BOT';
    } else {
      return 'USER';
    }
  }

  tryParseJSON(jsonString: any) {
    try {
      var o = JSON.parse(jsonString);
      if (o && typeof o === 'object') {
        return o;
      }
    } catch (e) {}
    return false;
  }

  goBack() {
    this.router.navigate(['/chat/chat-sessions']);
  }
}
