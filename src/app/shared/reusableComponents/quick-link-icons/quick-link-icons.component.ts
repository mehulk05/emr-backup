import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { flatMap, isEqual } from 'lodash';
import { Subscription, combineLatest } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from '../../services/local-storage.service';
import { RolesService } from '../../services/roles.service';
import {
  getQuickLinkProviderId,
  getSelectedClinicSelector,
  getSidebarData
} from '../../store-management/store/general-states/general-state.selector';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';
import { User } from '../../models/user/user';
import { SmsService } from 'src/app/modules/marketing/sms-template/services/sms.service';
import {
  SetDefaultChatBot,
  SetUsersQuickLink
} from '../../store-management/store/general-states/general-state.action';

@Component({
  selector: 'app-quick-link-icons',
  templateUrl: './quick-link-icons.component.html',
  styleUrls: ['./quick-link-icons.component.css']
})
export class QuickLinkIconsComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  clinicUrl: any;
  urlObj: any = {
    chatBotUrl: ''
  };
  providerUrl: string;
  chatBotUrl: string;
  bid: any;
  hideProvider: any;
  providerId: any;
  providerInfo: any;
  reviewUrl: any;
  notificationEnabled: boolean = false;
  isProviderBaseAppt: boolean;
  virtualConsultationUrl: string = '';
  myWebsiteUrl: any;
  defaultClinic: any;
  sidebarData: any;
  currentUserSubcription: any;
  currentUserInfo!: User;

  isBookingUrl: boolean = false;
  ischatBotUrl: boolean = false;
  isMywebsiteUrl: boolean = false;
  isproviderUrl: boolean = false;
  isVCUrl: boolean = false;
  isContactFormUrl: boolean = false;
  isReviewUrl: boolean = false;
  unreadSmsCount: number;
  unreadSmsTimer: any;
  isTimerLoading: boolean = false;
  constructor(
    private localStorageService: LocalStorageService,
    private roleService: RolesService,
    private currentUserService: currentUserService,
    private store: Store,
    private smsService: SmsService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.subscription.add(
        combineLatest([
          this.store.select(getSidebarData),
          this.currentUserService.currentUserSubject
        ])
          .pipe(
            distinctUntilChanged(isEqual) // Use the isEqual function from lodash
          )
          .subscribe(([sidebarData, currentUserInfo]) => {
            console.log(sidebarData, currentUserInfo);
            this.sidebarData = sidebarData;
            this.currentUserInfo = currentUserInfo;
            console.log(this.currentUserInfo);
            if (this.sidebarData && this.currentUserInfo) {
              this.bid = this.currentUserInfo.businessId;
              this.getClinicInfo();
              this.getQuickLinks(this.bid);
              this.getDefaultChatbot();
            }
          })
      );

      this.subscription.add(
        this.store
          .select(getQuickLinkProviderId)
          .pipe(distinctUntilChanged(isEqual))
          .subscribe((providerInfo) => {
            this.providerInfo = null;
            const userData =
              this.localStorageService.readStorage('currentUser');
            if (providerInfo && providerInfo !== 0) {
              this.loadProviderInfo(providerInfo);

              this.providerId = providerInfo;
            } else if (
              userData?.roles === 'G_SUPPORT_USER' ||
              userData?.supportUser
            ) {
              this.hideProvider = true;
            } else {
              this.loadProviderInfo(userData?.id);
            }
          })
      );

      this.subscription.add(
        this.smsService.unreadSmsCountSubject
          .pipe(distinctUntilChanged(isEqual))
          .subscribe((unreadCount: number) => {
            this.unreadSmsCount = unreadCount ? unreadCount : 0;
          })
      );
      this.notificationEnabled =
        this.localStorageService.readStorage('businessData')?.getTwilioNumber ??
        false;
      this.loadUnreadSmsCount();
      if (this.notificationEnabled) {
        this.refreshUnreadSmsCount();
      }
      this.urlObj =
        this.localStorageService.readStorage('defaultQuickLinks') ?? {};

      this.getClinicInfoFromState();
    }, 4000);
  }

  ngOnDestroy(): void {
    clearInterval(this.unreadSmsTimer);
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

  refreshUnreadSmsCount() {
    this.unreadSmsTimer = setInterval(() => {
      if (!this.isTimerLoading) {
        this.loadUnreadSmsCount();
      }
    }, 60000);
  }

  async getQuickLinks(bid: any) {
    const userId = this.localStorageService.readStorage('currentUser')?.id;
    this.defaultClinic = this.localStorageService.readStorage('defaultClinic');
    if (userId && bid) {
      try {
        const [usersData, businessData]: any = await Promise.all([
          this.roleService.getQuickLinks(userId),
          this.roleService.getDefaultQuickLinks(bid)
        ]);

        // this.urlObj = data;
        this.virtualConsultationUrl = usersData?.virtualConsultationUrl;
        this.myWebsiteUrl =
          usersData?.myWebsiteUrl ?? this.defaultClinic?.website;
        this.setProviderUrl(usersData?.userBookingUrl);

        this.urlObj = businessData;
        this.clinicUrl = businessData?.appointmentUrl;
        this.reviewUrl = businessData?.clinicReviewUrl ?? '';
        this.myWebsiteUrl = businessData?.myWebsiteUrl;
        this.localStorageService.storeItem('defaultQuickLinks', this.urlObj);
        const usersLink = { usersLink: usersData, businessLink: businessData };
        this.store.dispatch(new SetUsersQuickLink(usersLink));
        this.getQuickLinksByBusinessID();
      } catch (error) {
        console.error('Error fetching quick links:', error);
      }
    }
  }

  getQuickLinksByBusinessID() {
    const flattenedData = flatMap(this.sidebarData, (obj) => {
      return [
        {
          routerLink: obj?.routerLink
        },
        ...obj.items,
        ...flatMap(obj?.groupItems, (subObj) => subObj.items)
      ];
    });

    const userId = this.localStorageService.readStorage('currentUser')?.id;

    if (userId) {
      for (const entry of flattenedData) {
        if (
          entry.routerLink == '/leads' ||
          entry.routerLink ==
            '/clinical-doc/questionnaire/0/lead-capture-form' ||
          entry.routerLink == '/form-builder' ||
          entry.routerLink == '/clinical-doc/questionnaire'
        ) {
          this.isContactFormUrl = true;
        } else if (entry.routerLink == '/vc/symptoms/compose') {
          this.isVCUrl = true;
        } else if (
          entry.routerLink == '/appointment/calendar' ||
          entry.routerLink == '/appointment/booking-history' ||
          entry.routerLink == '/appointment/calendar'
        ) {
          this.isBookingUrl = true;
          this.isproviderUrl = true;
        } else if (
          entry.routerLink == '/chat/chat-config' ||
          entry.routerLink == '/chat/chat-sessions' ||
          entry.routerLink == '/chat/chat-unanswered-questions'
        ) {
          this.ischatBotUrl = true;
        }
      }
    }

    if (
      this.currentUserInfo.roles &&
      this.currentUserInfo.roles === 'Patient'
    ) {
      this.isBookingUrl = true;
      this.ischatBotUrl = true;
      this.isContactFormUrl = true;
      this.isVCUrl = true;
    }
  }

  setProviderUrl(url: any) {
    this.providerUrl = url;
  }

  async loadProviderInfo(id: any) {
    console.log(
      '284',
      id,
      this.localStorageService.readStorage('providerInfo')
    );
    const providerInfo = this.localStorageService.readStorage('providerInfo');
    if (providerInfo) {
      this.providerInfo =
        this.localStorageService.readStorage('providerInfo')[id];
    }
    console.log(this.providerInfo);
    if (!this.providerInfo) {
      this.providerInfo = await this.roleService.getOptimziedUser(id);
    }
    this.hideProvider = !this.providerInfo?.isProvider;
  }

  async getDefaultChatbot() {
    const chatbotUrl = localStorage.getItem('defaultChatbot');
    if (!chatbotUrl) {
      const data: any = await this.roleService.getDefaultChatbot(this.bid);
      this.chatBotUrl =
        environment.CHAT_BOT_DOMAIN +
        '/assets/composer' +
        data.chatBotId +
        '.html?bid=' +
        this.bid;
      this.localStorageService.storeItem('defaultChatbot', this.chatBotUrl);
    } else {
      this.chatBotUrl = chatbotUrl;
    }
    this.store.dispatch(new SetDefaultChatBot(this.chatBotUrl));
  }

  getClinicInfoFromState() {
    this.store
      .select(getSelectedClinicSelector)
      .pipe(distinctUntilChanged(isEqual))
      .subscribe((data) => {
        if (data) {
          this.isProviderBaseAppt = !data?.isProviderBasedAppointment;
        }
      });
  }

  getClinicInfo() {
    const clinicInfo = this.localStorageService.readStorage('defaultClinic');
    if (clinicInfo) {
      this.isProviderBaseAppt = !clinicInfo?.isProviderBasedAppointment;
    }
    this.roleService.getDefaultCinicOptimized().then((data: any) => {
      this.localStorageService.storeItem('defaultClinic', data);
      this.isProviderBaseAppt = !data?.isProviderBasedAppointment;
    });
  }
}
