import { DealService } from './../../services/deal.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  products: Product[] = [];
  totalPrice!: number;
  cartProducts: Product[] = [];
  currUser: User = new User(0, '', '', '', '', false);
  subscription!: Subscription;

  constructor(private router: Router,
    private cartService: CartService,
    private authService: AuthService,
    private dealService: DealService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.currUser = this.authService.findUser();
    this.cartService.getFullCart(this.currUser.userId!).subscribe(
      (cart) => {
        let price = 0;
        cart.forEach(e => price += e.productPrice);
        let icart = {
          cartCount: cart.length,
          products: cart,
          totalPrice: price
        }
        this.cartService.setCart(icart);
        this.products = cart;
        this.totalPrice = price;
      }
    );
  }

  removeItem(id: number) {
    this.cartService.removeItem(id).subscribe((data) => {
      console.log(data);
      this.ngOnInit();
    });
  }

  emptyCart(): void {
    this.products.forEach(e => {
      this.cartService.removeItem(e.productId).subscribe(data => { console.log(data); this.ngOnInit(); });
    });
  }
}
