export interface OptimizedClinic {
  appReviewCode: string;
  city: string;
  id: number;
  name: string;
  reviewButtonCode: string;
  timezone: string;
}

export interface ClinicList {
  createdAt: string;
  createdBy: string;
  id: number;
  isDefault: boolean;
  name: string;
  updatedAt: string;
  updatedBy: string;
}
