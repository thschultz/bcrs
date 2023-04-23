/**
 * Title: security-question.service.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/19/23
 * Description: security question api service for the bcrs project
 */

import { Injectable } from '@angular/core';
import { SecurityQuestion } from '../models/security-question.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

//service to grab information from the securityquestions API
export class SecurityQuestionService {

  constructor(private http: HttpClient) { }
  //gets all security questions
  findAllSecurityQuestions(): Observable<any> {
    return this.http.get('/api/security');
  }
  //find security question by id
  findSecurityQuestionById(questionId: string): Observable<any> {
    return this.http.get('/api/security/' + questionId);
  }
  //creating security questions
  createSecurityQuestion(newSecurityQuestion: SecurityQuestion): Observable<any> {
    return this.http.post('/api/security', {
      text: newSecurityQuestion.text
    })
  }
  //update security question
  updateSecurityQuestion(questionId: string, updateSecurityQuestion: SecurityQuestion): Observable<any> {
    return this.http.put('/api/security/' + questionId, {
      text: updateSecurityQuestion.text
    })
  }
  //delete security question
  deleteSecurityQuestion(questionId: string): Observable<any> {
    return this.http.delete('/api/security/' + questionId);
  }
}
