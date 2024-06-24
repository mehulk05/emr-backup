import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { AlServiceService } from '../../services/al-service.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-ai-content',
  templateUrl: './ai-content.component.html',
  styleUrls: ['./ai-content.component.css']
})
export class AiContentComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<any>();
  @Input() aiContent: any;
  @Input() category: any;
  @Input() message: any;
  @Input() id: any;
  textAreaError: boolean = false;
  alData: any;
  commentValue: any;
  @Input() enteredValue: any;
  @ViewChild('commentInput') commentInput: ElementRef;
  loading = false;
  @Input() totalCharacterLength = 1000;
  agencyName = 'G99+';
  businessData: any;

  constructor(
    private alServiceService: AlServiceService,
    public formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.enteredValue = this.message;
    //this.getAlContent();
    const bdData: any = this.localStorageService.readStorage('businessData');
    this.businessData = bdData;
    if (this.businessData) {
      this.agencyName = this.businessData?.agency?.name ?? 'G99+';
    }
  }

  onEnteredValueChange(textValue: string): void {
    this.textAreaError = textValue.length === 0;
  }

  hideModal() {
    this.modalClosed.emit({ replace: false });
    this.showModal = false;
  }

  getAlContent() {
    if (!this.aiContent) {
      return;
    }
    this.loading = true;
    // this.alServiceService.getAiStream(
    //   this.aiContent,
    //   this.callBackUpdate,
    //   'data'
    // );
    this.alServiceService.getAiStreamText(this.aiContent).then(
      (data: any) => {
        this.alData = data['text'];
        this.loading = false;
      },
      (error) => {
        alert(error);
        this.loading = false;
      }
    );
  }

  callBackUpdate = (data: any) => {
    if (data == '') {
      this.loading = false;
    }
    this.updateArray(data);
  };

  generateMessage() {
    this.alData = '';
    this.aiContent = this.category + ':/n/n' + this.enteredValue;
    this.getAlContent();
  }

  updateArray(response: any) {
    if (this.alData && this.alData.length > 0) {
      this.alData = this.alData + response;
    } else {
      this.alData = response;
    }
    this.alData = this.alData.trimStart();
  }

  replace() {
    this.modalClosed.emit({
      close: true,
      replaceData: this.commentInput.nativeElement.value,
      replace: true
    });
    this.showModal = false;
  }
}
