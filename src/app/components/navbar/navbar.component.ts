import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  cartCount!: number;
  wishlistCount!: number;
  subscription!: Subscription;
  userSub!: Subscription;
  currUsername?: string = '';
  currUser: User = new User(0, '', '', '', '', false);
  loggedIn: boolean = true;

  constructor(private authService: AuthService, private router: Router, private wishlistService: WishlistService, private cartService: CartService) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.currUser = this.authService.findUser();
        this.currUsername = this.authService.getUserFirstname();
        this.loggedIn = this.authService.loggedIn;
      }
    });
  }
  ngOnInit(): void {
    this.subscription = this.cartService.getCart().subscribe(
      (cart) => this.cartCount = cart.cartCount
    );
    this.subscription = this.wishlistService.getWishlist().subscribe(
      (wishlist) => this.wishlistCount = wishlist.wishlistCount
    );
  }

  ngOnDestroy() {
    //this.userSub.unsubscribe();
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
