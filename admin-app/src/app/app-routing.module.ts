import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AuthorComponent} from './author/author.component'
import {ArticlesComponent} from './articles/articles.component'

const routes: Routes = [
  { path: '', redirectTo: '/author', pathMatch: 'full' },
  { path: 'author', component: AuthorComponent },
  { path: 'articles', component: ArticlesComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}