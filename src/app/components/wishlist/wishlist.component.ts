import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { WishlistService } from '../../services/wishlist.service';
import { Wishlist } from '../../models/wishlist';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/models/cart';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {


  product: Product[] = [];
  wishlist: Product[] = [];
  currUser: User = new User(0, '', '', '', '', false);


  constructor(private wishlistService: WishlistService, private authService: AuthService, private cartService: CartService) { }

  ngOnInit(): void {
    this.currUser = this.authService.findUser();


    if (this.currUser.userId) {
      this.wishlistService.getList(this.currUser.userId).subscribe(
        (wishlist) => {
          this.product = wishlist;
          console.log(this.product);

          let iwish = {
            wishlistCount: wishlist.length,
            products: wishlist
          }
          this.wishlistService.setWishlist(iwish);
        });
    }
    else {
      alert("Please log in");
    }

    let list = {
      wishlistCount: this.product.length,
      products: this.product
    };
    this.wishlistService.setWishlist(list);
  }

  removeItem(product: Product): void {
    console.log("removeItem called in component");
    this.wishlistService.removeItem(product.productId).subscribe(data => {
      console.log(data);
      this.wishlistService.getList(this.currUser.userId!).subscribe(
        (wishlist) => {
          this.product = wishlist;
          console.log(this.wishlist);

          let iwish = {
            wishlistCount: wishlist.length,
            products: wishlist
          }
          this.wishlistService.setWishlist(iwish);
        });
    });
  }

  addToCart(product: Product): void {
    let cartItem: Cart = new Cart(product.productId, this.currUser.userId!);
    this.cartService.addItem(cartItem).subscribe(data => console.log(data));
  }

}
