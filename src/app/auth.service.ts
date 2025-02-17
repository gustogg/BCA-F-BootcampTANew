import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  public apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // login(username: string, password: string, role: string): Observable<any> {
  //   console.log('Attempting to login:', username, role);
  //   return this.http.post(`${this.apiUrl}/login`, { username, password });
  // }

  login(username: string, password: string, role: string): Observable<any> {
    console.log('Attempting to login:', username, role);
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        map((response: any) => {
          // If your backend doesn't return the username, use the inputted username
          return { ...response, username };
        })
      );
  }
  

  register(username: string, password: string, role: string): Observable<any> {
    console.log('Registering new user:', username);
    return this.http.post(`${this.apiUrl}/register`, { username, password, role });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
    return !!localStorage.getItem('username');
  }

  public getApiUrlUser(): string {
    return this.apiUrl;
  }

  storeUserData(token: string, username: string): void {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  }

}
