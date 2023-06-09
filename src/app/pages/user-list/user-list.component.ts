/**
 * Title: user-list.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/19/23
 * Description: user list component for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.interface';
import { UserService } from '../../shared/services/user.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api'
import { Message } from 'primeng/api/message';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  providers: [ConfirmationService]
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  serverMessages: Message[] = [];

  constructor(private router: Router, private userService: UserService, private confirmationService: ConfirmationService, private dialog: MatDialog) {

    // findAllUsers function
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

  // deleteUser function
  delete(userId: string) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          header: 'Delete User',
          body: 'Are you sure you want to delete this user?'
        },

      // User has to click one of the buttons in the dialog box to get it to close
      disableClose: true
    })

    // Subscribe event from dialog box
    dialogRef.afterClosed().subscribe({
      next: (result) => {

        // If delete is confirmed, the user is disabled
        if (result === 'confirm') {
          this.userService.deleteUser(userId).subscribe({
            next: (res) => {
              console.log('User deleted successfully');
              this.users = this.users.filter(user => user._id !== userId)
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'User Deleted Successfully'
                }
              ]
              window.scroll(0,300);
            },

            // Error if failure
            error: (err) => {
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: err.message
                }
              ]
              window.scroll(0,300);
            }
          })

        } else {

          // If delete is canceled, inform user of cancellation
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info',
              detail: 'Deletion Canceled'
            }
          ]
          window.scroll(0,300);
        }
      }
    })
  }

}
