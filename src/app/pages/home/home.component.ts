/**
 * Title: app.component.ts
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/16/23
 * Description: home component for the bcrs project
*/

import { Component, OnInit, } from '@angular/core';
import { LineItem } from 'src/app/shared/models/line-item.interface';
import { Service } from 'src/app/shared/models/service.interface';
import { Invoice } from 'src/app/shared/models/invoice';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ServiceService } from '../../shared/services/service.service';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { MatDialog } from '@angular/material/dialog';
import { InvoiceSummaryComponent } from 'src/app/shared/invoice-summary/invoice-summary.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string;
  products: Service[];
  lineItems: LineItem[];
  invoice: Invoice;
  errorMessages: Message[];
  successMessages: Message[];
  serviceList: any;
  selectedService: any;
  cart: any;

  constructor(private cookieService: CookieService, private productService: ServiceService,
              private invoiceService: InvoiceService, private dialogRef: MatDialog) {
    this.username = this.cookieService.get('sessionuser') ?? '';
    this.products = [];
    this.lineItems = [];
    this.invoice = {} as Invoice;
    this.errorMessages = [];
    this.successMessages = [];
    this.serviceList = '';
    this.selectedService = '';
    this.cart = '';

    this.productService.findAllServices().subscribe({
      next: (res) => {
        this.products = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
    this.invoice = new Invoice(this.username);

  }

  ngOnInit(): void {
  }



  addToCart() {

  }

  delete() {

  }

  generateInvoice() {
    console.log('generateInvoice() this.invoice');
    console.log(this.invoice);

    console.log('generateInvoice() this.products');
    console.log(this.products);

    for(let product of this.products) {
      if(product.isDisabled) {
        this.lineItems.push(product);
      }
    }

    if(this.lineItems.length > 0) {
      this.invoice.setLineItems(this.lineItems);

      console.log('lineItems.length > 0: this.invoice');
      console.log(this.invoice);

      const dialogRef = this.dialogRef.open(InvoiceSummaryComponent, {
        data: {
          invoice: this.invoice
        },
        disableClose: true,
        width: '800px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result === 'confirm') {
          this.invoiceService.createInvoice(this.username, this.invoice).subscribe({
            next: (res) => {
              console.log('Invoice created');
              this.reloadProducts();
              this.clearLineItems();
              this.invoice.clear();
              this.successMessages = [
                {severity: 'success', summary: 'Success', detail: 'Your order has been processed successfully.'}
              ]
              window.scroll(0,300);
            },
            error: (e) => {
              console.log(e);
            }
          })
        }
        else {
          console.log('order canceled');
          this.reloadProducts();
          this.clearLineItems();
          this.invoice.clear();
        }
      })
    }
    else {
      console.log(this.serviceList)
      this.errorMessages = [
        {severity: 'error', summary: 'Error', detail: 'You must select at least one service.'}
      ]
      window.scroll(0,300);
    }
  }

  reloadProducts() {
    for(let product of this.products) {
      product.isDisabled = false;
    }
  }

  clearLineItems() {
    this.lineItems = [];
  }
}
