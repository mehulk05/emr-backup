import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { flatMap, isEqual } from 'lodash';
import { Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';
import { SmsService } from 'src/app/modules/marketing/sms-template/services/sms.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { getSidebarData } from 'src/app/shared/store-management/store/general-states/general-state.selector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-quick-link-icon-v1',
  templateUrl: './quick-link-icon-v1.component.html',
  styleUrls: ['./quick-link-icon-v1.component.css']
})
export class QuickLinkIconV1Component implements OnInit, OnDestroy {
  quickLinkUrl: any;
  notificationEnabled: boolean = false;
  unreadSmsCount: number;
  unreadSmsTimer: any;
  isTimerLoading: boolean = false;

  subscription = new Subscription();

  availableQuickLinkObj: any = {};
  sidebarData: any;
  currentUserInfo: any;
  chatbotUrl: string;
  twoWayTextLink: string;
  constructor(
    private currentUserService: currentUserService,
    private localStorageService: LocalStorageService,
    private smsService: SmsService,
    private store: Store
  ) {}
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription.add(
      combineLatest(
        this.currentUserService.headerSidebarExtraInfo.pipe(
          filter((results) => results !== null)
        ),
        this.store
          .select(getSidebarData)
          .pipe(filter((results) => results !== null))
      )
        .pipe(distinctUntilChanged(isEqual))
        .subscribe(async ([headerInfo, sideBarInfo]: any) => {
          this.sidebarData = sideBarInfo;
          const chatbotUrl = await this.getChatbotUrl(headerInfo.headerMenu);
          headerInfo.headerMenu.chatbotUrl = chatbotUrl;
          this.quickLinkUrl = headerInfo.headerMenu;
          console.log(headerInfo, sideBarInfo);
          this.getQuickLinksByBusinessID();
        })
    );
    this.getSmsCountEvery60Seconds();
  }

  getChatbotUrl(response: any) {
    const chatBotDiv = response.chatBotDiv;
    const businessIdMatch = chatBotDiv.match(/business\/(\d+)/);
    const composerMatch = chatBotDiv.match(/\/chat(\d+)/);

    if (businessIdMatch && composerMatch) {
      const businessId = businessIdMatch[1];

      // Creating the chatbot URL
      return `${environment.CHAT_BOT_DOMAIN}/assets/composer.html?bid=${businessId}`;
    }
    return null;
  }

  getSmsCountEvery60Seconds() {
    this.subscription.add(
      this.smsService.unreadSmsCountSubject
        .pipe(distinctUntilChanged(isEqual))
        .subscribe((unreadCount: number) => {
          this.unreadSmsCount = unreadCount ? unreadCount : 0;
        })
    );
    this.notificationEnabled =
      this.localStorageService.readStorage('businessInfo')?.getTwilioNumber ??
      false;
    this.loadUnreadSmsCount();
    if (this.notificationEnabled) {
      this.twoWayTextLink = `${environment.NEW_UI_DOMAIN}/two-way-text/message-center?source=quick-link&filter=Unread`;
      this.refreshUnreadSmsCount();
    } else {
      this.twoWayTextLink = `${environment.NEW_UI_DOMAIN}/two-way-text`;
    }
  }

  loadUnreadSmsCount() {
    this.isTimerLoading = true;
    this.smsService
      .getReadUnreadSmsCount()
      .then((response: any) => {
        this.isTimerLoading = false;
        const unreadSmsCount = response?.unreadCount ? response.unreadCount : 0;
        this.smsService.emitUnreadSmsCount(unreadSmsCount);
      })
      .catch(() => {
        clearInterval(this.unreadSmsTimer);
      });
  }

  getQuickLinksByBusinessID() {
    const flattenedData = flatMap(this.sidebarData, (obj: any) => {
      return [
        {
          routerLink: obj?.routerLink
        },
        ...obj.items,
        ...flatMap(obj?.groupItems, (subObj) => subObj.items)
      ];
    });

    const user = this.localStorageService.readStorage('currentUser');
    this.currentUserInfo = user;
    console.log(user);
    if (user?.id) {
      for (const entry of flattenedData) {
        if (
          entry.routerLink == '/leads' ||
          entry.routerLink ==
            '/clinical-doc/questionnaire/0/lead-capture-form' ||
          entry.routerLink == '/form-builder' ||
          entry.routerLink == '/clinical-doc/questionnaire'
        ) {
          this.availableQuickLinkObj.isContactFormUrl = true;
        } else if (entry.routerLink == '/vc/symptoms/compose') {
          this.availableQuickLinkObj.isVCUrl = true;
        } else if (
          entry.routerLink == '/appointment/calendar' ||
          entry.routerLink == '/appointment/booking-history' ||
          entry.routerLink == '/appointment/calendar'
        ) {
          this.availableQuickLinkObj.isBookingUrl = true;
          this.availableQuickLinkObj.isproviderUrl = true;
        } else if (
          entry.routerLink == '/chat/chat-config' ||
          entry.routerLink == '/chat/chat-sessions' ||
          entry.routerLink == '/chat/chat-unanswered-questions'
        ) {
          this.availableQuickLinkObj.ischatBotUrl = true;
        }
      }
    }

    if (user.roles && user.roles === 'Patient') {
      this.availableQuickLinkObj.isBookingUrl = true;
      this.availableQuickLinkObj.ischatBotUrl = true;
      this.availableQuickLinkObj.isContactFormUrl = true;
      this.availableQuickLinkObj.isVCUrl = true;
    }
  }

  refreshUnreadSmsCount() {
    this.unreadSmsTimer = setInterval(() => {
      if (!this.isTimerLoading) {
        this.loadUnreadSmsCount();
      }
    }, 60000);
  }
}
