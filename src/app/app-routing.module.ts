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
      // Service Children
      {
        path: 'service-list',
        component: ServiceListComponent,
      },
      {
        path: 'service-list/:serviceId',
        component: ServiceDetailsComponent
      }
    ],
    canActivate: [AuthGuard],
  },

  // Session Path
  {
    path: 'session',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
      },
      {
        path: 'server-error',
        component: ServerErrorComponent,
      },
    ],
  },
  // Unexpected URL values will redirect users to the 404 error page
  {
    path: '**',
    redirectTo: 'session/not-found',
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
