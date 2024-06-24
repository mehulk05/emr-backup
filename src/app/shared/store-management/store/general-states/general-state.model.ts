export class GeneralAppInfoStateModule {
  business?: any;
  tokenInfo?: any;
  publicBooking: any;
  quickLinkProviderId: number | string;
  appointmentBookingObj: any;
  sideBarData: any;
  usersQuickLink: any;
  defaultChatBot: any;
  constructor(obj: Partial<GeneralAppInfoStateModule>) {
    Object.assign(this, obj);
  }
}
