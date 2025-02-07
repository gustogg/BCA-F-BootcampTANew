import { Component, type OnInit, ViewChild, type AfterViewInit, type TemplateRef } from "@angular/core"
import { CustomerService, Customer } from "../../../customer.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";
import { FormControl } from "@angular/forms";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
// import { CustomerDetailDialogComponent } from "./customer-detail-dialog.component"
import { MatDialog } from '@angular/material/dialog'; // Type-only import
import { Inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-register-import-customize',
  templateUrl: './register-import-customize.component.html',
  styleUrl: './register-import-customize.component.css'
})
export class RegisterImportCustomizeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["noKontrak", "customerID", "namaKonsumen", "tglRealisasi", "noBox", "noMap", "actions"]
  dataSource: MatTableDataSource<Customer>
  isLoading = true
  totalRecords = 0
  bulkNoBoxControl = new FormControl("")
  isUpdating = false
  // selectedCustomer: Customer | null = null
  selectedCustomer: Partial<Customer> = {};
  editMode = false
  // customerForm: FormGroup

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild("customerDetailsModal") customerDetailsModal!: TemplateRef<any>
  customerForm: FormGroup = new FormGroup({})
  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog, // Change from private to public
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Customer>([])
    this.initForm()
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      noKontrak: ["", Validators.required],
      customerID: ["", Validators.required],
      namaKonsumen: ["", Validators.required],
      noPin: [""],
      tglRealisasi: [""],
      tglJatuhTempo: [""],
      tglRetensi: [""],
      fcKTP: [""],
      fcPasangan: [""],
      fcPengurus: [""],
      fcKK: [""],
      fcAkta: [""],
      k3: [""],
      rekomendasi: [""],
      formSurvey: [""],
      petaLokasi: [""],
      fap: [""],
      resume: [""],
      tandaDaftarPerusahaan: [""],
      siup: [""],
      noBox: [""],
      noMap: [""],
      sampled: [""],
    })
  }

  ngOnInit(): void {
    this.loadCustomerData()
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    }
  }
