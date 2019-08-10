import { Component } from '@angular/core';
import { AlertController, PopoverController } from '@ionic/angular';
import { LanguagePopOverPage } from '../pages/language-pop-over/language-pop-over.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  params = {
    name: 'nazar'
  };

  constructor(private popoverCtrl: PopoverController,
              private alertCtrl: AlertController,
              private translate: TranslateService,
  ) {
  }

  async openLanguagePopover(ev) {
    const popover = await this.popoverCtrl.create({
      component: LanguagePopOverPage,
      event: ev,
    });
    await popover.present();
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('ALERT.header'),
      message: this.translate.instant('ALERT.msg'),
      buttons: ['OK']
    });
    alert.present();
  }

}
