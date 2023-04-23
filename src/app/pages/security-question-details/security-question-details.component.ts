/**
 * Title: security-question-details.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/19/23
 * Description: security question details component for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { SecurityQuestion } from '../../shared/models/security-question.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityQuestionService } from '../../shared/services/security-question.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-security-question-details',
  templateUrl: './security-question-details.component.html',
  styleUrls: ['./security-question-details.component.css'],
})
export class SecurityQuestionDetailsComponent implements OnInit {
  question: SecurityQuestion;
  questionId: string;
  errorMessages: Message[];

  editForm: FormGroup = this.fb.group({
    text: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(75) ])],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private securityQuestionService: SecurityQuestionService
  ) {
    this.question = {} as SecurityQuestion;
    this.errorMessages = [];
    this.questionId = this.route.snapshot.paramMap.get('questionId') ?? '';

    this.securityQuestionService
      .findSecurityQuestionById(this.questionId)
      .subscribe({
        next: (res) => {
          this.question = res.data;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.editForm.controls['text'].setValue(this.question.text);
        },
      });
  }
  ngOnInit(): void { }
  // save function
  save(): void {
    const updateSecurityQuestion: SecurityQuestion = {
      text: this.editForm.controls['text'].value,
    };
    //successful update sends the user back to the security questions page
    this.securityQuestionService
      .updateSecurityQuestion(this.questionId, updateSecurityQuestion)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/security-questions']);
        },
        //error message if unsuccessful
        error: (e) => {
          this.errorMessages = [
            { severity: 'error', summary: 'Error', detail: e.message },
          ];
          console.log(
            'Error occurred while saving the updated security question.'
          );
        },
      });
  }
  //cancel function to send user back to security questions page
  cancel(): void {
    this.router.navigate(['/security-questions']);
  }
}

