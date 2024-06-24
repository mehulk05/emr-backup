import { GeneralAppInfoStateModule } from './store/general-states/general-state.model';

export enum StateNaming {
  generalAppInfo = 'generalAppInfo'
}

export interface RootState {
  generalAppInfo: GeneralAppInfoStateModule;
}
