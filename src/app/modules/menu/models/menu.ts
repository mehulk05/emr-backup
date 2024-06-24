export class Menu {
  id: number;
  name: string;
  displayName: string;
  routerLink: string;
  icon: string;
  groupMenuId: number;
}

export interface DefaultMenu {
  createdAt: any;
  updatedAt: string;
  createdBy: any;
  updatedBy: {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
  };
  deleted: boolean;
  tenantId: number;
  id: number;
  name: string;
  displayName: string;
  menuType: string;
  icon: string;
  routerLink: string;
  groupMenu: any;
  items: any[];
  position: number;
  menuFor: any;
  roleId: any;
  userId: any;
  defaultMenu: boolean;
  referenceDefaultMenuId: any;
  isDataStudioMenu: boolean;
}

export interface IRole {
  createdAt: string;
  updatedAt: string;
  createdBy: any;
  updatedBy: any;
  deleted: boolean;
  tenantId: number;
  id: number;
  name: string;
  permissions: any[];
  defaultRole: any;
}
