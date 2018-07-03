import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { TokenInterceptor } from './shared/interceptor.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { MaterialModule } from "./shared/material.module";
import { NavbarComponent } from './components/navbar/navbar.component';
import { ArticleSliderComponent } from './shared/article/article-slider/article-slider.component';
import { ArticleCardComponent } from './shared/article/article-card/article-card.component';
import { HomeUserComponent } from './components/home-user/home-user.component';
import { AuthorSliderComponent } from "./shared/author/author-slider/author-slider.component";
import { AuthorCardComponent } from "./shared/author/author-card/author-card.component";
import { ArticleLatestComponent } from "./shared/article/article-latest/article-latest.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ArticleLatestComponent,
    ArticleSliderComponent,
    ArticleCardComponent,
    AuthorSliderComponent,
    AuthorCardComponent,
    HomeUserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
