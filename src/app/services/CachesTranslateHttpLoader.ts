import { TranslateLoader } from '@ngx-translate/core';
import { from, Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import {
  exampleEnglish,
  LanguageService,
  NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX,
  NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX,
  NGX_TRANSLATE_LANGUAGE_HTTP_URL_SUFFIX
} from './language.service';

export class CachesTranslateHttpLoader implements TranslateLoader {

  readonly onTotalValueChange$: Subject<{}> = new Subject();

  constructor(private languageService: LanguageService,
              private httpClient: HttpClient,
              private httpService: HttpService,
              private storage: Storage) {
    this.httpService = httpService.setPrefix(NGX_TRANSLATE_LANGUAGE_HTTP_PREFIX, NGX_TRANSLATE_LANGUAGE_HTTP_CONTROLLER_PREFIX);
  }

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<any> {
    const subscribeStorage$ = from(this.storage.get(lang)
      .then(value => {
        if (value) {
          return exampleEnglish;
        } else {
          return this.httpService.get(NGX_TRANSLATE_LANGUAGE_HTTP_URL_SUFFIX, {languageCode: lang})
            .toPromise()
            .then(value1 => {

              return exampleEnglish;
            });
        }
      }));
    return subscribeStorage$;

  }


}
