import { Component, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../customer.service';
import { ListBox } from '../listbox.model';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  listBoxes: ListBox[] = [];
  filteredListBoxes: ListBox[] = [];
  boxData: ListBox[] = [];
  customerData: Customer[] = [];
  searchTerm: string = '';
  filterByNoBox: boolean = true; // Default to filter by no_box
  filterByCreatedDate: boolean = false;
  filterByCustName: boolean = true; // Default to filter by no_box
  filterByCustID: boolean = false; // Default to filter by no_box
  selectedDate: string | null = null;
  sortDirection: boolean = true; // true = ascending, false = descending
  sortColumn: keyof ListBox | '' = ''; // Track the currently sorted column
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  isDateFocused: boolean = false;  // State to manage the input type
  isCustIDFocused: boolean = false;
  searchMode: 'box' | 'customer' = 'box';
  searchQuery: string = '';
  isEditModalOpen = false;

  editableCustomer: Partial<Customer> = {}; // Data for editing
  // currentFilter: string = 'box';

  

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getListBoxes();
  }

  // Fetch all ListBox items
  getListBoxes(): void {
    this.customerService.getAllListBoxes().subscribe(
      (data: ListBox[]) => {
        this.listBoxes = data;
        this.filteredListBoxes = data;
      },
      (error) => {
        console.error('Error fetching list boxes:', error);
      }
    );
  }

  sortData(column: keyof ListBox): void {
    // Toggle sort direction if the same column is clicked again
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortDirection = true;
    }
    
    this.sortColumn = column;
    const direction = this.sortDirection ? 1 : -1;

    this.filteredListBoxes.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1 * direction;
      } else if (a[column] > b[column]) {
        return 1 * direction;
      }
      return 0;
    });
  }

  onSortColumnChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedColumn = selectElement.value as keyof ListBox;
    this.sortData(selectedColumn);
  }

  // Filter list boxes based on search term
  search(): void {
    if (this.searchMode === 'box') {
    this.filteredListBoxes = this.listBoxes.filter((listBox) => {
      let matchesNoBox = true;
      let matchesCreatedDate = true;
  
      // Filter by No Box if checked and search term is provided
      if (this.filterByNoBox && this.searchTerm) {
        matchesNoBox = listBox.no_box.toLowerCase().includes(this.searchTerm.toLowerCase());
      }
  
      // Filter by Created Date if checked and date is selected
      if (this.filterByCreatedDate && this.selectedDate) {
        // Format the createdDate from the database to YYYY-MM-DD for comparison
        const formattedCreatedDate = new Date(listBox.createdDate).toISOString().split('T')[0];
        matchesCreatedDate = formattedCreatedDate === this.selectedDate;
      }
  
      return matchesNoBox && matchesCreatedDate;
    });
  }
  else if (this.searchMode === 'customer'){
    this.customerData = this.customerData.filter((customerData) => {
      let matchesCustomer = true;
      let matchesCustID = true;
      if (this.filterByCustName && this.searchTerm) {
        matchesCustomer = customerData.namaKonsumen.toLowerCase().includes(this.searchTerm.toLowerCase());
      }
      if (this.filterByCustID && this.searchTerm) {
        // Format the createdDate from the database to YYYY-MM-DD for comparison
        matchesCustID = customerData.noKontrak.toLowerCase().includes(this.searchTerm.toLowerCase());

      }
        return matchesCustomer && matchesCustID ;
    });
  }
}

  onCreatedDateFilterChange(): void {
    // Reset search term and selected date when toggling created date filter
    this.searchTerm = '';
    this.selectedDate = null;
    this.search();
  }

  toggleFilter(filter: 'no_box' | 'createdDate'): void {
    if (filter === 'no_box') {
      this.filterByNoBox = true;
      this.filterByCreatedDate = false;
      this.searchTerm = ''; // Reset date input if switching to No Box filter
    } else if (filter === 'createdDate') {
      this.filterByNoBox = false;
      this.filterByCreatedDate = true;
      this.selectedDate = null; // Reset text input if switching to Created Date filter
    }
    this.search(); // Trigger the search to update results
  }

  toggleFilterx(filter: 'custName' | 'custID'): void {
    if (filter === 'custName') {
      this.filterByCustName = true;
      this.filterByCustID = false;
      this.searchTerm = ''; // Reset date input if switching to No Box filter
    } else if (filter === 'custID') {
      this.filterByCustName = false;
      this.filterByCustID = true;
      // this.selectedDate = null; // Reset text input if switching to Created Date filter
    }
    this.search(); // Trigger the search to update results
  }

  // View details of a selected ListBox
  viewListBox(listBox: ListBox): void {
    Swal.fire({
      title: 'ListBox Details',
      html: `<p><strong>ID:</strong> ${listBox.id}</p>
             <p><strong>No Box:</strong> ${listBox.no_box}</p>
             <p><strong>Created Date:</strong> ${new Date(listBox.createdDate).toLocaleDateString()}</p>
             <p><strong>Approved:</strong> ${listBox.approved}</p>`,
      icon: 'info',
    });
  }

  // Delete a ListBox item
  deleteListBox(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteListBox(id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The item has been deleted.', 'success');
            this.getListBoxes(); // Refresh the list
          },
          (error) => {
            console.error('Error deleting list box:', error);
            Swal.fire('Error!', 'Could not delete the item.', 'error');
          }
        );
      }
    });
  }

  onFocus() {
    this.isDateFocused = true;  // Switch type to 'date' on focus
    this.isCustIDFocused = true;
  }

  onBlur() {
    this.isDateFocused = false;  // Switch type back to 'text' on blur
    this.isCustIDFocused = false;
  }
  fetchCustomerData(): void {
    this.customerService.getAllCustomers().subscribe(
      (data) => {
        this.customerData = data;
      },
      (error) => {
        console.error('Error fetching customer data', error);
      }
    );
  }
  fetchBoxData(): void {
    this.customerService.getAllListBoxes().subscribe(
      (data) => {
        this.boxData = data;
      },
      (error) => {
        console.error('Error fetching box data', error);
      }
    );
  }
  toggleSearchMode(mode: 'box' | 'customer'): void {
    this.searchMode = mode;
    if (mode === 'box') {
      this.fetchBoxData();
    } else {
      this.fetchCustomerData();
    }
  }


  openEditModal(customer: Customer): void {
    this.isEditModalOpen = true;
    this.editableCustomer = { ...customer };  // Clone customer data to avoid direct binding
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editableCustomer = {};
  }

  getOption(filter: string): string {
    switch (filter) {
      case 'box':
        return 'Search - Box';
      case 'customer':
        return 'Search - Customer';
      default:
        return 'Search - All'; // Fallback for unexpected filter values
    }
  }

  // searchCustomers(): void {
  //   this.filteredCustomers = this.customers.filter((customer) =>
  //     customer.name.toLowerCase().includes(this.customerSearchTerm.toLowerCase())
  //   );
  // }

}
