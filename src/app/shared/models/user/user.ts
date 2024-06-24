export interface User {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: any;
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  businessId: string;
  roles: string;
  permissions: Array<string>;
  profileImageUrl: string;
  designation: string;
  logoUrl: string;
  supportUser: boolean;
  agencyId: string;
}

export interface UserList {
  createdAt: string;
  createdBy: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  updatedAt: string;
  updatedBy: string;
}
