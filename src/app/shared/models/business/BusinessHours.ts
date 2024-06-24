export interface BusinessHours {
  index?: number;
  day: string;
  checked: boolean;
  openHour: Date | null;
  closeHour: Date | null;
}
