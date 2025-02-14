import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    console.log('Attempting to login:', username);
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string, role: string): Observable<any> {
    console.log('Registering new user:', username);
    return this.http.post(`${this.apiUrl}/register`, { username, password, role });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
