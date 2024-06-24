import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild
} from '@angular/core';
import { ToasTMessageService } from '../../services/toast-message.service';
import moment from 'moment';
import { AlServiceService } from '../../services/al-service.service';

@Component({
  selector: 'app-two-way-text-chat',
  templateUrl: './two-way-text-chat.component.html',
  styleUrls: ['./two-way-text-chat.component.css']
})
export class TwoWayTextChatComponent implements OnChanges {
  @Input() isLoading = false;
  @ViewChild('chatInnerPanel') chatInnerPanel: ElementRef;
  @ViewChild('chatStatusDropdown') chatStatusDropdown: ElementRef;
  @Input() currentIndex: any;
  @Input() chat: any[] = [];
  @Input() chatStatus: string = 'OPEN';
  @Input() leadFullName: string = '';
  @Input() businessName: string;
  @Input() enableTwoWayAiAutoSuggestion = false;
  @Input() communication = '';
  @Output() sendCustomSms: EventEmitter<string> = new EventEmitter();
  @Output() showTemplatesDialog: EventEmitter<boolean> = new EventEmitter();
  @Output() chatStatusChange: EventEmitter<string> = new EventEmitter();
  @Input() showSearch = true;
  @Input() showArrow = true;
  @Input() fromLeadPage = false;
  @Input() leadPhoneNumber: string = '';
  @Input() businessNumber: string = '';
  @Input() isTwilioEnabled: boolean = false;
  @Input() sourceId: any;
  chatRows: any[] = [];
  filteredChatRows: any[] = [];
  firstName: any;
  lastName: any;
  @Input() messageBody: string = '';
  @Output() messageBodyChange: EventEmitter<any> = new EventEmitter();
  showAiModal: boolean = false;
  totalCharacterLength: number = 160;
  category =
    "You're an experienced content writer at a reputed consulting firm. Your job is to rewrite the following message in a GSM7 compliant format preferably under 160 characters. If you think that keeping the 160 character limit would restrict you from doing proper writing, you can choose to go to a maximum of 306 characters only. But your goal should be to keep it as concise as possible without eliminating any information from the message. The 306 character limit should not be breached under any circumstances";
  activeTab: string = 'Message';
  isChatStatusDropDownOpen = false;
  searchCount = 0;
  currentSearchIndex = 0;
  chatSearchText: string = '';
  alData = '';
  loading = false;
  numberOfSegemnts: number = 0;
  changeBanners: any = [];
  constructor(
    private toastService: ToasTMessageService,
    private alServiceService: AlServiceService
  ) {}

  ngOnChanges(): void {
    if (this.chat && this.chat.length > 0) {
      const tempChat = [];
      for (let i = 0; i < this.chat.length; i++) {
        if (
          i == 0 ||
          !this.isDaySame(
            this.chat[i].createdDateTime,
            this.chat[i - 1].createdDateTime
          )
        ) {
          tempChat.push({
            type: 'date',
            value: moment(this.chat[i].createdDateTime).format('DD MMM yyyy')
          });
        }
        if (this.chat[i].message) {
          this.chat[i].message = this.chat[i].message.replace(/\n/g, '<br/>');
        }
        tempChat.push({ type: 'message', value: this.chat[i] });
      }
      this.chatRows = [...tempChat];
      this.filteredChatRows = [...tempChat];
      this.isChatStatusDropDownOpen = false;
      this.searchCount = 0;
      this.currentSearchIndex = 0;
      this.chatSearchText = '';
      this.checkForReceiverNumberChange();
      // this.messageBody = '';
      //this.generateMessage();
      setTimeout(() => {
        (this.chatInnerPanel.nativeElement as HTMLElement).scrollTo({
          behavior: 'smooth',
          top: (this.chatInnerPanel.nativeElement as HTMLElement).scrollHeight
        });
      }, 0);
    } else {
      this.chatRows = [];
      this.filteredChatRows = [];
      this.isChatStatusDropDownOpen = false;
      this.searchCount = 0;
      this.currentSearchIndex = 0;
      this.chatSearchText = '';
    }
  }

  isDaySame(date1: string, date2: string) {
    return moment(moment(date1).format('yyyy-MM-DD')).isSame(
      moment(moment(date2).format('yyyy-MM-DD'))
    );
  }

  sendSmsCustom() {
    if (this.messageBody?.length > 0) {
      console.log(this.messageBody);
      this.sendCustomSms.emit(this.messageBody);
    }
  }

  showTemplates() {
    this.activeTab = 'Templates';
    this.showTemplatesDialog.emit(true);
  }

  showAIDialog() {
    // if (this.messageBody?.length === 0) {
    //   this.toastService.error('Please add message body!');
    //   return;
    // }
    this.showAiModal = true;
  }

