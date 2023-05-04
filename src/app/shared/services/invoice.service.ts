/**
 * Title: invoice.service.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 05/01/23
 * Description: invoice api service for the bcrs project
 */

import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  createInvoice(userName: string, invoice: Invoice): Observable<any> {
    return this.http.post(`/api/invoices/${userName}`, {
      userName: userName,
      lineItems: invoice.getLineItems(),
      partsAmount: invoice.partsAmount,
      laborAmount: invoice.getLaborAmount(),
      lineItemTotal: invoice.getLineItemTotal(),
      total: invoice.getTotal()
    })
  }

  findPurchaseByServiceGraph(): Observable<any> {
    return this.http.get(`/api/invoices/purchases-graph`);
  }
}

