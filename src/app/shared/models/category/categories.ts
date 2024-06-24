export interface CategoryList {
  createdAt: string;
  createdBy: string;
  id: number;
  name: string;
  updatedAt: string;
  updatedBy: string;
  position?: number | string;
}

export interface CategoryListDetailed {
  clinics: any;
  createdAt: string;
  createdBy: string;
  id: number;
  name: string;
  updatedAt: string;
  updatedBy: string;
  defaultServiceCategoryId: string;
  deleted: boolean;
  isDefault: boolean;
  specialization: string;
  tenantId: number;
}
