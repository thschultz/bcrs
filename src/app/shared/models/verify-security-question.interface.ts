/**
 * Title: verify-security-question.interface.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/26/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/26/23
 * Description: security question verification interface for the bcrs project
 */

export interface VerifySecurityQuestionModel {
  question1: string;
  question2: string;
  question3: string;
  answerToQuestion1: string;
  answerToQuestion2: string;
  answerToQuestion3: string;
}
