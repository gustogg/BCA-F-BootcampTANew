import { Component } from '@angular/core';
import { CustomerService, Customer } from '../customer.service';
import { NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  faPen = faPen;
  customer: Customer = {
    id: 0,
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
    createdDate: new Date()

  };

  constructor(private customerService: CustomerService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.customerService.createCustomer(this.customer).subscribe(
        response => {
          console.log('Customer created successfully', response);
          // Clear form or reset it if needed
          form.resetForm();
        },
        error => {
          console.error('Error creating customer', error);
        }
      );
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your data has been saved",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }

  // showDeleteConfirmation() {
    
  // }
}
