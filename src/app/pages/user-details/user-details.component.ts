/**
 * Title: user-details.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/19/23
 * Description: user details component for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.interface';
import { Message } from 'primeng/api';
import { Role } from 'src/app/shared/models/role.interface';
import { RoleService } from 'src/app/shared/services/role.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user: User;
  userId: string;
  roles: Role[];
  errorMessages: Message[];

  form: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(35) ])],
    lastName: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(35) ])],
    phoneNumber: [null, Validators.compose( [Validators.required, Validators.pattern('\\d{3}\\-\\d{3}-\\d{4}') ])],
    email: [null, Validators.compose([ Validators.required, Validators.email ])],
    address: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(75) ])],
    role: [null,Validators.compose([Validators.required])]
  });

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private userService: UserService, private roleService: RoleService) {

    this.userId = this.route.snapshot.paramMap.get('userId') ?? '';
    this.user = {} as User;
    this.roles = [];
    this.errorMessages = [];

    this.userService.findUserById(this.userId).subscribe({
      next: (res) => {
        this.user = res.data;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.form.controls['firstName'].setValue(this.user.firstName);
        this.form.controls['lastName'].setValue(this.user.lastName);
        this.form.controls['phoneNumber'].setValue(this.user.phoneNumber);
        this.form.controls['email'].setValue(this.user.email);
        this.form.controls['address'].setValue(this.user.address);
        this.form.controls['role'].setValue(this.user.role?.text ?? 'standard');

        console.log(this.user);

        this.roleService.findAllRoles().subscribe({
          next: (res) => {
            this.roles = res.data;
          },
          error: (e) => {
            console.log(e);
          }
        })
      }
    })
  }

  ngOnInit(): void {
  }

  //save user function
  saveUser(): void {
    const updateUser = {
      firstName: this.form.controls['firstName'].value,
      lastName: this.form.controls['lastName'].value,
      phoneNumber: this.form.controls['phoneNumber'].value,
      email: this.form.controls['email'].value,
      address: this.form.controls['address'].value,
      role: { text:this.form.controls['role'].value }
    }
    //if successful, takes them to user list page.
    this.userService.updateUser(this.userId, updateUser).subscribe({
      next: (res) => {
        this.router.navigate(['/user-list']);
      },
      //error handling
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
        console.log(`Node.js server error; httpCode:${e.httpcode};message:${e.message}`)
        console.log(e);
      }
    })
  }
  //cancel function to lead back to user list page
  cancel(): void {
    this.router.navigate(['/user-list'])
  }

}