  aiModelClose(e: any) {
    this.showAiModal = false;
    if (e?.replace) {
      this.messageBody = e.replaceData;
      this.messageBodyChanged();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hideTemplateDialog(e: any) {
    this.activeTab = 'Message';
    // this.messageBody = e;
  }

  setMessageBody(e: any) {
    this.messageBody = e;
    this.messageBodyChanged();
  }

  toggleChatStatusDropDown() {
    this.isChatStatusDropDownOpen = !this.isChatStatusDropDownOpen;
    if (this.isChatStatusDropDownOpen) {
      setTimeout(() => {
        this.chatStatusDropdown.nativeElement.focus();
      }, 0);
    }
  }

  setChatStatus(status: string) {
    this.toggleChatStatusDropDown();
    this.chatStatusChange.emit(status);
  }

  filterChat(e: any) {
    const searchText = e.target?.value ?? '';
    let searchCount = 0;
    if (searchText) {
      const chats = this.chatRows.map((row) => {
        if (row.type === 'date') return row;

        if (
          row.type === 'message' &&
          row.value.message?.toLowerCase().includes(searchText.toLowerCase())
        ) {
          const ind = row.value.message
            .toLowerCase()
            .indexOf(searchText.toLowerCase());
          const value =
            row.value.message.slice(0, ind) +
            `<span id='chat-search-text-${++searchCount}' class='chat-filter-highlight'><span class='chat-filter-text'>${row.value.message.slice(
              ind,
              ind + searchText.length
            )}</span></span>` +
            row.value.message.slice(ind + searchText.length);
          return {
            ...row,
            value: {
              ...row.value,
              message: value
            }
          };
        }
        return row;
      });
      this.filteredChatRows = [...chats];
    } else {
      this.filteredChatRows = [...this.chatRows];
    }
    this.searchCount = searchCount;
    this.checkForReceiverNumberChange();
  }

  searchTextNext() {
    if (this.currentSearchIndex + 1 <= this.searchCount) {
      const prevEl = document.getElementById(
        `chat-search-text-${this.currentSearchIndex}`
      );
      if (prevEl) {
        prevEl.classList.remove('active');
      }
      const el = document.getElementById(
        `chat-search-text-${++this.currentSearchIndex}`
      );
      if (el) {
        el.classList.add('active');
        const scrollHeight =
          el.getBoundingClientRect().top -
          this.chatInnerPanel.nativeElement.getBoundingClientRect().top -
          el.getBoundingClientRect().height -
          40;
        (this.chatInnerPanel.nativeElement as HTMLElement).scrollBy({
          behavior: 'smooth',
          top: scrollHeight
        });
      }
    }
  }

  searchTextPrev() {
    if (this.currentSearchIndex - 1 > 0) {
      const prevEl = document.getElementById(
        `chat-search-text-${this.currentSearchIndex}`
      );
      if (prevEl) {
        prevEl.classList.remove('active');
      }
      const el = document.getElementById(
        `chat-search-text-${--this.currentSearchIndex}`
      );
      if (el) {
        el.classList.add('active');
        const scrollHeight =
          el.getBoundingClientRect().bottom -
          this.chatInnerPanel.nativeElement.getBoundingClientRect().bottom +
          el.getBoundingClientRect().height +
          50;
        (this.chatInnerPanel.nativeElement as HTMLElement).scrollBy({
          behavior: 'smooth',
          top: scrollHeight
        });
      }
    }
  }

  getAlContent(chatContent: any) {
    this.loading = true;
    this.alServiceService.getAiStream(chatContent, this.callBackUpdate, 'data');
  }

  callBackUpdate = (data: any, type: any) => {
    if (data == '') {
      this.loading = false;
    }
    this.updateArray(data, type);
  };

  generateMessage() {
    if (this.communication === 'two way' && this.enableTwoWayAiAutoSuggestion) {
      let alRequest = '';
      this.chat.forEach((chat: any) => {
        if (alRequest.length > 0) {
          alRequest = alRequest + ' \n';
        }
        if (chat.direction == 'outgoing') {
          alRequest = alRequest + 'you:' + chat.message;
        } else {
          alRequest = alRequest + 'Friend:' + chat.message;
        }
      });
      this.getAlContent(alRequest);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateArray(response: any, value: any) {
    if (this.alData && this.alData.length > 0) {
      this.alData = this.alData + response;
    } else {
      this.alData = response;
    }
    this.alData = this.alData.trimStart().replace('you:', '');
    this.messageBody = this.alData;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chatStatusBlurDropDown(e: any) {
    this.isChatStatusDropDownOpen = false;
  }

  messageBodyChanged() {
    this.numberOfSegemnts = this.calculateSegments(this.messageBody);
  }

  calculateSegments(text: string) {
    let segments: number = 0;
    const charCount = text?.length || 0;
    if (charCount === 0) {
      return 0;
    }
    const bodyCharSet = new Set(text.split(''));
    const bodyCharArray = Array.from(bodyCharSet);
    const notGsm = this.containerAnyNonGsmChars(bodyCharArray);
    if (notGsm) {
      segments = charCount <= 70 ? 1 : Math.ceil(charCount / 67);
    } else {
      segments = charCount <= 160 ? 1 : Math.ceil(charCount / 153);
    }
    return segments;
  }

  containerAnyNonGsmChars(arr: string[]) {
    for (const a of arr) {
      if (!this.GSM_CODEPOINTS.has(a.codePointAt(0))) {
        return true;
      }
    }
    return false;
  }

  GSM_CODEPOINTS: Set<number> = new Set([
    0x000a, 0x000c, 0x000d, 0x0020, 0x0021, 0x0022, 0x0023, 0x0024, 0x0025,
    0x0026, 0x0027, 0x0028, 0x0029, 0x002a, 0x002b, 0x002c, 0x002d, 0x002e,
    0x002f, 0x0030, 0x0031, 0x0032, 0x0033, 0x0034, 0x0035, 0x0036, 0x0037,
    0x0038, 0x0039, 0x003a, 0x003b, 0x003c, 0x003d, 0x003e, 0x003f, 0x0040,
    0x0041, 0x0042, 0x0043, 0x0044, 0x0045, 0x0046, 0x0047, 0x0048, 0x0049,
    0x004a, 0x004b, 0x004c, 0x004d, 0x004e, 0x004f, 0x0050, 0x0051, 0x0052,
    0x0053, 0x0054, 0x0055, 0x0056, 0x0057, 0x0058, 0x0059, 0x005a, 0x005b,
    0x005c, 0x005d, 0x005e, 0x005f, 0x0061, 0x0062, 0x0063, 0x0064, 0x0065,
    0x0066, 0x0067, 0x0068, 0x0069, 0x006a, 0x006b, 0x006c, 0x006d, 0x006e,
    0x006f, 0x0070, 0x0071, 0x0072, 0x0073, 0x0074, 0x0075, 0x0076, 0x0077,
    0x0078, 0x0079, 0x007a, 0x007b, 0x007c, 0x007d, 0x007e, 0x00a1, 0x00a3,
    0x00a4, 0x00a5, 0x00a7, 0x00bf, 0x00c4, 0x00c5, 0x00c6, 0x00c9, 0x00d1,
    0x00d6, 0x00d8, 0x00dc, 0x00df, 0x00e0, 0x00e4, 0x00e5, 0x00e6, 0x00c7,
    0x00e8, 0x00e9, 0x00ec, 0x00f1, 0x00f2, 0x00f6, 0x00f8, 0x00f9, 0x00fc,
    0x0393, 0x0394, 0x0398, 0x039b, 0x039e, 0x03a0, 0x03a3, 0x03a6, 0x03a8,
    0x03a9, 0x20ac
  ]);

  onKeydown(e: any) {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    if (this.messageBody?.trim().length) {
      this.sendSmsCustom();
    }
  }

  isPhoneChanged(index: number): boolean {
    if (index < this.filteredChatRows.length - 1) {
      const currentMessage = this.filteredChatRows[index];
      const nextMessage = this.filteredChatRows[index + 1];

      if (
        currentMessage &&
        nextMessage &&
        currentMessage.direction === 'outgoing' &&
        nextMessage.direction === 'outgoing'
      ) {
        return currentMessage.receiverNumber !== nextMessage.receiverNumber;
      }
    }

    return false;
  }

  checkForReceiverNumberChange() {
    if (this.filteredChatRows.length === 0) {
      return; // No messages to process
    }
    this.changeBanners = [];
    const incomingRow = this.filteredChatRows.find(
      (row) => row.type === 'message' && row.value.direction === 'incoming'
    );
    const outgoingRow = this.filteredChatRows.find(
      (row) => row.type === 'message' && row.value.direction === 'outgoing'
    );

    let previousReceiverNumber = incomingRow
      ? incomingRow.value?.senderNumber
      : outgoingRow.value?.receiverNumber;
    for (let i = 0; i < this.filteredChatRows.length; i++) {
      const row = this.filteredChatRows[i];

      if (row.type === 'message' && row.value?.direction === 'outgoing') {
        const currentReceiverNumber = row.value.receiverNumber;

        if (
          currentReceiverNumber !== previousReceiverNumber &&
          !this.isChangeBannerPresent(
            previousReceiverNumber,
            currentReceiverNumber
          )
        ) {
          const changeBanner = {
            from: previousReceiverNumber,
            to: currentReceiverNumber,
            index: i
          };

          this.changeBanners.push(changeBanner);
          previousReceiverNumber = currentReceiverNumber;
        }
      }
      console.log(this.changeBanners);
    }
  }

  isChangeBannerPresent(from: string, to: string): boolean {
    return this.changeBanners.some(
      (banner: any) => banner.from === from && banner.to === to
    );
  }
}
