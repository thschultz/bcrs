import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.interface';
import { UserService } from '../../shared/services/user.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api'


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ConfirmationService]
})
export class UserListComponent implements OnInit {

  users: User[] = [];

  constructor(private userService: UserService, private confirmationService: ConfirmationService) {
    this.userService.findAllUsers().subscribe({
      next: (res) => {
        this.users = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  ngOnInit(): void {
  }

  delete(userId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(userId).subscribe
      }
    })
  }

}
