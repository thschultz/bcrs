import { Inject } from '@angular/core';
/**
 * Title: invoice-summary.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: invoice summary for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Invoice } from '../models/invoice';

@Component({
  selector: 'app-invoice-summary',
  templateUrl: './invoice-summary.component.html',
  styleUrls: ['./invoice-summary.component.css'],
})
export class InvoiceSummaryComponent implements OnInit {
  invoice: Invoice;
  username: string;
  orderDate: string;
  total: number;
  labor: number;
  parts: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.invoice = {} as Invoice;
    this.invoice = data.invoice;
    this.username = '';
    this.orderDate = '';
    this.total = 0;
    this.labor = 0;
    this.parts = 0;

    this.username = this.invoice.getUsername();
    this.orderDate = this.invoice.getOrderDate();
    this.parts = this.invoice.partsAmount;
    this.labor = this.invoice.getLaborAmount();
    this.total = this.invoice.getTotal();

    console.log(this.invoice);
  }

  ngOnInit(): void {}
}
