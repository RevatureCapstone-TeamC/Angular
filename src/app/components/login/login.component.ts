import { User2 } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm = new UntypedFormGroup({
    email: new UntypedFormControl(['']),
    password: new UntypedFormControl(['']),
  })

  validEmail: string = '';
  validPassword: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    let valid = true;

    //Email Validation
    if (this.loginForm.get('email')?.value == '') {
      this.validEmail = 'Please enter an email.';
      valid = false;
    } else {
      this.validEmail = '';
    }

    //Password Validation
    if (this.loginForm.get('password')?.value == '') {
      this.validPassword = 'Please enter a password.';
      valid = false;
    } else {
      this.validPassword = '';
    }

    if (valid) {
      let userPayload: User = new User(0, '', '', this.loginForm.get('email')?.value, this.loginForm.get('password')?.value, false);
      this.authService.login(userPayload).subscribe(
        (data) => {
          this.authService.loggedIn = true;
          //-------------------------------
          this.authService.setData(data);
          //-------------------------------
          this.router.navigate(['home']); // this was past err and had the ()=>
        },
        (err) => {
          this.validEmail = 'Your email may be incorrect';
          this.validPassword = 'Your password may be incorrect';
        }
      );
    }
  }

  register(): void {
    this.router.navigate(['register']);
  }

  guestLogin(): void {
    this.authService.loggedIn = false;
    this.router.navigate(['home']);
  }

  adminLogin(): void {
    this.authService.loggedIn = true;
    this.authService.setData(new User(0, 'Admin', 'Admin', '', '', true));
    this.router.navigate(['home']);
  }

  email() {
    return this.loginForm.get('email');
  }

}
