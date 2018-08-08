import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeUserComponent } from './components/home-user/home-user.component';
import { HomeComponent } from './views/home/home.component';
import { ArticleComponent } from './views/article/article.component';
import { AuthorProfileComponent } from './views/author-profile/author-profile.component';
import { CheckoutComponent } from './views/checkout/checkout.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'article/:articleId', component: ArticleComponent},
  {path: 'profile', component: HomeUserComponent},
  {path: 'author/:authorId', component: AuthorProfileComponent},
  {path: 'subscriptions/checkout', component: CheckoutComponent},
  {path: '**', redirectTo: '/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
