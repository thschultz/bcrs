import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { SelectedSecurityQuestion } from '../../models/security-question.interface';
import { formBuilder, FormGroup, Validators } from "@angular/forms";
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
  constructor() {}

  ngOnInit(): void {}
}
