import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  finalProducts: Product[] = [];
  currUser: User = new User(0, '', '', '', '', false);
  subscription: Subscription = new Subscription();
  expValid: string = '';

  checkoutForm = new FormGroup({
    //fname: new FormControl('', Validators.required),
    //lname: new FormControl('', Validators.required),
    cardName: new FormControl('', Validators.required),
    cardNumber: new FormControl('', [Validators.required, Validators.minLength(19), Validators.pattern('^[ 0-9]*$')]),
    expiry: new FormControl('', [Validators.required, Validators.minLength(5), Validators.pattern("^[0-9/]*$")]),
    cvv: new FormControl('', [Validators.required, Validators.minLength(3), Validators.pattern("^[0-9]*$")]),
    address: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zipCode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern("^[0-9]*$")]),
    //country: new FormControl('', Validators.required)
  });

  @ViewChild('ccNumber') ccNumberField!: ElementRef;


  constructor(private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
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
    )
  }

  onSubmit(): void {
    //Test Exp Date
    if (this.checkoutForm.get('expiry')?.value == null) {
      this.expValid = 'Please enter a valid expiration date';
      return;
    } else {
      var str = this.checkoutForm.get('expiry')?.value;
      if (!this.validDate(str)) {
        return;
      } else {
        this.expValid = '';
      }
    }

    this.products.forEach(e => {
      let finalProduct: Product = e.product;
      finalProduct.productQuantity = e.quantity;
      this.finalProducts.push(finalProduct);
    });
    //console.log(this.finalProducts);

    this.productService.purchase(this.finalProducts).subscribe(
      res => {
        //console.log(res);
        this.cartProducts.forEach(e => {
          this.cartService.removeItem(e.productId).subscribe();
        });
        this.router.navigate(['/home']);
      },
      err => {
        alert("One or more of your cart items are out of stock.");
      });

  }

  validDate(s: string | null | undefined): boolean {
    if (s == null || s == undefined) {
      return false;
    }
    var date = new Date();

    var currMonth = date.getMonth() + 1;
    var currYearS = date.getFullYear().toString();
    var currYear: number = +currYearS.slice(-2);


    var monthS = s[0]+s[1];
    var monthN: number = +monthS;
    var yearS = s[3]+s[4];
    var yearN: number = +yearS;

    if (monthN < 1 || monthN > 12) {
      this.expValid = 'Please enter a valid month.';
      return false;
    }
    if (yearN < 0) {
      this.expValid = 'Please enter a valid year';
      return false;
    }
    if (yearN < currYear && yearN >= 0) {
      this.expValid = 'Your card has expired.';
      return false;
    }
    if (monthN < currMonth && currMonth >= 0) {
      this.expValid = 'Your card has expired.';
      return false;
    }

    return true;
  }

  /* Insert spaces to enhance legibility of credit card numbers */
  creditCardNumberSpacing() {
    const input = this.ccNumberField.nativeElement;
    const { selectionStart } = input;
    const { cardNumber }= this.checkoutForm.controls;

    if (cardNumber.value == null) {
      return;
    }

    let trimmedCardNum = cardNumber.value.replace(/\s+/g, '');

    if (trimmedCardNum.length > 16) {
      trimmedCardNum = trimmedCardNum.substr(0, 16);
    }

     /* Handle American Express 4-6-5 spacing */
    const partitions = trimmedCardNum.startsWith('34') || trimmedCardNum.startsWith('37')
                       ? [4,6,5]
                       : [4,4,4,4];

    const numbers: any[] = [];
    let position = 0;
    partitions.forEach(partition => {
      const part = trimmedCardNum.substr(position, partition);
      if (part) numbers.push(part);
      position += partition;
    })

    cardNumber.setValue(numbers.join(' '));

    /* Handle caret position if user edits the number later */
    if (selectionStart < cardNumber.value.length - 1) {
      input.setSelectionRange(selectionStart, selectionStart, 'none');
    }
  }


  onDestroy(): void {
    this.subscription.unsubscribe();
  }

}
