import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const LNG_KEY = 'SELECTED_LANGUAGE';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  constructor(private translate: TranslateService,
              private storage: Storage,
              private plt: Platform) {
  }

  setInitialAppLanguage() {
    const language = this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);

    this.storage.get(LNG_KEY).then(value => {
      if (value) {
        this.setLanguage(value);
        this.selected = value;
      }
    });
  }

  setLanguage(lng: string) {
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LNG_KEY, lng);
  }

  getLanguages() {
    return [
      {text: 'English', value: 'en', img: 'assets/imgs/en.png'},
      {text: 'France', value: 'fr', img: 'assets/imgs/fr.png'},
      {text: 'Espanse', value: 'es', img: 'assets/imgs/es.png'},
    ];
  }


}
