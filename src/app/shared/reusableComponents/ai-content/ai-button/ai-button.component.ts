import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-ai-button',
  templateUrl: './ai-button.component.html',
  styleUrls: ['./ai-button.component.css']
})
export class AiButtonComponent {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<any>();
  @Input() aiContent: any;
  @Input() category: any;
  @Input() message: any;
  @Input() totalCharacterLength = 1000;

  constructor(private toastMessageService: ToasTMessageService) {}

  generatedAlContent() {
    // if (this.message == null || this.message.length < 1) {
    //   this.toastMessageService.error('Please add content');
    //   return;
    // }
    this.category = this.category;
    this.message = this.message;
    this.showModal = true;
  }

  aiModelClose(event: any) {
    this.modalClosed.emit(event);
    this.showModal = false;
  }
}
