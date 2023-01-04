import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../models/cart';
import { AuthService } from './auth.service';
import { User } from '../models/user';


interface ICart {
  cartCount: number;
  products: Product[];
  totalPrice: number;
}


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl: string = environment.baseUrl + "/api/Cart";
  private currUser: User = new User(0, '', '', '', '', false);

  private _cart = new Subject<ICart>();

  private _cart$ = this._cart.asObservable();

  getCart(): Observable<ICart> {
    return this._cart$;
  }

  setCart(latestValue: ICart) {
    return this._cart.next(latestValue);
  }

  constructor(private http: HttpClient) { }

  public getFullCart(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.cartUrl}/${id}`, { headers: environment.headers, withCredentials: environment.withCredentials });
  }

  public addItem(cart: Cart): Observable<any> {
    return this.http.post(this.cartUrl, cart, { headers: environment.headers, withCredentials: environment.withCredentials });
  }

  public removeItem(id: number): Observable<any> {
    return this.http.delete(`${this.cartUrl}/${id}`, { headers: environment.headers, withCredentials: environment.withCredentials });
  }

  reloadCart() {
    this.getFullCart(this.currUser.userId!).subscribe(data => {
      let price = 0;
      data.forEach(e => price += e.productPrice);
      let icart = {
        cartCount: data.length,
        products: data,
        totalPrice: price
      };
      this.setCart(icart);
    });
  }
}
