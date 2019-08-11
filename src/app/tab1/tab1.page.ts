import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LanguagePopOverPage } from '../pages/language-pop-over/language-pop-over.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private popoverCtrl: PopoverController
  ) {
  }

  async openLanguagePopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: LanguagePopOverPage,
      event: ev,
    });
    await popover.present();
  }

}
