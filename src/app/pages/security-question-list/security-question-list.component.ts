/**
 * Title: security-question-list.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/19/23
 * Description: security question list component for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { SecurityQuestionService } from '../../shared/services/security-question.service';
import { SecurityQuestion } from '../../shared/models/security-question.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Message } from 'primeng/api/message';

@Component({
  selector: 'app-security-question-list',
  templateUrl: './security-question-list.component.html',
  styleUrls: ['./security-question-list.component.css'],
  providers: [ConfirmationService]
})
export class SecurityQuestionListComponent implements OnInit {

  securityQuestions: SecurityQuestion[];
  serverMessages: Message[] = [];

  sqForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(75) ])]
  });

  constructor(private securityQuestionService: SecurityQuestionService, private confirmationService: ConfirmationService, private fb: FormBuilder, private dialog: MatDialog) {
    this.securityQuestions = [];

    this.securityQuestionService.findAllSecurityQuestions().subscribe({
      next: (res) => {
        this.securityQuestions = res.data;
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  ngOnInit(): void {
  }
  // create function
  create(): void {
    const sqText = this.sqForm.controls['text'].value;

    const newSq = {
      text: sqText
    }

    this.securityQuestionService.createSecurityQuestion(newSq).subscribe({
      // successful update
      next: (res) => {
        this.securityQuestions.push(res.data);
      },
      //error message
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.sqForm.controls['text'].setErrors({ 'incorrect': false })
        this.serverMessages = [
          {
            severity: 'success',
            summary: 'Success',
            detail: 'Security Question Added Successfully'
          }
        ]
        window.scroll(0,300);
      }
    })
  }
  //delete function
  delete(sqId: string): void {
    //dialog to confirm that you want to delete
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        header: 'Delete Security Question',
        body: 'Are you sure you want to delete this security question?'
      },

      // User has to click one of the buttons in the dialog box to get it to close
      disableClose: true
    })
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        // message: 'Are you sure that you want to delete this record?',
        // header: 'Confirmation',
        // icon: '<div style="background-color: #D3A625; color: black">pi pi-exclamation-triangle</div>',
        //if you click confirm, function for successful and unsuccessful
        if (result === 'confirm') {
          this.securityQuestionService.deleteSecurityQuestion(sqId).subscribe({
            next: (res) => {
              //successful deleted question
              console.log('Security question deleted successfully!');
              this.securityQuestions = this.securityQuestions.filter(sq => sq._id !== sqId);
              this.serverMessages = [
                {
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Security Question Deleted Successfully'
                }
              ]
              window.scroll(0,300);
            }, // Error if failure
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
              summary: 'Info:',
              detail: ' Deletion Canceled'
            }
          ]
          window.scroll(0,300);
        }
      }
    })
  }

}
