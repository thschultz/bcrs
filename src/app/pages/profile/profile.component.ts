
// Title: profile.component.ts
// Author: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
// Date: 04/19/23
// Last Modified by: Thomas Schultz
// Last Modification Date: 04/29/23
// Description: html for the bcrs project


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../shared/models/user.interface';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  user: User;
  userId: string;
  constructor(private userService: UserService, private cookieService: CookieService) {

    this.userId = this.cookieService.get('session-id');
    this.user = {} as User;


    // Collects user data and can be displayed on the profile page
    this.userService.findUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })

  }

  ngOnInit(): void {
  }
}



