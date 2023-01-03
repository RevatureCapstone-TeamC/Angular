import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User, User2 } from 'app/models/user';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IUser } from 'app/models/userinterface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUrl: string = `${environment.baseUrl}/auth`;
  loggedIn: boolean = false;
  private subject = new Subject<any>();
  private currUser: User = new User(0, '', '', '', '', false);

  constructor(private http: HttpClient) {
   }

  login(user: Object){
    return this.http
    .post<User>(`${this.authUrl}/login`, user);
  }

  logout(): void{
    this.currUser = new User(0, '', '', '', '', false);
    this.loggedIn = false;
    this.http.post(`${this.authUrl}/logout`, null);
  }

  register(user: Object): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/register`, user);
  }

  setData(user: User) {
    console.log("Setting the data");
    this.currUser = user;
    this.subject.next(this.currUser);
  }

  getData(): Observable<User> {
    return this.subject.asObservable();
  }

  findUser(): User {
    return this.currUser;
  }

  getUserFirstname(): string {
    if (this.loggedIn && this.currUser.userFirstName != null) {
      return this.currUser.userFirstName;
    } else {
      return 'Guest';
    }
  }

  getAdmin(): boolean {
    if (this.currUser.ifAdmin == null) {
      return false;
    }
    return this.currUser.ifAdmin;
  }
}
