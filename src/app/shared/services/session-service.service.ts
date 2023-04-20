import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {

  constructor(private http: HttpClient) { }

  login(userName: string, password: string): Observable<any> {
    return this.http.post('/api/session/login', {
      userName,
      password
    })
  }
}
