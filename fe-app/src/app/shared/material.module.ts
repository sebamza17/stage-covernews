import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { ArticleCardComponent } from './article/article-card/article-card.component';
import { ArticleSliderComponent } from './article/article-slider/article-slider.component';

// Add both on imports and exports the material module to add it to the application
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule],
  exports: [MatButtonModule, MatCheckboxModule],
})
export class MaterialModule {
}