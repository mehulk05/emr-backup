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
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ai-image',
  templateUrl: './ai-image.component.html',
  styleUrls: ['./ai-image.component.css']
})
export class AiImageComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<any>();
  @Output() getSelectedAiImage = new EventEmitter<any>();

  @Input() aiContent: any;
  @Input() category: any;
  @Input() message: any;
  @Input() id: any;
  alData: any[] = [];
  aiMessage = '';
  commentValue: any;
  @Input() enteredValue: any;
  @ViewChild('commentInput') commentInput: ElementRef;
  loading = false;
  @Input() totalCharacterLength = 1000;
  agencyName = 'G99+';
  businessData: any;
  imageSizeSelect: any = '256x256';
  aiForm: FormGroup;

  imageSize: any = [
    { name: '256x256', code: '256x256' },
    { name: '512x512', code: '512x512' },
    { name: '1024x1024', code: '1024x1024' }
  ];

  constructor(
    private alServiceService: AlServiceService,
    public formatTimeService: FormatTimeService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.enteredValue = this.message;
    //this.getAlContent();
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    this.businessData = bdData;
    if (this.businessData) {
      this.agencyName = this.businessData?.agency?.name ?? 'G99+';
    }
    this.aiForm = new FormGroup({
      aiText: new FormControl('', [Validators.required])
    });
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
    this.reFrameQuery();
  }

  reFrameQuery() {
    const content =
      'Please refine the following prompt for DALL-E in under 350 characters. \n ' +
      this.aiContent +
      ' My goal is to generate an efficient and specific prompt for DALL-E to create accurate images based on the given subject in a well-lit clinic background. Consider all possible scenarios while giving image options.';
    // this.alServiceService.getAiStream(
    //   content,
    //   this.callBackReFrameQueryUpdate,
    //   'data'
    // );

    this.alServiceService.getAiStreamText(content).then(
      (data: any) => {
        this.loading = false;
        this.callBackReFrameQueryUpdate(data['text']);
      },
      (error) => {
        alert(error);
        this.loading = false;
      }
    );
  }

  callBackReFrameQueryUpdate = (data: any) => {
    // if (data == '\n') {
    //   this.loading = true;
    //   this.alServiceService.getAiStreamImage(
    //     this.aiMessage,
    //     this.imageSizeSelect.name,
    //     4,
    //     this.callBackUpdate,
    //     'data'
    //   );
    // }
    // if (this.aiMessage && this.aiMessage.length > 0) {
    //   this.aiMessage = this.aiMessage + data;
    // } else {
    //   this.aiMessage = data;
    // }
    // this.aiMessage = this.aiMessage.trimStart();
    this.loading = true;
    this.alServiceService
      .getAiStreamImageData(data, this.imageSizeSelect.name, 4)
      .then(
        (data: any) => {
          this.loading = false;
          this.alData = data;
        },
        (error) => {
          alert(error);
          this.loading = false;
        }
      );
  };

  callBackUpdate = (data: any) => {
    this.loading = false;
    console.log(data);
    this.alData = data;
  };

  generateMessage() {
    this.alData = [];
    this.aiContent = this.category + ':/n/n' + this.enteredValue;
    this.getAlContent();
  }

  replace() {
    this.modalClosed.emit({
      close: true,
      replaceData: this.commentInput.nativeElement.value,
      replace: true
    });
    this.showModal = false;
  }

  selectPage(library: any) {
    this.getSelectedAiImage.emit(library);
  }
}
