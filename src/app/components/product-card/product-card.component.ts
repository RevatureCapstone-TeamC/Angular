import { DealService } from './../../services/deal.service';
import { AuthService } from './../../services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { Wishlist } from '../../models/wishlist';
import { WishlistService } from '../../services/wishlist.service';
import { Subscription, BehaviorSubject } from 'rxjs';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { Deal } from '../../models/deal';
import { CartService } from 'src/app/services/cart.service';
import { Cart } from 'src/app/models/cart';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  cartCount!: number;
  wishlistCount!: number;
  products: {
    product: Product,
    quantity: number
  }[] = [];
  cartProducts: Product[] = [];
  wishlistProducts: Product[] = [];
  allproducts: Product[] = [];
  subscription!: Subscription;
  totalPrice: number = 0;
  currUser: User = new User(0, '', '', '', '', false);
  admin: boolean = false;
  deals: Deal[] = [];
  loggedIn: boolean = true;

  @Input() productInfo!: Product;

  constructor(private productService: ProductService,
    private wishlistService: WishlistService,
    private router: Router,
    private authService: AuthService,
    private dealService: DealService,
    private cartService: CartService
  ) {
    this.currUser = this.authService.findUser();
    this.loggedIn = this.authService.loggedIn;
    this.admin = this.currUser.ifAdmin || false;
    this.subscription = this.dealService.getDeals().subscribe(
      (data) => {
        //console.log(data);
        this.deals = data;
      }
    );
  }

  ngOnInit(): void {

    this.wishlistService.getList(this.currUser.userId!).subscribe(
      (list) => {
        this.wishlistCount = list.length;
        this.wishlistProducts = list;
        let iwish = {
          wishlistCount: this.wishlistCount,
          products: this.wishlistProducts
        }
        this.wishlistService.setWishlist(iwish);
      });

    this.productService.getProducts().subscribe(data => this.allproducts = data);

    this.products = [];
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

  addToCart(product: Product): void {
    if (this.currUser.userId) {
      let enoughStock = true;

      this.products.forEach(e => {
        if (e.product.productName == product.productName) {
          if (e.quantity >= product.productQuantity) {
            enoughStock = false;
          }
        }
      });

      if (enoughStock) {
        this.addProduct(product);
      }
      else {
        alert("Not enough stock");
      }
    } else {
      alert("Please log in or register.");
    }

  }

  addProduct(product: Product) {
    let cartItem: Cart = new Cart(product.productId, this.currUser.userId!);
    this.cartService.addItem(cartItem).subscribe(data => {
      this.ngOnInit();
    });
  }


  addToWishlist(product: Product): void {

    if (this.currUser.userId) {
      let foundItem: Product = new Product(0, '', 0, '', 0, '');
      this.wishlistService.getList(this.currUser.userId).subscribe(data => {
        let currWishlist = data
        currWishlist.forEach(item => {
          if (item.productName == product.productName) {
            foundItem = item;
            alert("Already in wishlist");
          }
        });
        if (foundItem.productId == 0) {
          let wishlistEntry: Wishlist = new Wishlist(product.productId, this.currUser.userId!);
          this.wishlistService.addItem(wishlistEntry).subscribe(data => this.ngOnInit());
        }
      });
    }
    else {
      alert("Please log in or register.");
    }

  }

  createDeal(product: Product): Product {
    let newPriceS = prompt(`Creating a deal for ${product.productName}. What will be the new price?`);
    let newPriceN = 0.0;
    let c = false;
    if (newPriceS != null) {
      let temp: string = '';
      if (newPriceS == 'original') {
        c = confirm(`Are you sure you want to set the price of ${product.productName} to its original price? (This will have no effect if there is no deal currently on the item)`);
        if (c) {
          console.log('Deleting the deal if it exists');
          for (let i = 0; i < this.deals.length; i++) {
            if (product.productId == this.deals[i].fk_Product_Id) {
              //Deal found, delete the deal
              this.dealService.deleteDeal(this.deals[i].dealId || 0).subscribe(
                (data) => {
                  console.log('Deal deleted');
                }
              )
              this.deals[i].dealId = 0;
              this.deals[i].fk_Product_Id = 0;
              this.deals[i].salePrice = 0;
            }
          }
          console.log('Getting the original price');
          this.productService.getSingleProduct(product.productId).subscribe(
            (data) => {
              product.productPrice = data.productPrice;
            }
          );
          return product;
        } else {
          return product;
        }
      }
      for (let i = 0; i < newPriceS.length; i++) {
        if (newPriceS[i] != '$') {
          temp = temp + newPriceS[i];
        }
      }
      newPriceS = temp;
      newPriceN = +newPriceS;
      if (newPriceN < 0.00) {
        alert(`The price you enterted is less than $0.00. Please try again`);
        return product;
      }
      c = confirm(`Are you sure you want to set the price of ${product.productName} to $${newPriceN.toFixed(2)}?`);

    }

    if (c) {
      let deal = new Deal(0, product.productId, newPriceN);
      for (let i = 0; i < this.deals.length; i++) {
        if (this.deals[i].fk_Product_Id == product.productId) {
          //a deal already exists
          deal.dealId = this.deals[i].dealId;
          console.log('Updating deals');
          this.dealService.updateDeal(deal).subscribe(
            (data) => {
              console.log('Updated deals');
            }
          )
          this.deals[i] = deal;
          product.productPrice = newPriceN;
          return product;
        }
      }
      //deal does not exist
      console.log('Making a new deal');
      this.dealService.makeDeal(deal).subscribe(
        (data) => {
          //console.log(data);
          deal = data;
          console.log('Deal was made.');
          this.deals.push(deal);
        });
      product.productPrice = newPriceN;
    }

    return product;
  }

  resetDeal(product: Product): Product {
    let dealFound = false;
    console.log('Deal Array Length: ' + this.deals.length);
    for (let i = 0; i < this.deals.length; i++) {
      if (product.productId == this.deals[i].fk_Product_Id) {
        dealFound = true;
        console.log('Deal Found');
        this.dealService.deleteDeal(this.deals[i].dealId || 0).subscribe(
          (data) => {
            console.log('Deal deleted');
          }
        )
        this.deals[i].dealId = 0;
        this.deals[i].fk_Product_Id = 0;
        this.deals[i].salePrice = 0;
      }
    }
    if (!dealFound) {
      alert(`No deal was found for ${product.productName}`);
    }
    console.log('Getting the original price');
    this.productService.getSingleProduct(product.productId).subscribe(
      (data) => {
        product.productPrice = data.productPrice;
      }
    );
    return product;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
