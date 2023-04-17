/**
 * Title: app-routing.module.ts
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/16/23
 * Description: angular routing for the bcrs project
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BaseLayoutComponent} from "./shared/base-layout/base-layout.component";
import {HomeComponent} from "./pages/home/home.component";
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';

const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
