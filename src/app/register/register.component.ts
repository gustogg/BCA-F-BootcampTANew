import { Component, inject } from '@angular/core';
import { CustomerService, Customer } from '../customer.service';
import { NgForm } from '@angular/forms';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import {FloatLabelType, MatFormFieldModule} from '@angular/material/form-field';
import Swal from 'sweetalert2';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  faPen = faPen;
  
  // Define a single customer object
  customer: Customer = {
    id: 0, // Set to 0 but will not be sent to the backend
    customerID: '',
    fap: '',
    fcAkta: '',
    fcKK: '',
    fcKTP: '',
    fcPasangan: '',
    formSurvey: '',
    k3: '',
    namaKonsumen: '',
    noKontrak: '',
    noMap: '',
    noPin: '',
    petaLokasi: '',
    rekomendasi: '',
    resume: '',
    siup: '',
    tandaDaftarPerusahaan: '',
    tglRealisasi: new Date(),
    tglJatuhTempo: new Date(),
    tglRetensi: new Date(),
    noBox: '',
    fcPengurus: '',
    createdDate: new Date(),
    sampled: ''
  };

  constructor(private customerService: CustomerService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      // Remove the `id` field from the payload
      const { id, ...customerToSend } = this.customer;

      console.log('Customer data to send:', customerToSend); // Log data to verify

      this.customerService.createCustomer(customerToSend as Omit<Customer, 'id'>).subscribe(
        response => {
          console.log('Customer created successfully', response);

          // Reset the form after successful submission
          form.resetForm();

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your data has been saved',
            showConfirmButton: false,
            timer: 1500
          });
        },
        error => {
          console.error('Error creating customer', error);

          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again.',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields!',
      });
    }
  }
}
