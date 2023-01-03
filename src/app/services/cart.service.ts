import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../models/cart';


interface ICart {
  cartCount: number;
  products: Product[];
}


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartUrl: string = environment.baseUrl + "/cart";

  private _cart = new BehaviorSubject<ICart>({
    cartCount: 0,
    products: []
  });

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
}
