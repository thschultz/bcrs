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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  updateForm: FormGroup = this.fb.group({
    serviceName: [null, Validators.compose([Validators.required])],
    price: [null, Validators.compose([Validators.required])],
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

    this.serviceService
      .findServiceById(this.serviceId)
      .subscribe({
        next: (res) => {
          this.service = res.data;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.updateForm.controls['serviceName'].setValue(this.service.serviceName);
          this.updateForm.controls['price'].setValue(this.service.price);
        },
      });
  }

  ngOnInit(): void {
  }

  save(): void {
    const updateService: Service = {
      serviceName: this.updateForm.controls['serviceName'].value,
      price: parseFloat(this.updateForm.controls['price'].value)

    };
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
  cancel(): void {
    this.router.navigate(['/service-list']);
  }

}
