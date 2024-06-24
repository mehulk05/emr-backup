import { IConsents } from './consent.mode';
import { IQuestionaire } from './questionarie.model';

export interface IService {
  questionnaires?: IQuestionaire[];
  serviceCost?: number;
  imageUrl?: null;
  name?: string;
  durationInMinutes?: number;
  serviceURL?: null;
  consents?: IConsents[];
  description?: null;
  id?: number;
  isPreBookingCostAllowed?: boolean;
  categoryName?: string;
  categoryId?: number;
  priceVaries?: boolean;
  showDepositCode?: boolean;
  depositCost?: number;
}
