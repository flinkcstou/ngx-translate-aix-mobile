import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LanguagePopOverPage } from './language-pop-over.page';

const routes: Routes = [
  {
    path: '',
    component: LanguagePopOverPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LanguagePopOverPage]
})
export class LanguagePopOverPageModule {}
