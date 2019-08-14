import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';

export const exampleEnglish = {
  TITLE_1: 'title first',
  TITLE_2: 'title second',
};
export const exampleRush = {
  TITLE_1: 'первый титул',
  TITLE_2: 'второй титул',
};

export const NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX = 'https://mobile-stage.aixkz.com/api';
export const NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX = '/web-admin';
export const NGX_TRANSLATE_LANGUAGE_HTTP_URL_SUFFIX = '/language/translate';
export const NGX_CHECK_LANGUAGE_HTTP_URL_SUFFIX = '/language/check';

export const LANGUAGE_CODE = 'LANGUAGE_CODE';
export const LANGUAGE_VERSION = 'LANGUAGE_VERSION_';
export const LANGUAGE_TRANSLATE = 'TRANSLATE_';


export const DEFAULT_LANGUAGE_CODE = 'en';
export const DEFAULT_LANGUAGE_VERSION = 1;
export const NGX_TRANSLATE = {};


@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  selected = '';
  readonly languages = [
    {id: 'en', title: 'EN'},
    {id: 'ru', title: 'RU'},
    {id: 'kk', title: 'KZ'},
    {id: 'zh', title: '中文'}
  ];

  getLanguages() {
    return this.languages;
  }

  setLanguage(lng: string) {
    debugger;
    let s = false;
    let d = false;
    if (s) {
      this.translate.setTranslation(lng, exampleRush, true);
    }
    this.translate.use(lng);
    this.selected = lng;
    this.storage.set(LANGUAGE_CODE, lng);
  }

  constructor(private translate: TranslateService,
              private storage: Storage,
              private http: HttpService,
              private localHttp: HttpService) {
    this.http = http.setPrefix(NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX, NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX);
  }


  async setInitialAppLanguage() {
    await this.initFirstDefaultLanguageFromCache();
    await this.initDefaultLanguageFromCache();
    await this.initLanguageFromNgx();
  }

  async setBeforeInitalApplanguage() {
    const language = this.storage.get(LANGUAGE_CODE).then(value => {
      if (value) {
        this.translate.setDefaultLang(value);
      } else {
        this.translate.setDefaultLang(DEFAULT_LANGUAGE_CODE);
      }
    });
  }

  async initFirstDefaultLanguageFromCache() {
    let languageCode = await this.getLanguageCode();
    if (languageCode) {
      return;
    } else {
      languageCode = DEFAULT_LANGUAGE_CODE;
      this.setLanguageCode(languageCode);

      const languageTranslateFromJSON = await this.getLanguageTranslateFromJSON(languageCode);
      this.setLanguageTranslateFromCache(languageCode, languageTranslateFromJSON);
      const languageVersion = DEFAULT_LANGUAGE_VERSION;
      this.setLanguageVersion(languageCode, languageVersion);
    }
  }

  async initDefaultLanguageFromCache() {
    const languageCode = await this.getLanguageCode();
    const languageVersion = await this.getLanguageVersion(languageCode);
    const languageVersionCheck = await this.checkLanguage(languageCode, languageVersion);
    const languageTranslate = await this.getLanguageTranslateFromCache(languageCode);
    if (languageVersionCheck || !languageTranslate) {
      await this.updateLanguageFromLanguageCode(languageCode);
    }
  }

  async initLanguageFromNgx() {
    const languageCode = await this.getLanguageCode();
    this.translate.setDefaultLang(languageCode);
    this.translate.use(languageCode);
    this.selected = languageCode;
  }

  async updateLanguageFromLanguageCode(languageSuffix: string) {
    const translateServer = await this.getTranslates(languageSuffix);
    const languageVersion = translateServer.version;
    const languageTranslate = translateServer.translates;
    this.setLanguageVersion(languageSuffix, languageVersion);
    this.setLanguageTranslateFromCache(languageSuffix, languageTranslate);
  }

  updateLanguageFromNgxTranslate(languageSuffix: string) {
    this.storage.get(LANGUAGE_TRANSLATE + languageSuffix).then(value => {
        this.translate.setTranslation(languageSuffix, value, true);
      }
    );
  }

  async checkLanguage(code: any, version: any) {
    return await this.http.get(NGX_CHECK_LANGUAGE_HTTP_URL_SUFFIX, {
      languageCode: code,
      version: version
    }).pipe(map(v => v.body))
      .toPromise()
      .then(value => value);
  }

  getTranslates(code: string) {
    return this.http.get(NGX_TRANSLATE_LANGUAGE_HTTP_URL_SUFFIX, {languageCode: code})
      .pipe(map(v => v.body)).toPromise();
  }


  async getLanguageCode() {
    return await this.storage.get(LANGUAGE_CODE).then(value => value);
  }

  setLanguageCode(language: string) {
    this.storage.set(LANGUAGE_CODE, language);
  }

  async getLanguageTranslateFromCache(languageSuffix: string) {
    return await this.storage.get(LANGUAGE_TRANSLATE + languageSuffix).then(value => value);
  }

  setLanguageTranslateFromCache(languageSuffix: string, value: any) {
    this.storage.set(LANGUAGE_TRANSLATE + languageSuffix, value);
  }

  async getLanguageVersion(languageSuffix: string) {
    return await this.storage.get(LANGUAGE_VERSION + languageSuffix).then(value => value);
  }

  setLanguageVersion(languageSuffix: string, value: number) {
    this.storage.set(LANGUAGE_VERSION + languageSuffix, value);
  }


  async getLanguageTranslateFromJSON(languageSuffix: string): Promise<any> {
    return this.localHttp.get('assets/i18n/' + languageSuffix + '.json')
      .pipe(map(res => {
        return res.body;
      }))
      .toPromise();
  }

  getLanguageTranslateSuffix(languageSuffix: string): string {
    return LANGUAGE_TRANSLATE + languageSuffix;
  }

  crashSetDefaultLanguage() {
    const languageCode = LANGUAGE_CODE + DEFAULT_LANGUAGE_CODE;
    this.setLanguageCode(DEFAULT_LANGUAGE_CODE);
    this.setLanguageVersion(languageCode, DEFAULT_LANGUAGE_VERSION);
  }

}
