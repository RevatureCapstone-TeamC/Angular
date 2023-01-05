import { AuthService } from './../../services/auth.service';
import { WishlistService } from './../../services/wishlist.service';
import { Component, OnInit } from '@angular/core';
import { Deal } from '../../models/deal';
import { DealService } from '../../services/deal.service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { User } from 'src/app/models/user';
import { Wishlist } from 'src/app/models/wishlist';


@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css']
})
export class DisplayProductsComponent implements OnInit {

  allProducts: Product[] = [];
  deals: Deal[] = [];
  wishlistProducts: Product[] = [];
  wishlistCount!: number;
  currUser: User = new User(0, '', '', '', '', false);
  notified = false;

  cart: Product[] = [];
  wishlist: Wishlist[] = [];

  constructor(private productService: ProductService,
    private dealService: DealService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.currUser = this.authService.findUser();

    this.dealService.getDeals().subscribe(
      (data) => {
        //console.log(data);
        this.deals = data;
        this.productService.getProducts().subscribe(
          (resp) => {
            //
            for (let i = 0; i < resp.length; i++) {
              for (let j = 0; j < this.deals.length; j++) {
                if (resp[i].productId == this.deals[j].fk_Product_Id) {
                  resp[i].productPrice = this.deals[j].salePrice || 0;
                }
              }
            }
            //
            this.allProducts = resp;
          },
          (err) => console.log(err),
          () => console.log("Products Retrieved")
        );
      }
    );

    this.productService.getProducts().subscribe(
      (prod) => {
        this.currUser = this.authService.findUser();
        this.wishlistService.getList(this.currUser.userId!).subscribe(
          (list) => {
            this.wishlistCount = list.length;
            this.wishlistProducts = list;

            this.dealService.getDeals().subscribe(
              (data) => {
                this.deals = data;
                //console.log('Checking for products that have deals and seeing if they are wishlisted.');
                //console.log(`Products: ${prod.length}, Deals: ${this.deals.length}, WishList: ${this.wishlistCount}`);
                let alertStr = '';
                for (let d = 0; d < this.deals.length; d++) {
                  for (let p = 0; p < prod.length; p++) {
                    if (this.deals[d].fk_Product_Id == prod[p].productId) {
                      console.log(`${prod[p].productName} has a deal`);
                      for (let w = 0; w < this.wishlistCount; w++) {
                        if (prod[p].productName == this.wishlistProducts[w].productName) {
                          //This product has a deal and is on the wishlist.
                          console.log(`${prod[p].productName} is on your wishlist`);
                          alertStr = alertStr + `${this.wishlistProducts[w].productName} is now on sale for $${this.deals[d].salePrice?.toFixed(2)}\n`;
                        } else {
                          console.log(`${prod[p].productName} is not on your wishlist`);
                        }
                      }
                    }
                  }
                }
                if (alertStr.length > 0) {
                  alert(alertStr);
                }
              }
            );
          }
        );
      }
    );

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
      }
    );

    this.wishlistService.getList(this.currUser.userId!).subscribe(
      (wishlist) => {
        let iwish = {
          wishlistCount: wishlist.length,
          products: wishlist
        };
        this.wishlistService.setWishlist(iwish);
      }
    );
  }



}
