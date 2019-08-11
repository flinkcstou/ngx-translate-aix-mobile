import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';

export const LNG_KEY = 'SELECTED_LANGUAGE';
export const exampleEnglish = {
  TITLE_1: 'первый титул',
  TITLE_2: 'второй титул',
};

export const NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX = 'https://mobile-stage.aixkz.com/api';
export const NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX = '/web-admin';
export const NGX_TRANSLATE_LANGUAGE_HTTP_URL_SUFFIX = '/language/translate';
export const DEFAULT_LANGUAGE = 'en';
export const LANGUAGE_CODE = 'LANGUAGE_CODE';
export const LANGUAGE_VERSION = 'LANGUAGE_VERSION_'; // KZ_LANGUAGE_VERSION, EN_LANGUAGE_VERSION ...
export const TRANSLATES_LANG = 'TRANSLATES_'; // TRANSLATES_KZ, TRANSLATES_EN ...
export const NGX_TRANSLATE = {};


@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';

  constructor(private translate: TranslateService,
              private storage: Storage,
              private plt: Platform,
              private http: HttpService,
              private localHttp: HttpService) {
    this.http = http.setPrefix(NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX, NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX);
  }

  async setInitialAppLanguage() {

    await this.initFirstDefaultLanguageFromCache();
    await this.initLanguageFromNgx();

  }

  async initFirstDefaultLanguageFromCache() {
    let language = await this.storage.get(LNG_KEY).then(value => value);
    if (language) {
      return;
    } else {
      language = DEFAULT_LANGUAGE;
      this.setDefaultLanguage(language);
      const languageFromJson = await this.getLocalLanguageFromJson(language);
      this.setTranslateLanguageFromCache(language, languageFromJson);
    }

  }

  async initLanguageFromNgx() {
    const language = await this.getDefaultLanguage();
    this.translate.setDefaultLang(language);
    this.translate.use(this.getTranslateLanguage(language));
    this.selected = language;
  }

  async getLocalLanguageFromJson(language: string): Promise<any> {
    return this.localHttp.get('assets/i18n/' + language + '.json')
      .pipe(map(res => res.body
      )).toPromise();
  }

  async getDefaultLanguage(): string {
    return await this.storage.get(LNG_KEY).then(value => value);
  }

  setDefaultLanguage(language: string) {
    this.storage.set(LNG_KEY, language);
  }


  setTranslateLanguageFromCache(languageSuffix: string, value: any) {
    this.storage.set(TRANSLATES_LANG + languageSuffix, value);
  }

  getTranslateLanguage(languageSuffix: string): string {
    return TRANSLATES_LANG + languageSuffix;
  }


  getLanguages() {
    return [
      {text: 'English', value: 'en', img: 'assets/imgs/en.png'},
      {text: 'France', value: 'fr', img: 'assets/imgs/fr.png'},
      {text: 'Espanse', value: 'es', img: 'assets/imgs/es.png'},
    ];
  }


}
