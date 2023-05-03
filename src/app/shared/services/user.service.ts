/**
 * Title: user.service.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/19/23
 * Description: user api service for the bcrs project
 */

import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  //find all users function
  findAllUsers(): Observable<any> {
    return this.http.get('/api/users');
  }
  //find user by id function
  findUserById(userId: string): Observable<any> {
    return this.http.get('/api/users/' + userId);
  }
  //create user function
  createUser(user: User): Observable<any> {
    return this.http.post('/api/users', {
      userName: user.userName,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
    });
  }
  //update user function
  updateUser(userId: string, user: User): Observable<any> {
    return this.http.put('/api/users/' + userId, {
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      address: user.address,
      email: user.email,
      role: user.role
    });
  }
  //delete user function
  deleteUser(userId: string): Observable<any> {
    return this.http.delete('/api/users/' + userId);
  }

  // find selected security questions
  findSelectedSecurityQuestions(username: string): Observable<any> {
    return this.http.get('api/users/' + username + '/security-questions');
  }
}
