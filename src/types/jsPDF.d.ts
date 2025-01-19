// src/jsPDF.d.ts
import { jsPDF } from 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
    lastAutoTable: any;
  }
}