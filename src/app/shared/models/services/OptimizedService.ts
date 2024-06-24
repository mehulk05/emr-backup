export interface OptimizedService {
  id: number;
  name: string;
}

export interface ServiceList {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  createdBy: string;
  id: number;
  name: string;
  serviceId: number;
  serviceName: string;
  updatedAt: string;
  updatedBy: string;
  position?: number | string;
}
