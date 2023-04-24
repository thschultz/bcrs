/**
 * Title: user-create.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Jamal Damir
 * Last Modification Date: 04/19/23
 * Description: user-create component for the bcrs project
 */

// Import Statements
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.interface';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  form: FormGroup = this.fb.group({
    userName: [null, Validators.compose([ Validators.required ])],
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'),
      ]),
    ],
    firstName: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(35) ])],
    lastName: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(35) ])],
    phoneNumber: [null, Validators.compose([ Validators.required, Validators.pattern('\\d{3}\\-\\d{3}-\\d{4}') ])],
    address: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(75) ])],
    email: [null, Validators.compose([ Validators.required, Validators.email ])],
  });

  user: User;
  userId: string;
  errorMessages: Message[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.user = {} as User;
    this.userId = '';
  }

  ngOnInit(): void { }
  //create user function
  createUser(): void {
    const newUser: User = {
      //variables for form.
      userName: this.form.controls['userName'].value,
      password: this.form.controls['password'].value,
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      address: this.form.controls['address'].value,
      email: this.form.controls['email'].value,
    };
    //successful save and error handling
    this.userService.createUser(newUser).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/user-list']);
      },
      error: (err) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: err.message },
        ];
        console.log(
          `Node.js server error; httpCode: ${err.httpCode};message:${err.message}`
        );
        console.log(err);
      },
    });
  }
  //cancel navigates to user list page
  cancel(): void {
    this.router.navigate(['/user-list']);
  }
}
