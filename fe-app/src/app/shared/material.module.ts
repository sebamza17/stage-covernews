import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { SideMenuComponent } from './side-menu/side-menu.component';

// Add both on imports and exports the material module to add it to the application
@NgModule({
  imports: [MatButtonModule, MatCheckboxModule],
  exports: [MatButtonModule, MatCheckboxModule],
  declarations: [SideMenuComponent],
})
export class MaterialModule {
}