import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ChatConfigService } from '../../service/chat-config.service';

@Component({
  selector: 'app-chat-detail-tab',
  templateUrl: './chat-detail-tab.component.html',
  styleUrls: ['./chat-detail-tab.component.css']
})
export class ChatDetailTabComponent implements OnInit {
  selectedIndex: any = 0;
  sources = [
    'chatbot-customization',
    'chatbot-form-builder',
    'chatbot-template',
    'scarpe-website',
    'chat-questionarie'
  ];
  chatConfig: any;
  scrapeWeb: any;
  source: any = 'chatbot-customization';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private chatConfigService: ChatConfigService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.loadChatConfig();
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source;
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
  }

  loadChatConfig() {
    this.chatConfigService.getChatConfig().then(
      (response: any) => {
        this.chatConfig = response;
        this.scrapeWeb = response;
        this.chatConfig.iconUrl = response.iconUrl
          ? response.iconUrl
          : 'https://g99plus.b-cdn.net/Emr/Asset%203@1080x.png';
      },
      () => {
        this.alertService.error('Unable to load chat config.');
      }
    );
  }
  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['chat', 'chat-config'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }
}
