export const GET_BUSINESS_INFO = '[G99 General] Get Business Info';
export const SET_PUBLIC_CLINIC = '[G99 General] Set Public Clinic';
export const SET_PUBLIC_USER_ID = '[G99 General] Set Public User ID';
export const SET_APPOINTMENT_DATA = '[G99 General] Set Appointment Data';
export const SET_SIDEBAR_DATA = '[G99 General] Set Sidebar Data';
export const SET_BUSINESS_DATA = '[G99 General] Set Business Data';
export const SET_USER_QUICK_LINK = '[G99 General] Set User Quick Link';
export const SET_DEFAULT_CHATBOT = '[G99 General] Set Default Chatbot';
export class GetBusinessInfo {
  static readonly type = GET_BUSINESS_INFO;
  constructor(public payload: { id: string | number }) {}
}

export class SetBusinessData {
  static readonly type = SET_BUSINESS_DATA;
  constructor(public payload: any) {}
}

export class SetPublicClinic {
  static readonly type = SET_PUBLIC_CLINIC;
  constructor(public payload: any) {}
}

export class SetPublicUserId {
  static readonly type = SET_PUBLIC_USER_ID;
  constructor(public payload: any) {}
}

export class SetAppointmentBookingData {
  static readonly type = SET_APPOINTMENT_DATA;
  constructor(public payload: any) {}
}

export class SetSideBarData {
  static readonly type = SET_SIDEBAR_DATA;
  constructor(public payload: any) {}
}

export class SetUsersQuickLink {
  static readonly type = SET_USER_QUICK_LINK;
  constructor(public payload: any) {}
}

export class SetDefaultChatBot {
  static readonly type = SET_DEFAULT_CHATBOT;
  constructor(public payload: any) {}
}
