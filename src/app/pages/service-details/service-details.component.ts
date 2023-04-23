/**
 * Title: service-details.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/19/23
 * Description: service details component for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { Service } from '../../shared/models/service.interface';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceService } from '../../shared/services/service.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-service-details',
  templateUrl: './service-details.component.html',
  styleUrls: ['./service-details.component.css']
})
export class ServiceDetailsComponent implements OnInit {

  service: Service;
  serviceId: string;
  errorMessages: Message[];

  // FormGroup initializer with validators
  updateForm: FormGroup = this.fb.group({
    serviceName: new FormControl('', [ Validators.required, Validators.minLength(3), Validators.maxLength(50) ]),
    price: new FormControl('', [ Validators.required, Validators.pattern('\\-?\\d*\\.?\\d{1,2}'), Validators.maxLength(7) ])
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private serviceService: ServiceService
  ) {
    this.service = {} as Service;
    this.errorMessages = [];
    this.serviceId = this.route.snapshot.paramMap.get('serviceId') ?? '';

    // findServiceById function
    this.serviceService
      .findServiceById(this.serviceId)
      .subscribe({
        next: (res) => {
          this.service = res.data;
        },
        error: (e) => {
          console.log(e);
        },
        // Inserts the prior values into the fields
        complete: () => {
          this.updateForm.controls['serviceName'].setValue(this.service.serviceName);
          this.updateForm.controls['price'].setValue(this.service.price);
        },
      });
  }

  ngOnInit(): void {
  }

  // updateService function
  save(): void {
    const updateService: Service = {
      serviceName: this.updateForm.controls['serviceName'].value,
      price: parseFloat(this.updateForm.controls['price'].value)

    };

    // Updates service with new values and redirects user to Service List page
    this.serviceService
      .updateService(this.serviceId, updateService)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/service-list']);
        },
        error: (e) => {
          this.errorMessages = [
            { severity: 'error', summary: 'Error', detail: e.message },
          ];
          console.log(
            'Error occurred while saving the updated service.'
          );
        },
      });
  }

  // Cancels action and redirects user to Service List page
  cancel(): void {
    this.router.navigate(['/service-list']);
  }

}
