import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = 'http://localhost:8080/api/customers';

  constructor(private http: HttpClient) {}

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(this.apiUrl, customer).pipe(
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
}
