import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { Customer } from '../../customer.service';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import { fontWeight } from 'html2canvas/dist/types/css/property-descriptors/font-weight';



@Component({
  selector: 'app-sampling-print',
  templateUrl: './sampling-print.component.html',
  styleUrl: './sampling-print.component.css'
})
export class SamplingPrintComponent {
customerDetails: any = {}; // Initialize as an object since it will be a single customer object
  faPen = faPen;
  customers: Customer[] = [];
  isEditModalOpen = false;   // Modal open/close state
  editableCustomer: Partial<Customer> = {}; // Data for editing
  today: string = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute // Inject ActivatedRoute to access route parameters
  ) {}

  ngOnInit(): void {
    const noBox = this.route.snapshot.paramMap.get('noBox');

    if (noBox) {
      this.customerService.getCustomerDetails(noBox).subscribe({
        next: (data) => {
          this.customerDetails = data;

          // Automatically trigger PDF save once the data is loaded
          setTimeout(() => this.generatePDF(noBox), 500);
        },
        error: (err) => {
          console.error('Error fetching customer details', err);
        }
      });
    }
  }

  generatePDF(noBox: string): void {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const columns = [
      'NO', 'NO MAP', 'NO Kontrak', 'NO PIN', 'CUSTOMER ID', 'NAMA KONSUMEN', 'TGL REALISASI',
      'TGL JATUH TEMPO', 'TGL RETENSI DOKUMEN', 'FC KTP', 'PASANGAN', 'SELURUH PENGURUS',
      'FC KARTU KELUARGA', 'FC AKTA NIKAH/CERAI/KEMATIAN', 'K3',
      'REKOMENDASI BCA', 'FORM SURVEY', 'PETA LOKASI', 'FAP',
      'RESUME', 'TDP', 'SIUP', 'NO BOX'
    ];
  
    const rows = this.customerDetails.map((customer: any) => [
      customer.id, customer.noMap, customer.noKontrak, customer.noPin, customer.customerID,
      customer.namaKonsumen, customer.tglRealisasi, customer.tglJatuhTempo, customer.tglRetensi,
      customer.fcKTP, customer.fcPasangan, customer.fcPengurus, customer.fcKK, customer.fcAkta,
      customer.k3, customer.rekomendasi, customer.formSurvey, customer.petaLokasi, customer.fap,
      customer.resume, customer.tandaDaftarPerusahaan, customer.siup, customer.noBox
    ]);

    //Title
    doc.setFontSize(16); // Set font size for the title
    const title = `SAMPLING LIST`; // Your title string
    const pageWidth = doc.internal.pageSize.width; // Get the page width in landscape
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor; // Calculate the width of the text
    const titleX = (pageWidth) / 2; // Calculate X position for centering

    // Add the title "Sampling List" at the top, centered
    doc.text(title, titleX, 15, { align: 'center' },{fontWeight: 'bold'}); // Position the title at (titleX, 10) // Position the title at (10) on the page

    //Keterangan
    doc.setFontSize(12); // Set smaller font size for keterangan
    const keterangan = `Nomor Box : ${noBox}`; // Keterangan string
    doc.text(keterangan, 10, 25       , { align: 'left' }); // X = 10 for left alignment, Y = 20

    // Generate the table in the PDF
    doc.autoTable(columns, rows, {
      startY: 30,  // Position from the top
      margin: { horizontal: 10 },
      styles: { fontSize: 8, cellPadding: 3, overflow: 'linebreak' },  // Table style
      headStyles: {
        fillColor: [255, 255, 255], // Set background color of header
        textColor: [0, 0, 0], // Set text color of header
        fontSize: 8, // Set font size of header
        halign: 'left', // Center align text in header
        valign: 'middle', // Center align text vertically in header
        lineWidth: 0.1, // Set line width for the border
        lineColor: [0, 0, 0], // Set border color (black)
      },
      bodyStyles: { 
        fillColor: [255, 255, 255],
        lineWidth: 0.1, // Set line width for the border
        lineColor: [0, 0, 0], // Set border color (black) 
        textColor: 0 },  // Body styles (white)
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        theme: 'grid',  // Table grid lines
    });

    // Retrieve the date from the Angular-bound variable
    const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    // Add the date below the table
    // Add the date below the table
    const dateY = doc.lastAutoTable.finalY + 10; // Position the date below the table
    doc.setFontSize(11); // Set the font size
    doc.text(`Jakarta, ${today}`, 280, dateY, { align: 'right' }); // Align to the right edge
    const img = '/assets/BCA_Finance.png';
    doc.addImage(img, 'PNG', 230, dateY+12, 50, 7); // Adjust X, Y, width, and height as needed
    doc.text(`PT. BCA Finance`, 280, dateY+30, { align: 'right' }); // Align to the right edge


    // Save the PDF
    doc.save(`sampling-${noBox}.pdf`);
  }
  



}
