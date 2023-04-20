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
<<<<<<< HEAD
    text: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private securityQuestionService: SecurityQuestionService
  ) {
=======
    text: [null, Validators.compose([Validators.required])]
  });

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private securityQuestionService: SecurityQuestionService) {
>>>>>>> 4c36f34a40a1001fef1a154295c2f66ce83ec4d7
    this.question = {} as SecurityQuestion;
    this.errorMessages = [];
    this.questionId = this.route.snapshot.paramMap.get('questionId') ?? '';

<<<<<<< HEAD
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
  ngOnInit(): void {}

  save(): void {
    const updateSecurityQuestion: SecurityQuestion = {
      text: this.editForm.controls['text'].value,
    };
    this.securityQuestionService
      .updateSecurityQuestion(this.questionId, updateSecurityQuestion)
      .subscribe({
        next: (res) => {
          this.router.navigate(['/security-questions']);
        },
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
  cancel(): void {
    this.router.navigate(['/security-questions']);
  }
=======
    this.securityQuestionService.findSecurityQuestionById(this.questionId).subscribe({
      next: (res) => {
        this.question = res.data;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.editForm.controls['text'].setValue(this.question.text);
      }
    })
  }
  ngOnInit(): void {
  }

  save(): void {
    const updatedSecurityQuestion: SecurityQuestion = {
      text: this.editForm.controls['text'].value
    }
    this.securityQuestionService.updateSecurityQuestion(this.questionId, updatedSecurityQuestion).subscribe({
      next: (res) => {
        this.router.navigate(['/security-questions']);
      },
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
        console.log("Error occurred while saving the updated security question.")
      }
    })
  }
  cancel(): void {
    this.router.navigate(['/security-questions'])
  }
>>>>>>> 4c36f34a40a1001fef1a154295c2f66ce83ec4d7
}