toggleEditMode(): void {
    this.editMode = !this.editMode
    if (this.editMode) {
      this.customerForm.patchValue(this.selectedCustomer)
    }
  }

  async saveCustomerDetails(): Promise<void> {
    if (!this.selectedCustomer.id || !this.customerForm.valid) return

    try {
      const updatedCustomer = {
        ...this.selectedCustomer,
        ...this.customerForm.value,
      }

      await firstValueFrom(this.customerService.updateCustomer(this.selectedCustomer.id, updatedCustomer))

      await Swal.fire({
        title: "Success!",
        text: "Customer details updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      })

      // Update the selected customer with new values
      this.selectedCustomer = updatedCustomer
      this.editMode = false

      // Reload the table data
      await this.loadCustomerData()
    } catch (error) {
      console.error("Error updating customer details:", error)
      await Swal.fire({
        title: "Error!",
        text: "Failed to update customer details",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  // Add delete method
  async deleteCustomer(customer: Customer): Promise<void> {
    if (!customer.id) return

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the customer record for ${customer.namaKonsumen || "Unknown"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626", // Red color for delete confirmation
    })

    if (result.isConfirmed) {
      try {
        await firstValueFrom(this.customerService.deleteCustomer(customer.id))

        await Swal.fire({
          title: "Deleted!",
          text: "Customer record has been deleted successfully",
          icon: "success",
          confirmButtonText: "OK",
        })

        // Reload the data
        await this.loadCustomerData()
      } catch (error) {
        console.error("Error deleting customer:", error)
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete customer record",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    }
  }

  // Add new method to handle bulk update
  async setBulkNoBox(): Promise<void> {
    const noBoxValue = this.bulkNoBoxControl.value
    if (!noBoxValue) {
      await Swal.fire({
        title: "Error!",
        text: "Please enter a box number",
        icon: "error",
        confirmButtonText: "OK",
      })
      return
    }

    // Get filtered data (if any filter is applied)
    const dataToUpdate = this.dataSource.filteredData.filter((customer) => !customer.noBox)

    if (dataToUpdate.length === 0) {
      await Swal.fire({
        title: "Info",
        text: "No records found that need updating",
        icon: "info",
        confirmButtonText: "OK",
      })
      return
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Update",
      text: `Are you sure you want to set Box Number to "${noBoxValue}" for ${dataToUpdate.length} records?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update all",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      try {
        this.isUpdating = true
        let successCount = 0
        let errorCount = 0

        // Update each record
        for (const customer of dataToUpdate) {
          if (customer.id) {
            try {
              const updatedCustomer = {
                ...customer,
                noBox: noBoxValue,
              }
              await firstValueFrom(this.customerService.updateCustomer(customer.id, updatedCustomer))
              successCount++
            } catch (error) {
              console.error("Error updating customer:", error)
              errorCount++
            }
          }
        }

        // Show success message
        await Swal.fire({
          title: "Update Complete",
          text: `Successfully updated ${successCount} records${errorCount > 0 ? `, ${errorCount} failed` : ""}`,
          icon: successCount > 0 ? "success" : "error",
          confirmButtonText: "OK",
        })

        // Reload the data
        await this.loadCustomerData()

        // Clear the input
        this.bulkNoBoxControl.setValue("")
      } finally {
        this.isUpdating = false
      }
    }
  }

  async loadCustomerData(): Promise<void> {
    try {
      this.isLoading = true
      // Use firstValueFrom instead of toPromise()
      const customers = await firstValueFrom(this.customerService.getAllCustomers())

      if (customers) {
        // Filter customers where noBox or noMap is null
        const filteredCustomers = customers.filter((customer) => !customer.noBox || !customer.noMap)
        this.totalRecords = filteredCustomers.length
        this.dataSource = new MatTableDataSource(filteredCustomers)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort

        // Custom filter predicate for better searching
        this.dataSource.filterPredicate = (data: Customer, filter: string) => {
          const searchStr = JSON.stringify([data.noKontrak, data.customerID, data.namaKonsumen]).toLowerCase()
          return searchStr.includes(filter.toLowerCase())
        }
      }
    } catch (error) {
      console.error("Error loading customer data:", error)
      await Swal.fire({
        title: "Error!",
        text: "Failed to load customer data",
        icon: "error",
        confirmButtonText: "OK",
      })
    } finally {
      this.isLoading = false
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  async updateCustomer(customer: Customer): Promise<void> {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Update Customer Data",
        html:
          '<div class="tw-space-y-4">' +
          `<div class="tw-flex tw-flex-col">
            <label class="tw-text-sm tw-font-medium tw-mb-1">Box Number</label>
            <input id="swal-input-box" class="tw-border tw-rounded tw-px-3 tw-py-2" value="${customer.noBox || ""}">
           </div>` +
          `<div class="tw-flex tw-flex-col">
            <label class="tw-text-sm tw-font-medium tw-mb-1">Map Number</label>
            <input id="swal-input-map" class="tw-border tw-rounded tw-px-3 tw-py-2" value="${customer.noMap || ""}">
           </div>` +
          "</div>",
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          return {
            noBox: (document.getElementById("swal-input-box") as HTMLInputElement).value,
            noMap: (document.getElementById("swal-input-map") as HTMLInputElement).value,
          }
        },
      })

      if (formValues && customer.id) {
        const updatedCustomer = {
          ...customer,
          noBox: formValues.noBox,
          noMap: formValues.noMap,
        }

        // Use firstValueFrom instead of toPromise()
        await firstValueFrom(this.customerService.updateCustomer(customer.id, updatedCustomer))

        await Swal.fire({
          title: "Success!",
          text: "Customer data updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        })

        // Reload the data
        await this.loadCustomerData()
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      await Swal.fire({
        title: "Error!",
        text: "Failed to update customer data",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  showCustomerDetails(customer: Customer): void {
    this.selectedCustomer = customer
    const dialogRef = this.dialog.open(this.customerDetailsModal, {
      panelClass: "tw-bg-transparent",
    })
  }

  formatDate(date: Date | string | number | undefined): string {
    if (!date) return "Not Set"
    return new Date(date).toLocaleDateString()
  }

  formatValue(value: string | undefined): string {
    if (value === undefined || value === null) return "Not Set"
    return value === "1" ? "Yes" : value === "0" ? "No" : value
  }

  showDetails(customer: Customer): void {
    this.selectedCustomer = customer
    this.dialog.open(this.customerDetailsModal, {
      width: "900px",
      maxHeight: "90vh",
      panelClass: "custom-dialog-container",
    })
  }
  onSubmit() {
    console.log(this.customerForm.value)
  }
}
