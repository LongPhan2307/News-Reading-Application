import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form:any = {
    name: null,
    username: null,
    password: null,
    phone: null,
    address: null,
  }
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor( private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit(): void {
    const {name, username, password, phone, address} = this.form;

    this.authService.register(name, username, password, phone, address).subscribe(
      data => {
        if(data['success'] == false){
          this.isSignUpFailed = true;
          this.errorMessage = data['message'];
          console.log(data['message']);
          console.log(data['success']);
        }else if(data['success']){
          console.log(data);
          this.isSuccessful = true;
          this.isSignUpFailed = false;
        }
      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
  }

}
