import { SelectedSecurityQuestion } from '../models/selected-security-question.interface';
/**
 * Title: user.interface.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/19/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/19/23
 * Description: user interface for the bcrs project
 */

//user interface
export interface User {
  _id?: string;
  userName?: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  email: string;
  selectedSecurityQuestions?: SelectedSecurityQuestion[];
}
