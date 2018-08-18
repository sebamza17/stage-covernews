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

import { Globals } from './globals'

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { MaterialModule } from './shared/material.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ArticleSliderComponent } from './shared/article/article-slider/article-slider.component';
import { ArticleCardComponent } from './shared/article/article-card/article-card.component';
import { HomeUserComponent } from './components/home-user/home-user.component';
import { AuthorSliderComponent } from './shared/author/author-slider/author-slider.component';
import { AuthorCardComponent } from './shared/author/author-card/author-card.component';
import { ArticleLatestComponent } from './shared/article/article-latest/article-latest.component';
import { ArticleCardHorizontalComponent } from './shared/article/article-card-horizontal/article-card-horizontal.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { ArticleBaseComponent } from './shared/article/article-base/article-base.component';
import { FormsModule } from '@angular/forms';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { ArticleComponent } from './views/article/article.component';
import { ArticleCardFullComponent } from './shared/article/article-card-full/article-card-full.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ArticleContentComponent } from './shared/article/article-content/article-content.component';
import { AuthorBaseInfoComponent } from './shared/author/author-base-info/author-base-info.component';
import { LandingBannerComponent } from './components/landing-banner/landing-banner.component';
import { DictiozFeaturesComponent } from './components/dictioz-features/dictioz-features.component';
import { AuthorHeaderComponent } from './components/author-header/author-header.component';
import { SocialMediaComponent } from './components/social-media/social-media.component';
import { AuthorProfileComponent } from './views/author-profile/author-profile.component';
import { ArticleVerticalCardListComponent } from './shared/article/article-vertical-card-list/article-vertical-card-list.component';
import { SafeStylePipe } from './pipes/safe-style.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ArticleLatestComponent,
    ArticleSliderComponent,
    ArticleBaseComponent,
    ArticleContentComponent,
    ArticleCardComponent,
    ArticleCardFullComponent,
    ArticleCardHorizontalComponent,
    ArticleVerticalCardListComponent,
    AuthorSliderComponent,
    AuthorCardComponent,
    AuthorBaseInfoComponent,
    HomeUserComponent,
    SideMenuComponent,
    ArticleComponent,
    SafeHtmlPipe,
    LandingBannerComponent,
    DictiozFeaturesComponent,
    AuthorHeaderComponent,
    SocialMediaComponent,
    AuthorProfileComponent,
    SafeStylePipe
  ],
  imports: [
    FilterPipeModule,
    FormsModule,
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
    Globals,
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
