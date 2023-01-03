import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  totalPrice!: number;
  cartProducts: Product[] = [];
  finalProducts: { id: number, quantity: number }[] = [];

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


  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getCart().subscribe(
      (cart) => {
        this.products = cart.products;
        this.products.forEach(
          (element) => this.cartProducts.push(element.product)
        );
        this.totalPrice = cart.totalPrice;
      }
    );
  }

  onSubmit(): void {

    if (this.checkoutForm.invalid) {
      console.log("Form invalid");
    }
    else {
      console.log(this.checkoutForm.valid);
    }
    return;

    this.products.forEach(
      (element) => {
        const id = element.product.productId;
        const quantity = element.quantity
        this.finalProducts.push({ id, quantity })
      }
    );

    if (this.finalProducts.length > 0) {
      this.productService.purchase(this.finalProducts).subscribe(
        (resp) => console.log(resp),
        (err) => console.log(err),
        () => {
          let cart = {
            cartCount: 0,
            products: [],
            totalPrice: 0.00
          };
          this.productService.setCart(cart);
          this.router.navigate(['/home']);
        }
      );

    } else {
      this.router.navigate(['/home']);
    }
    //}
  }

}
