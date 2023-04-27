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
  errorMessage: Message[];

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
    this.username = this.route.snapshot.queryParamMap.get('username') ?? '';
    this.errorMessage = [];
    this.verifySecurityQuestionsModel = {} as VerifySecurityQuestionModel;
    this.selectedSecurityQuestions = [];

    this.userService.findSelectedSecurityQuestions(this.username).subscribe({
      next: (res) => {
        this.selectedSecurityQuestions = res.data;
        console.log(this.selectedSecurityQuestions);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
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
          if (res.message === 'success') {
            this.router.navigate(['/session/reset-password'], {
              queryParams: { isAuthenticated: 'true', username: this.username },
              skipLocationChange: true,
            });
          } else {
            this.errorMessage = [
              {
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to verify security question answers',
              },
            ];
            console.log('Unable to verify security question answers');
          }
        },
        error: (e) => {
          console.log(e);
        },
      });
  }
}
