import { IClinic } from './clinic.model';
import { IProvider } from './provider.model';
import { IService } from './service.model';

export interface IBooking {
  appointment?: any;
  businessId?: string | number;
  date?: string | Date;
  time?: string | Date | any;
  provider?: IProvider;
  selectedClinic?: IClinic;
  selectedServices?: IService[];
}
