import { Injectable } from '@angular/core';
import { SecurityQuestion } from '../models/security-question.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityQuestionService {

  constructor(private http: HttpClient) { }

  findAllSecurityQuestions(): Observable<any> {
    return this.http.get('/api/security-routes');
  }

  findSecurityQuestionById(questionId: string): Observable<any> {
    return this.http.get('/api/security-routes' + questionId);
  }

  createSecurityQuestion(newSecurityQuestion: SecurityQuestion): Observable<any> {
    return this.http.post('/api/security-routes', {
      text: newSecurityQuestion.text
    })
  }

  updateSecurityQuestion(questionId: string, updateSecurityQuestion: SecurityQuestion): Observable<any> {
    return this.http.put('/api/security-routes' + questionId, {
      text: updateSecurityQuestion.text
    })
  }

  deleteSecurityQuestion(questionId: string): Observable<any> {
    return this.http.delete('/api/security-routes' + questionId);
  }
}
