import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

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

  constructor(private authService: AuthService, private router: Router, private productService: ProductService) {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.currUser = this.authService.findUser();
        this.currUsername = this.authService.getUserFirstname();
      }
    });
  }
  ngOnInit(): void {
    this.subscription = this.productService.getCart().subscribe(
      (cart) => this.cartCount = cart.cartCount
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
