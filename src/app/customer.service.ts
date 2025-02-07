import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
// import { ListBox } from './listbox.model';
import { tap } from 'rxjs/operators';
import { environment } from './environments/environment';



export interface Customer {
  id: number;
  customerID: string;
  fap: string;
  fcAkta: string;
  fcKK: string;
  fcKTP: string;
  fcPasangan: string;
  formSurvey: string;
  k3: string;
  namaKonsumen: string;
  noKontrak: string;
  noMap: string;
  noPin: string;
  petaLokasi: string;
  rekomendasi: string;
  resume: string;
  siup: string;
  tandaDaftarPerusahaan: string;
  tglRealisasi: Date;
  tglJatuhTempo: Date;
  tglRetensi: Date;
  noBox: string;
  fcPengurus: string;
  createdDate: Date;
  sampled: string; 
}

export interface ListBox {
  id: number;
  no_box: string;
  approved: string;
  sampled: string;
  createdDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  // private apiUrl = 'http://localhost:8080/api/customers';

  // private listBoxApiUrl = 'http://localhost:8080/api/listbox';

  // private apiLogin = 'http://localhost:8080/api/auth/login'

  // private apiRegister = 'http://localhost:8080/api/auth/register'

  private apiUrl = environment.apiUrl;  
  private listBoxApiUrl = environment.listBoxApiUrl;
  private apiLogin = environment.apiLogin;
  private apiRegister = environment.apiRegister;
  
  constructor(private http: HttpClient) {}

  createCustomer(customer: Omit<Customer, 'id'>): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}`, customer).pipe(
      catchError(error => {
        console.error('Error creating customer', error);
        return throwError(error);
      })
    );
  }
  

  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching data', error);
        return throwError(error);
      })
    );
  }

  getMasterboxData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/masterbox`);
  }

  

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting customer', error);
        return throwError(error);
      })
    );
  }

  updateCustomer(id: number, customerData: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerData).pipe(
      catchError(error => {
        console.error('Error updating customer', error);
        return throwError(error);
      })
    );
  }

  getCustomerByNoBox(noBox: string): Observable<Customer> {
    const url = `${this.apiUrl}/customers/byNoBox/${noBox}`; // Ensure the URL matches the endpoint in your backend
    return this.http.get<Customer>(url);
  }



  getCustomerDetails(noBox: string) {
    return this.http.get<any>(`${this.apiUrl}/details/${noBox}`);
  }
  
  
  //List Box is down here

  getAllListBoxes(): Observable<ListBox[]> {
    return this.http.get<ListBox[]>(this.listBoxApiUrl);
  }

  getListBoxById(id: number): Observable<ListBox> {
    return this.http.get<ListBox>(`${this.listBoxApiUrl}/${id}`);
  }

  deleteListBox(id: number): Observable<void> {
    return this.http.delete<void>(`${this.listBoxApiUrl}/${id}`);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.apiLogin, { username, password }).pipe(
      catchError(error => {
        console.error('Error logging in', error);
        return throwError(error);
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(this.apiRegister, { username, password }).pipe(
      catchError(error => {
        console.error('Error registering user', error);
        return throwError(error);
      })
    );
  }

  updateListBoxSampled(noBox: string, sampled: string): Observable<any> {
    return this.http.put(`${this.listBoxApiUrl}/update-sampled?noBox=${noBox}&sampled=${sampled}&approved=0`, null, { observe: 'response' }).pipe(
      tap(response => console.log('ListBox update response:', response)),
      catchError((error) => {
        console.error('Error updating ListBox sampled', error);
        return throwError(error);
      })
    );
  }
  
  updateListBoxApproved(listBox: ListBox): Observable<any> {
    const url = `${this.listBoxApiUrl}/${listBox.id}`;
    return this.http.put(url, listBox, { responseType: 'text' }).pipe(
      catchError((error) => {
        console.error('Error updating ListBox approved status:', error);
        return throwError(error);
      })
    );
  }
  
  createListBox(listBox: Omit<ListBox, 'id' | 'createdDate'>): Observable<ListBox> {
    console.log('Creating a new ListBox with no_box:', listBox.no_box); // Log the data being sent
    return this.http.post<ListBox>(this.listBoxApiUrl, listBox).pipe(
      catchError(error => {
        console.error('Error creating ListBox', error);
        return throwError(error);
      })
    );
  }

  
  
  // updateCustomer(id: number, customerData: Customer): Observable<Customer> {
  //   return this.http.put<Customer>(`${this.apiUrl}/${id}`, customerData).pipe(
  //     catchError(error => {
  //       console.error('Error updating customer', error);
  //       return throwError(error);
  //     })
  //   );
  // }
  
  

  
}
