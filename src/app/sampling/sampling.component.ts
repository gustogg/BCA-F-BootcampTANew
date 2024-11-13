import { Component } from '@angular/core';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sampling',
  templateUrl: './sampling.component.html',
  styleUrl: './sampling.component.css'
})
export class SamplingComponent {
  showDeleteConfirmation() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your item has been deleted.",
          icon: "success"
        });
      }
    });
  }
}
