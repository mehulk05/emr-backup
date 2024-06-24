export interface AuditTriggerCountList {
  triggerId: number;
  triggerName: string;
  triggerCount: number;
  triggerModule: string;
  triggerType: string;
}

export interface AuditTriggerDetailList {
  leadId: number;
  contentId: number;
  templateName: string;
  phoneNumber: string;
  email: string[];
  date: any;
}
