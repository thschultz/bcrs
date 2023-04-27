/**
 * Title: session.module.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/19/23
 * Description: session api service for the bcrs project
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.interface';
import { VerifySecurityQuestion } from '../models/verify-security-question.interface';

@Injectable({
  providedIn: 'root',
})

export class SessionService {
  constructor(private http: HttpClient) { }
  //login function from session API
  login(userName: string, password: string): Observable<any> {
    return this.http.post('/api/session/login', {
      userName,
      password,
    });
  }

  register(user: User): Observable<any> {
    return this.http.post('/api/session/register', {
      userName: user.userName,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      address: user.address,
      selectedSecurityQuestions: user.selectedSecurityQuestions
    })
  }

  verifyUsername(username: string): Observable<any> {
    return this.http.get('/api/session/verify/users/' + username);
  }

  verifySecurityQuestions(model: VerifySecurityQuestion, username: string): Observable<any> {
    return this.http.post('/api/session/verify/users/' + username + '/security-questions', {
      questionText1: model.question1,
      questionText2: model.question2,
      questionText3: model.question3,
      answerText1: model.answerToQuestion1,
      answerText2: model.answerToQuestion2,
      answerText3: model.answerToQuestion3
    })
  }

  updatePassword(password: string, username: string): Observable<any> {
    return this.http.post('/api/session/users/' + username + '/reset-password', {
      password
    })
  }
}
