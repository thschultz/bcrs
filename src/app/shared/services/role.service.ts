/**
 * Title: role.service.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: role api service for the bcrs project
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../models/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http: HttpClient) { }

  // findAllRoles
  findAllRoles(): Observable<any> {
    return this.http.get('/api/roles');
  }

  // findRoleById
  findRoleById(roleId: string): Observable<any> {
    return this.http.get(`/api/roles/${roleId}`);
  }

  // createRole
  createRole(role: Role): Observable<any> {
    return this.http.post(`/api/roles`, {
      text: role.text
    });
  }

  // updateRole
  updateRole(roleId: string, role: Role): Observable<any> {
    return this.http.put(`/api/roles/${roleId}`, {
      text: role.text
    });
  }

  // deleteRole
  deleteRole(roleId: string): Observable<any> {
    return this.http.delete(`/api/roles/${roleId}`);
  }

  // findUserRole
  findUserRole(userName: string): Observable<any> {
    console.log('userName from the findUserRole API ' + userName);
    return this.http.get(`/api/users/${userName}/role`);
  }

}
