import { IUser } from "./userinterface";

export class User implements IUser{
  userId?: number;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userPassword?: string;
  ifAdmin?: boolean;

  constructor(userId: number, userFirstName: string, userLastName: string, userEmail: string, userPassword: string, ifAdmin: boolean) {
    this.userId = userId;
    this.userFirstName = userFirstName;
    this.userLastName = userLastName;
    this.userEmail = userEmail;
    this.userPassword = userPassword;
    this.ifAdmin = ifAdmin;
  }
}


export class User2 implements IUser{
  userId?: number;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  userPassword?: string;
  isAdmin?: boolean;

  constructor(user: IUser) {
    this.userId = user.userId;
    this.userFirstName = user.userFirstName;
    this.userLastName = user.userLastName;
    this.userEmail = user.userEmail;
    this.userPassword = user.userPassword;
    this.isAdmin = user.isAdmin;
  }
}
