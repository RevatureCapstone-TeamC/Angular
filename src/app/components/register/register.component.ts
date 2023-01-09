import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new UntypedFormGroup({
    fname: new UntypedFormControl(''),
    lname: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    password: new UntypedFormControl('')
  })

  validFName: string = '';
  validLName: string = '';
  validEmail: string = '';
  validPassword: string = '';


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    let valid = true;

    //Firstname Validation
    if (this.registerForm.get('fname')?.value == '') {
      valid = false;
      this.validFName = 'Please enter your first name';
    } else {
      this.validFName = '';
    }

    //Lastname Validation
    if (this.registerForm.get('lname')?.value == '') {
      valid = false;
      this.validLName = 'Please enter your last name';
    } else {
      this.validLName = '';
    }

    //Email Validation
    if (this.registerForm.get('email')?.value == '') {
      valid = false;
      this.validEmail = 'Please enter an email';
    } else if (!this.isAnEmail(this.registerForm.get('email')?.value)) {
      this.validEmail = 'Please ensure your email has an email address (ex: name@emailaddress)';
      valid = false;
    } else {
      this.validEmail = '';
    }

    //Password Validation
    if (this.registerForm.get('password')?.value == '') {
      this.validPassword = 'Please enter a password.';
      valid = false;
    } else if (this.registerForm.get('password')?.value.length < 5) {
      this.validPassword = 'Your password must be at least five (5) characters long';
      valid = false;
    } else {
      this.validPassword = '';
    }

    if (valid) {
      let userPayload: User = new User(
        0,
        this.registerForm.get('fname')?.value,
        this.registerForm.get('lname')?.value,
        this.registerForm.get('email')?.value,
        this.registerForm.get('password')?.value,
        false
      );
      this.authService.register(userPayload).subscribe(
        () => {
          console.log("New user registered");
          this.router.navigate(['login']);
        },
        (err) => {
          console.log(err);
          this.validEmail='This email is already taken.';
        }
      );
    }
  }

  isAnEmail(value: string): boolean {
    for (let i = 0; i < value.length; i++) {
      if (value[i] == '@') {
        return true;
      }
    }
    return false;
  }

}
