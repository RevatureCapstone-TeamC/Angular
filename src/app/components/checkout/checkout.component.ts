import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  products: {
    product: Product,
    quantity: number
  }[] = [];
  totalPrice: number = 0;
  cartProducts: Product[] = [];
  finalProducts: { id: number, quantity: number }[] = [];
  currUser: User = new User(0, '', '', '', '', false);
  subscription: Subscription = new Subscription();

  checkoutForm = new FormGroup({
    //fname: new FormControl('', Validators.required),
    //lname: new FormControl('', Validators.required),
    cardName: new FormControl('', Validators.required),
    cardNumber: new FormControl('', Validators.required),
    expiry: new FormControl('', Validators.required),
    cvv: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', Validators.required),
    //country: new FormControl('', Validators.required)
  });


  constructor(private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currUser = this.authService.findUser();

    // this.subscription = this.cartService.getCart().subscribe((cart) => {
    //   this.cartProducts = cart.products;
    //   this.totalPrice = cart.totalPrice;
    // });
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
        this.totalPrice = price;
        this.cartProducts = cart;
      }
    )
  }

  onSubmit(): void {

    this.productService.purchase(this.cartProducts).subscribe(data => {
      this.cartProducts.forEach(e => {
        this.cartService.removeItem(e.productId).subscribe(data => console.log(data));
      });
      this.router.navigate(['/home']);
    });

  }

  onDestroy(): void {
    this.subscription.unsubscribe();
  }

}
