export interface IConsents {
  createdAt?: string;
  updatedAt?: string;
  createdBy?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
  };
  updatedBy?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
  };
  deleted?: boolean;
  tenantId?: number;
  id?: number;
  defaultConsentId?: null;
  name?: string;
  body?: string;
  isDefault?: null;
  tag?: string;
  isCustom?: null;
  appointment?: any;
  appointmentConsentStatus: any;
  consent: any;
  signFileGenerated: any;
}
