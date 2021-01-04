import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form:any = {
    username: null, 
    password: null,
  }
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if(this.tokenStorage.getToken()){
      this.isLoggedIn = true;
      if(this.tokenStorage.getUser()._id ){
        this.roles = ['user'];
      }
      
      console.log(this.tokenStorage.getAToken());
      if(this.tokenStorage.getUser()._id && this.tokenStorage.getAToken()){
        this.roles = ['user', 'admin'];
      }  
      console.log(this.roles);
    }
  }
  onSubmit():void {
    const {username, password} = this.form;
    this.authService.login(username, password).subscribe(
      (data) => {
        this.tokenStorage.saveToken(data.user.token);
        this.tokenStorage.saveUser(data.user);
        console.log(this.tokenStorage.getUser());
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        if (data.user.token != undefined){
          this.roles = ['user'];
          console.log(data.code);
          this.tokenStorage.saveAToken(data.code);
          if (data.code != undefined){
            this.roles = ['user','admin'];
          }
        }
        this.reloadPage();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      });
  }
  reloadPage(): void {
    window.location.reload();
  }
}
