import { Injectable } from '@angular/core';
import { LANGUAGE_CODE, LANGUAGE_TRANSLATE, LANGUAGE_VERSION } from './language.service';
import { Storage } from '@ionic/storage';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NgxLanguageService {

  constructor(private storage: Storage) {
  }


  async updateLanguageFromNGXServerForCache(languageSuffix: string, translate: any) {
    if (!languageSuffix && !translate) {
      return false;
    }
    this.setLanguageVersion(languageSuffix, translate.version);
    this.setLanguageTranslateFromCache(languageSuffix, translate.translates);
    return true;
  }

  setLanguageVersion(languageSuffix: string, value: number) {
    this.storage.set(LANGUAGE_VERSION + languageSuffix, value);
  }

  setLanguageTranslateFromCache(languageSuffix: string, value: any) {
    this.storage.set(LANGUAGE_TRANSLATE + languageSuffix, value);
  }

  async getLanguageTranslateFromJSON(languageSuffix: string): Promise<any> {
    return this.localHttp.get('assets/i18n/' + languageSuffix + '.json')
      .pipe(map(res => {
        return res.body;
      }));
  }


  async getLanguageTranslateFromCache(languageSuffix: string) {
    return await this.storage.get(LANGUAGE_TRANSLATE + languageSuffix).then(value => value);
  }


}
