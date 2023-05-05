/**
 * Title: roles-list.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 05/03/23
 * Description: list of roles for the bcrs project
*/

import { Component, OnInit } from '@angular/core';
import { Role } from '../../shared/models/role.interface';
import { RoleService } from '../../shared/services/role.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css'],
  providers: [ConfirmationService]
})
export class RolesListComponent implements OnInit {

  roles: Role[];
  serverMessages: Message[];

  roleForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  })

  constructor(private roleService: RoleService, private confirmationService: ConfirmationService, private fb: FormBuilder, private dialog: MatDialog) {
    this.roles = [];
    this.serverMessages = [];

    this.roleService.findAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  ngOnInit(): void {
  }
  // create role function
  create() {
    const newRole: Role = {
      text: this.roleForm.controls['text'].value
    }

    this.roleService.createRole(newRole).subscribe({
      next: (res) => {
        if (res.data) {
          this.roles.push(res.data);
        } else {
          this.serverMessages = [
            { severity: 'error', summary: 'Error', detail: res.message }
          ]
          window.scroll(0, 300);
        }
      },
      error: (e) => {
        console.log(e)
      },
      complete: () => {
        this.roleForm.controls['text'].setErrors({ 'incorrect': false })
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Role Added Successfully'
          }
        ]
        window.scroll(0, 300);
      }
    })
  }
  // delete role function
  delete(roleId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Role',
        body: 'Are you sure you want to delete this role?'
      },

      // User has to click one of the buttons in the dialog box to get it to close
      disableClose: true
    })

    // Subscribe event from dialog box
    dialogRef.afterClosed().subscribe({
      next: (result) => {

        // If delete is confirmed, the service is disabled
        if (result === 'confirm') {
          this.roleService.deleteRole(roleId).subscribe({
            next: (res) => {
              console.log('Role deleted successfully!');
              this.roles = this.roles.filter(role => role._id !== roleId);
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Role Deleted Successfully'
                }
              ]
              window.scroll(0, 300);
            }, // Error if failure
            error: (err) => {
              this.serverMessages = [
                {
                  severity: 'error',
                  summary: 'Error',
                  detail: err.message
                }
              ]
              window.scroll(0, 300);
            }
          })

        } else {

          // If delete is canceled, inform user of cancellation
          this.serverMessages = [
            {
              severity: 'info',
              summary: 'Info:',
              detail: ' Deletion Canceled'
            }
          ]
          window.scroll(0, 300);
        }
      }
    })
  }
}
