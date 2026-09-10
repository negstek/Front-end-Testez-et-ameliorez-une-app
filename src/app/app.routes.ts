import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {StudentListComponent} from './pages/student-list/student-list.component';
import {StudentDetailComponent} from './pages/student-detail/student-detail.component';
import {StudentFormComponent} from './pages/student-form/student-form.component';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [authGuard]
  },
  {
    // must come before 'students/:id' so it isn't matched as an id
    path: 'students/new',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'students/:id',
    component: StudentDetailComponent,
    canActivate: [authGuard]
  }

];
