import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import { Category} from '../models/category.model';

const baseUrl = 'http://localhost:8080/categories';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {

  private headers = new HttpHeaders().set('admin-access-token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRoYW5oZHVuZzE5OTkiLCJ0b2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUoxYzJWeWJtRnRaU0k2SW5Sb1lXNW9aSFZ1WnpFNU9Ua2lMQ0pwWVhRaU9qRTJNRGszTWpjd016VXNJbVY0Y0NJNk1UWXdPVGN5TnpJeE5YMC41eXIzMno1aHJSMlRlOGxmOWVEV1FreUhCOHU2ZGJ5XzFIcXkwQXp2bmdVIiwiaWF0IjoxNjA5NzI3MDM1LCJleHAiOjE2MDk3MjcyMTV9.6Q7d0i-bNWCyl6AHdfNwXzakk_krRn9um6lgRKrNUWo');
  constructor(private http: HttpClient) { }
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(baseUrl);
  }
  create(data: any): Observable<any>{
    return this.http.post(baseUrl, data, { headers: this.headers});
  }
}
