import { createSelector } from '@ngxs/store';
import { RootState } from '../../root.state';

const rootStateSelector = (state: RootState) => state;

export const getBusinessData = createSelector(
  [rootStateSelector],
  (state: RootState) => {
    console.log(state.generalAppInfo);
    return state.generalAppInfo.business;
  }
);

export const getQuickLinkProviderId = createSelector(
  [rootStateSelector],
  (state: RootState) => {
    return state.generalAppInfo?.quickLinkProviderId;
  }
);

export const getSelectedClinicSelector = createSelector(
  [rootStateSelector],
  (state: RootState) => {
    return state.generalAppInfo?.publicBooking?.clinic;
  }
);

export const getAppointmentBookingObj = createSelector(
  [rootStateSelector],
  (state: RootState) => {
    return state.generalAppInfo?.appointmentBookingObj;
  }
);

export const getSidebarData = createSelector(
  [rootStateSelector],
  (state: RootState) => {
    return state.generalAppInfo?.sideBarData;
  }
);

export const getUsersQuickLink = createSelector(
  [rootStateSelector],
  (state: RootState) => {
    return state.generalAppInfo?.usersQuickLink;
  }
);

export const getDefaultChatbot = createSelector(
  [rootStateSelector],
  (state: RootState) => {
    return state.generalAppInfo?.defaultChatBot;
  }
);
