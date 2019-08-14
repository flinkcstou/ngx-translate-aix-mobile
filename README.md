# ngx-translate-aix-mobile
language cached on storage(ionic  if language not found in storage get server if server dont answer. language get in en.json file like default 
watch this video: https://www.youtube.com/watch?v=WEh_GY5gpkg

 use this if you get language form server rendering :
 
 import {HttpClient} from "@angular/common/http";
import {TranslateLoader} from "@ngx-translate/core";
import {Observable} from 'rxjs';

export class TranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, public prefix: string = "/assets/i18n/", public suffix: string = ".json") {}

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<Object> {
    return this.http.get(${this.prefix}${lang}${this.suffix});
  }
}
