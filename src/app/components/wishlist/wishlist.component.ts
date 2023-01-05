import { DealService } from './../../services/deal.service';
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

  constructor(private wishlistService: WishlistService, private authService: AuthService, private dealService: DealService, private productService: ProductService) { }

  ngOnInit(): void {
    this.currUser = this.authService.findUser();


    //Get all the deals
    this.dealService.getDeals().subscribe(
      (deals) => {
        //Get all the products
        this.productService.getProducts().subscribe(
          (prods) => {
            //Get the users wishlist
            this.wishlistService.getList(this.currUser.userId || 0).subscribe(
              (wlist) => {

                //For every deal, compare to all the products and see if that product has a deal
                for (let d = 0; d < deals.length; d++) {
                  for (let p = 0; p < prods.length; p++) {

                    //If the deal's_fk_id is the same as the product's_id, then that product has a deal
                    if (deals[d].fk_Product_Id == prods[p].productId) {
                      //set the price of that product to the deal (if for some reason the saleprice is null, don't change it)
                      prods[p].productPrice = deals[d].salePrice || prods[p].productPrice;
                    }

                    //Go through the wish list
                    for (let w = 0; w < wlist.length; w++) {
                      //If that product is on the wishlist, set its price to the products price
                      //(the product should have updated prices from the previous if statement)
                      if (wlist[w].productName == prods[p].productName) {
                        wlist[w].productPrice = prods[p].productPrice;
                      }
                    }
                  }
                }

                //Set global variables and update services
                this.product = wlist;
                //console.log(this.product);

                let iwish = {
                  wishlistCount: wlist.length,
                  products: wlist
                }
                this.wishlistService.setWishlist(iwish);
              }
            );
          }
        );
      }
    );

    let list = {
      wishlistCount: this.product.length,
      products: this.product
    };
    this.wishlistService.setWishlist(list);
  }

  removeItem(product: Product): void {
    this.wishlistService.removeItem(product.productId).subscribe();
    this.ngOnInit();
  }
}
