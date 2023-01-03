import { Injectable } from '@angular/core';
import { Product } from 'app/models/product';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Wishlist } from 'app/models/wishlist';


interface IWishlist {
  wishlistCount: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private wishlistUrl: string = environment.baseUrl + "/api/wishlist";

  private _wishlist = new BehaviorSubject<IWishlist>({
    wishlistCount: 0,
    products: []
  });

  private _wishlist$ = this._wishlist.asObservable();

  getWishlist(): Observable<IWishlist> {
    return this._wishlist$;
  }

  setWishlist(latestValue: IWishlist) {
    return this._wishlist.next(latestValue);
  }

  constructor(private http: HttpClient) { }

  public getList(id: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.wishlistUrl}/${id}`, { headers: environment.headers, withCredentials: environment.withCredentials });
  }

  public addItem(wishlist: Wishlist): Observable<any> {
    return this.http.post(this.wishlistUrl, wishlist, { headers: environment.headers, withCredentials: environment.withCredentials });
  }

  public removeItem(id: number): Observable<any> {
    console.log("removeItem called in service");
    return this.http.delete(`${this.wishlistUrl}/${id}`, { headers: environment.headers, withCredentials: environment.withCredentials });
  }


}


/*
create cart interface
get url
make subject
  new behavior subject w/ empty list
  get/set cart
make http calls
get products
remove product (on save?)
*/
