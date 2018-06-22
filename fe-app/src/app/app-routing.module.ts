import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeUserComponent} from './components/home-user/home-user.component';
import {HomeComponent} from './views/home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'profile', component: HomeUserComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}