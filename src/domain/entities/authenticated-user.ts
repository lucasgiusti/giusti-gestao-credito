import { UserRole, UserStatus } from "./user";

export class AuthenticatedUser {
  id: string;
  email: string;
  userRole: UserRole;
  status: UserStatus;

  constructor(props: AuthenticatedUser) {
    Object.assign(this, props);
  }
}