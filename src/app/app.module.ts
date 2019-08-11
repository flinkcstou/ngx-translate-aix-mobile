import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { LanguagePopOverPageModule } from './pages/language-pop-over/language-pop-over.module';
import { LanguagePopOverPage } from './pages/language-pop-over/language-pop-over.page';
import { CachesTranslateHttpLoader } from './services/CachesTranslateHttpLoader';
import { HttpService } from './services/http.service';
import { LanguageService } from './services/language.service';

export function createTranslateLoader(languageService: LanguageService, httpClient: HttpClient, http: HttpService, storage: Storage) {
  return new CachesTranslateHttpLoader(languageService, httpClient, http, storage);
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [LanguagePopOverPage],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    LanguagePopOverPageModule,
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [LanguageService, HttpClient, HttpService, Storage]
      }
    })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
