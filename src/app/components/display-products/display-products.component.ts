import { Component, OnInit } from '@angular/core';
import { Deal } from '../../models/deal';
import { DealService } from '../../services/deal.service';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Wishlist } from 'src/app/models/wishlist';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.css']
})
export class DisplayProductsComponent implements OnInit {

  allProducts: Product[] = [];
  deals: Deal[] = [];
  cart: Product[] = [];
  wishlist: Wishlist[] = [];
  currUser: User = new User(0, '', '', '', '', false);

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
      }
    );
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
