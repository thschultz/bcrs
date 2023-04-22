/**
 * Title: service.service.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/19/23
 * Description: service api service for the bcrs project
 */

import { Injectable } from '@angular/core';
import { Service } from '../models/service.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

    findAllServices(): Observable<any> {
      return this.http.get('/api/services');
    }

    findServiceById(serviceId: string): Observable<any> {
      return this.http.get('/api/services/' + serviceId);
    }

    createService(newService: Service): Observable<any> {
      return this.http.post('/api/services', {
        serviceName: newService.serviceName,
        price: newService.price
      })
    }

    updateService(serviceId: string, updateService: Service): Observable<any> {
      return this.http.put('/api/services/' + serviceId, {
        serviceName: updateService.serviceName,
        price: updateService.price
      })
    }

    deleteService(serviceId: string): Observable<any> {
      return this.http.delete('/api/services/' + serviceId);
    }

}
