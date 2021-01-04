import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

const AUTH_API = 'http://localhost:8080/authenticate/';
const USER_API = 'http://localhost:8080/users/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }
  login(username: string, password: string): Observable<any>{
    return this.http.post(AUTH_API + "login", {
      username, 
      password
    }, 
    httpOptions);
  }

  register(name: string, username: string, password: string, phone: string, address: string): Observable<any>{
    return this.http.post(USER_API + "register",{
      name, 
      username, 
      password, 
      phone, 
      address}, 
    httpOptions);
  }
}
