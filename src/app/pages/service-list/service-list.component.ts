/**
 * Title: service-list.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/19/23
 * Description: service list component for the bcrs project
 */

import { Component, OnInit } from '@angular/core';

import { ServiceService } from '../../shared/services/service.service';
import { Service } from '../../shared/models/service.interface';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Message } from 'primeng/api';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
  providers: []
})
export class ServiceListComponent implements OnInit {

  services: Service[] = [];
  serverMessages: Message[] = [];

  // FormGroup initializer with Validators
  serviceForm: FormGroup = this.fb.group({
    serviceName: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ]),
    price: new FormControl('', [ Validators.required, Validators.pattern('\\-?\\d*\\.?\\d{1,2}'), Validators.maxLength(7) ])
  });

  constructor(private serviceService: ServiceService, private fb: FormBuilder, private dialog: MatDialog) {
    this.services = [];
    this.serverMessages = [];

    // findAllServices function
    this.serviceService.findAllServices().subscribe({
      next: (res) => {
        this.services = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  ngOnInit(): void {
  }

  // createService function
  create(): void {
    const serviceName = this.serviceForm.controls['serviceName'].value;
    const price = parseFloat(this.serviceForm.controls['price'].value);


    const newService = {
      serviceName: serviceName,
      price: price
    }

    this.serviceService.createService(newService).subscribe({
      next: (res) => {
        this.services.push(res.data);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.serviceForm.controls['serviceName'].setErrors({ 'incorrect': false })
        this.serviceForm.controls['price'].setErrors({ 'incorrect': false })
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Service Added Successfully'
          }
        ]
        window.scroll(0,300);
      }
    })
  }

  // deleteService function
  delete(serviceId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Service',
        body: 'Are you sure you want to delete this service?'
      },

      // User has to click one of the buttons in the dialog box to get it to close
      disableClose: true
    })

    // Subscribe event from dialog box
    dialogRef.afterClosed().subscribe({
      next: (result) => {

        // If delete is confirmed, the service is disabled
        if (result === 'confirm') {
          this.serviceService.deleteService(serviceId).subscribe({
            next: (res) => {
              console.log('Service deleted successfully!');
              this.services = this.services.filter(service => service._id !== serviceId);
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Service Deleted Successfully'
                }
              ]
              window.scroll(0,300);
            }, // Error if failure
            error: (err) => {
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: err.message
                }
              ]
              window.scroll(0,300);
            }
          })

        } else {

          // If delete is canceled, inform user of cancellation
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info:',
              detail: ' Deletion Canceled'
            }
          ]
          window.scroll(0,300);
        }
      }
    })
  }

}
