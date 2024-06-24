import {
  Action,
  NgxsAfterBootstrap,
  State,
  StateContext,
  Store
} from '@ngxs/store';
import { StateNaming } from '../../root.state';
import {
  GetBusinessInfo,
  SetAppointmentBookingData,
  SetBusinessData,
  SetDefaultChatBot,
  SetPublicClinic,
  SetPublicUserId,
  SetSideBarData,
  SetUsersQuickLink
} from './general-state.action';
import { GeneralAppInfoStateModule } from './general-state.model';
import { cloneDeep } from 'lodash';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { Injectable } from '@angular/core';

const getDefaultState = (): GeneralAppInfoStateModule => {
  return new GeneralAppInfoStateModule({
    business: {},
    tokenInfo: {},
    publicBooking: {},
    quickLinkProviderId: 0,
    appointmentBookingObj: {},
    usersQuickLink: {
      usersLink: undefined,
      businessLink: undefined
    },
    defaultChatBot: null
  });
};

@State<GeneralAppInfoStateModule>({
  name: StateNaming.generalAppInfo,
  defaults: getDefaultState()
})
@Injectable()
export class GeneralAppInfoState implements NgxsAfterBootstrap {
  constructor(private store: Store, private authService: AuthService) {}

  @Action(GetBusinessInfo)
  getBusinessInfo(ctx: StateContext<GeneralAppInfoStateModule>, action: any) {
    console.log(action);
    const newState = cloneDeep(ctx.getState());
    // if (!newState.business) newState.business = {};
    ctx.setState(newState);
    return from(this.authService.getBusinessData(action.payload)).pipe(
      tap((businessInfo: any) => {
        const newState = cloneDeep(ctx.getState());
        newState.business = businessInfo;
        ctx.setState(newState);
      })
    );
  }

  @Action(SetPublicClinic)
  setPublicClinic(
    ctx: StateContext<GeneralAppInfoStateModule>,
    action: SetPublicClinic
  ) {
    const newState = cloneDeep(ctx.getState());
    if (!newState.publicBooking) newState.publicBooking = { clinic: {} };
    newState.publicBooking.clinic = action.payload;
    ctx.setState(newState);
  }

  @Action(SetPublicUserId)
  setPublicUserId(
    ctx: StateContext<GeneralAppInfoStateModule>,
    action: SetPublicUserId
  ) {
    const newState = cloneDeep(ctx.getState());
    newState.quickLinkProviderId = 0;
    ctx.setState(newState);
    const newState1 = cloneDeep(ctx.getState());
    newState1.quickLinkProviderId = action.payload;
    ctx.setState(newState1);
    console.log(action, newState1.quickLinkProviderId);
  }

  @Action(SetAppointmentBookingData)
  setAppointmentBookingData(
    ctx: StateContext<GeneralAppInfoStateModule>,
    action: SetAppointmentBookingData
  ) {
    const newState = cloneDeep(ctx.getState());
    if (!newState.appointmentBookingObj) newState.appointmentBookingObj = {};
    newState.appointmentBookingObj = action.payload;
    ctx.setState(newState);
  }

  @Action(SetSideBarData)
  setSideBarData(
    ctx: StateContext<GeneralAppInfoStateModule>,
    action: SetSideBarData
  ) {
    const newState = cloneDeep(ctx.getState());
    newState.sideBarData = action.payload;
    ctx.setState(newState);
  }

  @Action(SetBusinessData)
  setBusinessData(
    ctx: StateContext<GeneralAppInfoStateModule>,
    action: SetBusinessData
  ) {
    const newState = cloneDeep(ctx.getState());
    newState.business = action.payload;
    ctx.setState(newState);
  }

  @Action(SetUsersQuickLink)
  setUsersQuickLink(
    ctx: StateContext<GeneralAppInfoStateModule>,
    action: SetUsersQuickLink
  ) {
    const newState = cloneDeep(ctx.getState());
    if (action.payload.usersLink) {
      newState.usersQuickLink.usersLink = action.payload.usersLink;
    }
    if (action.payload.businessLink) {
      newState.usersQuickLink.businessLink = action.payload.businessLink;
    }
    ctx.setState(newState);
  }

  @Action(SetDefaultChatBot)
  setDefaultChatBot(
    ctx: StateContext<GeneralAppInfoStateModule>,
    action: SetDefaultChatBot
  ) {
    const newState = cloneDeep(ctx.getState());
    newState.defaultChatBot = action.payload;
    ctx.setState(newState);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  ngxsAfterBootstrap(ctx: StateContext<any>): void {}
}
