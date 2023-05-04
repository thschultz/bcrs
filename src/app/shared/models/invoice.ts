/**
 * Title: invoice.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: Invoice model for the bcrs project
 */

import { LineItem } from './line-item.interface';

export class Invoice {
  private username: string;
  private lineItems: LineItem[];
  private orderDate: string;
  private LABOR_RATE: number = 50;

  partsAmount: number;
  laborHours: number;

  constructor(username?: string, partsAmount?: number, laborHours?: number) {
    this.username = username || '';
    this.partsAmount = partsAmount || 0;
    this.laborHours = laborHours || 0;
    this.orderDate = new Date().toLocaleDateString();
    this.lineItems = [];
  }

  getUsername(): string {
    return this.username;
  }

  setLineItems(lineItems: LineItem[]): void {
    this.lineItems = lineItems;
  }

  getLineItems(): LineItem[] {
    return this.lineItems;
  }

  getLineItemTotal(): number {
    let total: number = 0;

    for (let lineItem of this.lineItems) {
      total += lineItem.price;
    }

    return Number(total);
  }

  getLaborAmount(): number {
    return Number(this.laborHours) * Number(this.LABOR_RATE);
  }

  getOrderDate(): string {
    return this.orderDate;
  }
}
