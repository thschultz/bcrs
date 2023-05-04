/**
 * Title: roles-list.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: list of roles for the bcrs project
*/

import { Component, OnInit } from '@angular/core';
import { Role } from '../../shared/models/role.interface';
import { RoleService } from '../../shared/services/role.service';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-roles-list',
  templateUrl: './roles-list.component.html',
  styleUrls: ['./roles-list.component.css'],
  providers: [ConfirmationService]
})
export class RolesListComponent implements OnInit {

  roles: Role[];
  errorMessages: Message[];

  roleForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  })

  constructor(private roleService: RoleService, private confirmationService: ConfirmationService, private fb: FormBuilder) {
    this.roles = [];
    this.errorMessages = [];

    this.roleService.findAllRoles().subscribe({
      next: (res) => {
        this.roles = res.data
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  ngOnInit(): void {
  }

  create() {
    const newRole: Role = {
      text: this.roleForm.controls['text'].value
    }

    this.roleService.createRole(newRole).subscribe({
      next: (res) => {
        if (res.data) {
          this.roles.push(res.data);
        } else {
          this.errorMessages = [
            { severity: 'error', summary: 'Error', detail: res.message }
          ]
        }
      },
      error: (e) => {
        console.log(e)
      },
      complete: () => {
        this.roleForm.controls['text'].setErrors({ 'incorrect': false })
      }
    })
  }

  delete(roleId: string) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this record?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.deleteRole(roleId).subscribe({
          next: (res) => {
            console.log('Security question deleted successfully!');
            this.roles = this.roles.filter(role => role._id !== roleId);
          },
          error: (e) => {
            console.log(e);
          }
        })
      },
      reject: (type: any) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            console.log('User rejected this operation');
            break;
          case ConfirmEventType.CANCEL:
            console.log('User canceled this operation');
            break;
        }
      }
    })
  }
}
