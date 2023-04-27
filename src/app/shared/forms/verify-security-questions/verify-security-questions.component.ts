import { VerifySecurityQuestion } from './../../models/verify-security-question.interface';
import { Component, OnInit } from '@angular/core';
import { SelectedSecurityQuestion } from "../../models/selected-security-question.interface"
import { SelectedSecurityQuestionModel } from '../../models/security-question.interface';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Message }  from "primeng/api";
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from "../../services/user.service";
import { SessionService } from '../../services/session.service';
import { VerifySecurityQuestionModel } from "../../models/verify-security-question.interface"

@Component({
  selector: 'app-verify-security-questions',
  templateUrl: './verify-security-questions.component.html',
  styleUrls: ['./verify-security-questions.component.css'],
})
export class VerifySecurityQuestionsComponent implements OnInit {
selectedSecurityQuestions: SelectedSecurityQuestion[];
VerifySecurityQuestionsModel: VerifySecurityQuestionModel;
username: string;
errorMessage: Message[]


form: FormGroup = this.fb.group({
  answerToSecurityQuestion1: [null, Validators.compose{[Validators.required]}],
  answerToSecurityQuestion2: [null, Validators.compose{[Validators.required]}],
  answerToSecurityQuestion3: [null, Validators.compose{[Validators.required]}],
})
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private userService: UserService, private sessionService: SessionService) {

  }

  ngOnInit(): void {}
}
