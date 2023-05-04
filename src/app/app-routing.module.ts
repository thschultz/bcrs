/**
 * Title: app-routing.module.ts
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/16/23
 * Description: angular routing for the bcrs project
 */


// Import statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './shared/role.guard';
import { BaseLayoutComponent } from './shared/base-layout/base-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthLayoutComponent } from './shared/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ServerErrorComponent } from './pages/server-error/server-error.component';
import { SecurityQuestionListComponent } from './pages/security-question-list/security-question-list.component';
import { SecurityQuestionDetailsComponent } from './pages/security-question-details/security-question-details.component';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { ServiceListComponent } from './pages/service-list/service-list.component';
import { ServiceDetailsComponent } from './pages/service-details/service-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './shared/forms/forgot-password/forgot-password.component';
import { VerifySecurityQuestionsComponent } from './shared/forms/verify-security-questions/verify-security-questions.component';
import { ResetPasswordComponent } from './shared/forms/reset-password/reset-password.component';
import { ProfileDetailsComponent } from './pages/profile-details/profile-details.component';
import { RolesListComponent } from './pages/roles-list/roles-list.component';
import { RolesDetailsComponent } from './pages/roles-details/roles-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { PurchasesGraphComponent } from './pages/purchases-graph/purchases-graph.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [

      // Main Children
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'contact',
        component: ContactComponent,
      },

      // User Children
      {
        path: 'user-list',
        component: UserListComponent,
      },
      {
        path: 'users/:userId',
        component: UserDetailsComponent
      },
      {
        path: 'user-create',
        component: UserCreateComponent,
      },

      // Security Children
      {
        path: 'security-questions',
        component: SecurityQuestionListComponent,
      },
      {
        path: 'security-questions/:questionId',
        component: SecurityQuestionDetailsComponent,
      },

      // Roles Children
      {
        path: 'roles',
        component: RolesListComponent,
      },
      {
        path: 'roles/:roleId',
        component: RolesDetailsComponent,
      },

      // Service Children
      {
        path: 'service-list',
        component: ServiceListComponent,
      },
      {
        path: 'service-list/:serviceId',
        component: ServiceDetailsComponent
      },

      // User Profile Child
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: 'profile/:userId',
        component: ProfileDetailsComponent
      },

      // Purchase Graph
      {
        path: 'purchase-graph',
        component: PurchasesGraphComponent,
        canActivate: [RoleGuard],
      }
    ],
    canActivate: [AuthGuard],
  },

  // Session Path
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [

      // Login
      {
        path: 'login',
        component: LoginComponent,
      },

      // Register
      {
        path: 'register',
        component: RegisterComponent
      },

      // Forgot Password
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent
      },
      {
        path: 'verify-security-questions',
        component: VerifySecurityQuestionsComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },

      // Error Components
      {
        path: '404',
        component: NotFoundComponent,
      },
      {
        path: '500',
        component: ServerErrorComponent,
      },
    ],
  },
  // Unexpected URL values will redirect users to the 404 error page
  {
    path: '**',
    redirectTo: 'session/404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
