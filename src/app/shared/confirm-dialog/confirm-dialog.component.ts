/**
 * Title: confirm-dialog.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/16/23
 * Description: confirmation dialog for irreversible actions for the bcrs project
*/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { DialogData } from '../models/dialog-data.interface'

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})

export class ConfirmDialogComponent implements OnInit {
  dialogData: DialogData

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data
  }

  ngOnInit(): void {
  }

}
