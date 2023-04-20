import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user.interface';
import { Message } from "primeng/api";

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css'],
})
export class UserCreateComponent implements OnInit {
  form: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'),
      ]),
    ],
    firstName: [null, Validators.compose([Validators.required])],
    lastName: [null, Validators.compose([Validators.required])],
    phoneNumber: [null, Validators.compose([Validators.required])],
    address: [null, Validators.compose([Validators.required])],

  });

  user: User;
  userId: string;
  errorMessages: Message[] = [];

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.user = {} as User;
    this.userId = '';
  }

  ngOnInit(): void {}

  createUser(): void {
    const newUser: User = {
      userName: this.form.controls['userName'].value,
      password:this.form.controls['password'].value,
      firstName:this.form.controls['firstName'].value,
      lastName:this.form.controls['lastName'].value,
      phoneNumber:this.form.controls['phoneNumber'].value,
      address:this.form.controls['address'].value,
      email:this.form.controls['email'].value,
    };

    this.userService.createUser(newUser).subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(['/users'])
      },
      error: (err) => {
        this.errorMessages = [
          {severity: 'error', summary:'Error', detail: err.message}
        ]
        console.log(`Node.js server error; httpCode: ${err.httpCode};message:${err.message}`)
        console.log(err);
      }
    })
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
 }
