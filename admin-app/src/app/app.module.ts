import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule,MatAutocompleteModule,MatPaginatorModule,MatTableModule,MatInputModule,MatSelectModule,MatOptionModule,MatFormFieldModule, MatExpansionModule, MatButtonModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule} from '@angular/material';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { DashboardComponent } from './app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthorComponent,AuthorEditComponent } from './author/author.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule,ReactiveFormsModule }    from '@angular/forms';
import { ArticlesComponent } from './articles/articles.component';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    DashboardComponent,
    AuthorComponent,
    AuthorEditComponent,
    ArticlesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    AppRoutingModule,
  ],
  entryComponents:[
    AuthorEditComponent
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class AppModule { }
