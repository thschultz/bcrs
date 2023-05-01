/**
 * Title: verify-security-questions.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/26/23
 * Last Modified by: Jamal Damir
 * Last Modification Date: 04/26/23
 * Description: user security question validation for the bcrs project
 */

// Import statements
import { Component, OnInit } from '@angular/core';
import { SelectedSecurityQuestion } from '../../models/selected-security-question.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SessionService } from '../../services/session.service';
import { VerifySecurityQuestionModel } from '../../models/verify-security-question.interface';

@Component({
  selector: 'app-verify-security-questions',
  templateUrl: './verify-security-questions.component.html',
  styleUrls: ['./verify-security-questions.component.css'],
})
export class VerifySecurityQuestionsComponent implements OnInit {
  selectedSecurityQuestions: SelectedSecurityQuestion[];
  verifySecurityQuestionsModel: VerifySecurityQuestionModel;
  username: string;
  errorMessages: Message[];

  // Security questions FormGroup
  form: FormGroup = this.fb.group({
    answerToSecurityQuestion1: [
      null,
      Validators.compose([Validators.required]),
    ],
    answerToSecurityQuestion2: [
      null,
      Validators.compose([Validators.required]),
    ],
    answerToSecurityQuestion3: [
      null,
      Validators.compose([Validators.required]),
    ],
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private sessionService: SessionService
  ) {
    // Setting the value of username property to query parameter username.
    this.username = this.route.snapshot.queryParamMap.get('username') ?? '';
    // Setting value of errorMessages property to empty array
    this.errorMessages = [];
    // Initializing verifySecurityQuestionsModel with an empty object of type VerifySecurityQuestionModel.
    this.verifySecurityQuestionsModel = {} as VerifySecurityQuestionModel;
    // Setting value of selectedSecurityQuestions property to empty array
    this.selectedSecurityQuestions = [];

    // find security questions by username and subscribe to the observable.
    this.userService.findSelectedSecurityQuestions(this.username).subscribe({
      next: (res) => {
        this.selectedSecurityQuestions = res.data;
        console.log(this.selectedSecurityQuestions);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        // Setting verifySecurityQuestionsModel properties to the first 3 questions on the selectedSecurityQuestions Array.
        this.verifySecurityQuestionsModel.question1 =
          this.selectedSecurityQuestions[0].questionText;
        this.verifySecurityQuestionsModel.question2 =
          this.selectedSecurityQuestions[1].questionText;
        this.verifySecurityQuestionsModel.question3 =
          this.selectedSecurityQuestions[2].questionText;

        console.log('Verify security questions model');
        console.log(this.verifySecurityQuestionsModel);
      },
    });
  }

  ngOnInit(): void {}

  VerifySecurityQuestions() {
    // Setting values answerToQuestion(s) to corresponding form controls values
    this.verifySecurityQuestionsModel.answerToQuestion1 =
      this.form.controls['answerToSecurityQuestion1'].value;
    this.verifySecurityQuestionsModel.answerToQuestion2 =
      this.form.controls['answerToSecurityQuestion2'].value;
    this.verifySecurityQuestionsModel.answerToQuestion3 =
      this.form.controls['answerToSecurityQuestion3'].value;

    console.log(this.verifySecurityQuestionsModel);

    this.sessionService
      .verifySecurityQuestions(this.verifySecurityQuestionsModel, this.username)
      .subscribe({
        next: (res) => {
          console.log(res);
          // if the call to the API is successful
          if (res.message === 'success') {
            // Navigate the user to the reset-password route
            this.router.navigate(['/session/reset-password'], {
              queryParams: { isAuthenticated: 'true', username: this.username },
              skipLocationChange: true,
            });
            // If the call to the API is not successful, set the errorMessages property to array of error data
          } else {
            this.errorMessages = [
              {
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to verify security question answers',
              },
            ];
            console.log('Unable to verify security question answers');
          }
        },
        // logs errors
        error: (e) => {
          console.log(e);
        },
      });
  }
}
