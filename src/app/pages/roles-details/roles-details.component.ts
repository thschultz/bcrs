/**
 * Title: roles-details.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 05/01/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 05/01/23
 * Description: role details for the bcrs project
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from 'src/app/shared/services/role.service';
import { Message } from 'primeng/api';
import { Role } from 'src/app/shared/models/role.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {

  role: Role;
  roleId: string;
  errorMessage: Message[];

  editForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([Validators.required])]
  })

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private roleService: RoleService) {
    this.role = {} as Role;
    this.errorMessage = [];
    this.roleId = this.route.snapshot.paramMap.get('roleId') ?? '';

    this.roleService.findRoleById(this.roleId).subscribe({
      next: (res) => {
        this.role = res.data;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.editForm.controls['text'].setValue(this.role.text);
      }
    })
  }

  ngOnInit(): void {
  }

  save(): void {
    const updatedRole: Role = {
      text: this.editForm.controls['text'].value
    }

    this.roleService.updateRole(this.roleId, updatedRole).subscribe({
      next: (res) => {
        this.router.navigate(['/roles']);
      },
      error: (e) => {
        this.errorMessage = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
        console.log('Error occurred while saving the updated role')
      }

    })
  }

  cancel(): void {
    this.router.navigate(['/roles'])
  }

}
