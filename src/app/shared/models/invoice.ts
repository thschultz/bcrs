/**
 * Title: invoice.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Jamal Damir
 * Last Modification Date: 05/07/23
 * Description: Invoice model for the bcrs project
 */

// Imports
import { LineItem } from './line-item.interface';

// Invoice class
export class Invoice {
  // Declaring private properties
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

  // Returns the username associated with the invoice
  getUsername(): string {
    return this.username;
  }

  // Sets the lineItems property to lineItems array
  setLineItems(lineItems: LineItem[]): void {
    this.lineItems = lineItems;
  }

  // Return an array of line items
  getLineItems(): LineItem[] {
    return this.lineItems;
  }

  // Calculates the total value of the line items
  getLineItemTotal(): number {
    let total: number = 0;

    for (let lineItem of this.lineItems) {
      total += lineItem.price;
    }

    return Number(total);
  }

  // Calculates order amount
  getLaborAmount(): number {
    return Number(this.laborHours) * Number(this.LABOR_RATE);
  }

  // Sets order date
  getOrderDate(): string {
    return this.orderDate;
  }

  // Calculates invoice total
  getTotal(): number {
    return (
      Number(this.partsAmount) +
      Number(this.getLaborAmount()) +
      Number(this.getLineItemTotal())
    );
  }

  clear() {
    this.partsAmount = 0;
    this.laborHours = 0;
    this.lineItems = [];
  }
}
