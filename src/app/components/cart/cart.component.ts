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

  products: {
    product: Product,
    quantity: number
  }[] = [];;
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
        this.cartProducts = cart;
        this.totalPrice = price;

        cart.forEach(c => {
          let inCart = false;
          this.products.forEach(
            (e) => {
              if (e.product.productName == c.productName) {
                ++e.quantity;
                inCart = true;
              };
            }
          );
          if (inCart == false) {
            let newProduct = {
              product: c,
              quantity: 1
            };
            this.products.push(newProduct);
          }
        });
      }
    );
  }

  removeItem(product: Product) {
    this.cartProducts.forEach(e => {
      if (e.productName == product.productName) {
        this.cartService.removeItem(product.productId).subscribe((data) => {
          console.log(data);
          this.products = [];
          this.ngOnInit();

        });
      }
    });
  }

  emptyCart(): void {
    this.cartProducts.forEach(e => {
      this.cartService.removeItem(e.productId).subscribe(data => {
        console.log(data);
        this.products = [];
        this.ngOnInit();
      });
    });
  }
}
