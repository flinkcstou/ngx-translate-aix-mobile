import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { HttpClient } from '@angular/common/http';
import {
  exampleEnglish,
  exampleRush,
  NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX,
  NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX,
  NGX_TRANSLATE_LANGUAGE_HTTP_URL_SUFFIX
} from './language.service';
import { NgxLanguageService } from './ngx-language.service';

export class CachesTranslateHttpLoader implements TranslateLoader {

  readonly onTotalValueChange$: Subject<{}> = new Subject();

  constructor(private ngxLanguageService: NgxLanguageService,
              private httpClient: HttpClient,
              private httpService: HttpService) {
    this.httpService = httpService.setPrefix(NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX, NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX);
  }

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<any> {
    const subscribeStorage$ = from(this.ngxLanguageService.getLanguageTranslateFromCache(lang)
      .then(value => {
        if (value) {
          if (lang == 'ru') {
            return exampleEnglish;
          } else {
            return exampleEnglish;
          }
        } else {
          return this.httpService.get(NGX_TRANSLATE_LANGUAGE_HTTP_URL_SUFFIX, {languageCode: lang})
            .toPromise()
            .then(value1 => {
              const isUpdatedLanguageCache = this.ngxLanguageService.updateLanguageFromNGXServerForCache(lang, value1.body);
              if (!isUpdatedLanguageCache) {
                //TODO нужно дополнить логику с кэшом, до сюда доходим если нет ответа в кэше и сервер нам не ответил и мы берем данные с локального JSON
                return this.ngxLanguageService.getLanguageTranslateFromJSON(lang);
              }
              return exampleEnglish;
            });
        }
      }));
    return subscribeStorage$;

  }


}
