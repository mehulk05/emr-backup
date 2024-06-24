import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngxs/store';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RolesService } from 'src/app/shared/services/roles.service';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quick-links',
  templateUrl: './quick-links.component.html',
  styleUrls: ['./quick-links.component.css']
})
export class QuickLinksComponent implements OnChanges, OnDestroy {
  @Input() quickLinkData: any;
  subscription = new Subscription();

  @Input() userId: any;
  @Input() businessId: any;
  @Input() isProvider: any;
  isProviderBaseAppt: boolean = true;
  chatBotUrl: string;
  constructor(
    private roleService: RolesService,
    private localStorageService: LocalStorageService,
    private store: Store
  ) {}
  // ngOnInit(): void {
  //   this.subscription.add(
  //     combineLatest([
  //       this.store.select(getUsersQuickLink),
  //       this.store.select(getDefaultChatbot)
  //     ])
  //       .pipe(distinctUntilChanged(isEqual))
  //       .subscribe(([quickLinks, defaultChatbot]) => {
  //         if (defaultChatbot) {
  //           this.getDefaultChatbot(defaultChatbot);
  //         }
  //         if (quickLinks?.usersLink) {
  //           this.getQuickLinks(quickLinks.usersLink);
  //         }
  //       })
  //   );
  // }
  ngOnChanges(): void {
    if (this.quickLinkData?.contactUrl) {
      // this.getClinicInfo();
      this.getChatBotData();
    }
  }

  async getChatBotData() {
    const chatbotUrl = localStorage.getItem('defaultChatbot');
    if (!chatbotUrl) {
      const data: any = await this.roleService.getDefaultChatbot(
        this.businessId
      );
      this.chatBotUrl =
        environment.CHAT_BOT_DOMAIN +
        '/assets/composer' +
        data.chatBotId +
        '.html?bid=' +
        this.businessId;
      this.localStorageService.storeItem('defaultChatbot', this.chatBotUrl);
    } else {
      this.chatBotUrl = chatbotUrl;
    }
    console.log(this.chatBotUrl);
  }

  // getQuickLinks(data: any) {
  //   if (data.myWebsiteUrl && data.myWebsiteUrl.startsWith('www')) {
  //     data.myWebsiteUrl = 'http://' + data.myWebsiteUrl;
  //   }
  //   this.quickLinkData = data;
  //   this.localStorageService.storeItem('quickLinks', this.quickLinkData);
  // }

  // getDefaultChatbot(chatbotUrl: string) {
  //   this.chatbotUrl = chatbotUrl;
  //   this.localStorageService.storeItem('defaultChatbot', this.chatbotUrl);
  // }

  // getClinicInfo() {
  //   const clinicInfo = this.localStorageService.readStorage('defaultClinic');

  //   console.log(clinicInfo);
  //   if (clinicInfo) {
  //     this.isProviderBaseAppt = !clinicInfo?.isProviderBasedAppointment;
  //   } else {
  //     this.roleService.getDefaultCinicOptimized().then((data: any) => {
  //       console.log(data);
  //       this.localStorageService.storeItem('defaultClinic', data);
  //       this.isProviderBaseAppt = !data?.isProviderBasedAppointment;
  //     });
  //   }
  // }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
