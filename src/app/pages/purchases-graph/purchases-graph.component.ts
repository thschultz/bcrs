/**
 * Title: purchases-graph.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/03/23
 * Description: purchases by service graph for the bcrs project
*/

import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../shared/services/invoice.service'

@Component({
  selector: 'app-purchases-graph',
  templateUrl: './purchases-graph.component.html',
  styleUrls: ['./purchases-graph.component.css']
})

export class PurchasesGraphComponent implements OnInit {

  purchases: any;
  data: any;
  itemCount: string[];
  labels: string[];

  constructor(private invoiceService: InvoiceService) {

    this.purchases = {};
    this.data = {};
    this.itemCount = [];
    this.labels = [];

    // API call to find, sort, and count all service purchases
    this.invoiceService.findPurchasesByServiceGraph().subscribe({
      next: (res) => {
        this.purchases = res.data;
        console.log(this.purchases);

        // Loop over the purchases to split out the services and item count
        for (const item of this.purchases) {
          console.log('Item object');
          console.log(item._id);
          let title = item._id.title;
          let count = item.count;
          this.labels.push(title);
          this.itemCount.push(count);
        }

        // Build the object literal for the primeNG bar graph
        this.data = {
          labels: this.labels, // Labels for services

          // Graph Object
          datasets: [{

            backgroundColor: [
              '#ED0A3F',
              '#FF8833',
              '#5FA777',
              '#0066CC',
              '#6B3FA0',
              '#AF593E',
              '#6CDAE7'
            ],

            hoverBackgroundColor: [
              '#ED0A3F',
              '#FF8833',
              '#5FA777',
              '#0066CC',
              '#6B3FA0',
              '#AF593E',
              '#6CDAE7'
            ],

            data: this.itemCount
          }]
        };

        // Verify the data object structure matches primeNG's expected format
        console.log('Data object');
        console.log(this.data);
      },

      error: (e) => {
        console.log(e)
      }
    })
  }

  ngOnInit(): void {
  }

}
