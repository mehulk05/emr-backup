export class ChatMessage {
  mdid: string;
  displayName: string;
  contentType: string;
  content: string;
  messageBy: string;
  buttons: [];
  hideButtons: boolean;

  constructor() {
    this.mdid = 'msg' + new Date().getTime();
    this.hideButtons = false;
  }

  create(
    displayName: string,
    contentType: string,
    content: string,
    buttons: any
  ) {
    this.displayName = displayName;
    this.contentType = contentType;
    this.content = content;
    this.buttons = buttons;
    return this;
  }

  isBot() {
    return (
      this.displayName != null &&
      (this.displayName == 'BOT' || this.displayName == 'Bot')
    );
  }

  isContentType(contentType: string) {
    return this.contentType != null && this.contentType == contentType;
  }

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }
}
