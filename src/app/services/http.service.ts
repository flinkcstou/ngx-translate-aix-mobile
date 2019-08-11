import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParameterCodec, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

class OptionsBuilder {
  private appendingHeaders: { [key: string]: string }[] = [];
  private appendingParams: { [key: string]: string }[] = [];
  private responseType?: 'json' | 'text' | null;

  public appendHeader(key: string, value: string | null): void {
    if (value !== undefined && value !== null) {
      this.appendingHeaders.push({key: key, value: value});
    }
  }

  public appendParams(key: string, value: string | null): void {
    if (value !== undefined && value !== null) {
      this.appendingParams.push({key: key, value: value});
    }
  }

  public appendResponseType(responseType?: 'json' | 'text' | null) {
    this.responseType = responseType;
  }

  private get headers(): HttpHeaders {
    let ret: HttpHeaders = new HttpHeaders();
    this.appendingHeaders.forEach(h => {
      ret = ret.append(h['key'], h['value']);
    });
    return ret;
  }

  private get params(): HttpParams {
    let ret: HttpParams = new HttpParams({encoder: new WhitespaceEncoder()});
    this.appendingParams.forEach(h => {
      ret = ret.append(h['key'], h['value']);
    });
    return ret;
  }

  public getJson(): RequestOptionsJson {
    return {
      observe: 'response',
      headers: this.headers,
      params: this.params,
      reportProgress: false,
      withCredentials: true,
      responseType: 'json'
    };
  }

  public getText(): RequestOptionsText {
    return {
      observe: 'response',
      headers: this.headers,
      params: this.params,
      reportProgress: false,
      withCredentials: true,
      responseType: 'text'
    };
  }

  public getBlob(): RequestOptionsBlob {
    return {
      observe: 'response',
      headers: this.headers,
      params: this.params,
      reportProgress: false,
      withCredentials: true,
      responseType: 'blob'
    };
  }
}

class WhitespaceEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

class RequestOptions {
  observe: 'response';
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  withCredentials?: boolean;
}

class RequestOptionsJson extends RequestOptions {
  responseType: 'json';
}

class RequestOptionsText extends RequestOptions {
  responseType: 'text';
}

class RequestOptionsBlob extends RequestOptions {
  responseType: 'blob';
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  public url(urlSuffix: string): string {
    return urlSuffix;
  }

  public setPrefix(prefix: string, controllerPrefix?: string): HttpService {
    const prefixHandler = {
      get: function (target: any, name, receiver) {
        if (name === 'url') {
          return (urlSuffix) => {
            if (controllerPrefix) {
              return prefix + controllerPrefix + urlSuffix;
            } else {
              return prefix + urlSuffix;
            }
          };
        }
        return Reflect.get(target, name, receiver);
      }
    } as ProxyHandler<HttpService>;
    return new Proxy(this, prefixHandler);
  }

  public get(urlSuffix: string,
             keyValue?: { [key: string]: string | number | null },
             responseType?: 'json' | 'text' | null): Observable<HttpResponse<any>> {

    const ob: OptionsBuilder = this.newOptionsBuilder();

    if (keyValue) {
      for (const key of Object.keys(keyValue)) {
        const value = keyValue[key];
        if (value !== undefined && value !== null) {
          ob.appendParams(key, value as string);
        }
      }
    }

    switch (responseType) {
      case 'text': {
        return this.http.get(this.url(urlSuffix), ob.getText());
      }
      default: {
        return this.http.get<any>(this.url(urlSuffix), ob.getJson());
      }
    }
  }

  public postJson(urlSuffix: string,
                  keyValue: any,
                  responseType?: 'json' | 'text' | null): Observable<HttpResponse<any>> {
    const ob = this.newOptionsBuilder();
    ob.appendHeader('Content-Type', 'application/json');

    return this.http.post<any>(this.url(urlSuffix), keyValue, ob.getJson());
  }

  public postMultipart(urlSuffix: string, keyValue: any): Observable<HttpResponse<any>> {

    const input = new FormData();
    for (const key of Object.keys(keyValue)) {
      const value = keyValue[key];
      if (value !== undefined && value !== null) {
        input.append(key, value);
      }
    }
    return this.http.post<any>(this.url(urlSuffix), input);
  }

  public post(urlSuffix: string,
              keyValue: { [key: string]: string | number | boolean | null },
              responseType?: 'json' | 'text' | null): Observable<HttpResponse<any>> {
    const ob = this.newOptionsBuilder();
    ob.appendHeader('Content-Type', 'application/x-www-form-urlencoded');

    const data = new URLSearchParams();
    for (const key of Object.keys(keyValue)) {
      const value = keyValue[key];
      if (value !== undefined && value !== null) {
        data.append(key, value as string);
      }
    }

    switch (responseType) {
      case 'text': {
        return this.http.post(this.url(urlSuffix), data.toString(), ob.getText());
      }
      default: {
        return this.http.post<any>(this.url(urlSuffix), data.toString(), ob.getJson());
      }
    }
  }

  public delete(urlSuffix: string,
                keyValue?: { [key: string]: string | number | boolean | null },
                responseType?: 'json' | 'text' | null): Observable<HttpResponse<any>> {
    const ob: OptionsBuilder = this.newOptionsBuilder();

    if (keyValue) {
      for (const key of Object.keys(keyValue)) {
        const value = keyValue[key];
        if (value !== undefined && value !== null) {
          ob.appendParams(key, value as string);
        }
      }
    }

    switch (responseType) {
      case 'text': {
        return this.http.delete(this.url(urlSuffix), ob.getText());
      }
      default: {
        return this.http.delete<any>(this.url(urlSuffix), ob.getJson());
      }
    }
  }

  public async downloadResource(urlSuffix: string,
                                keyValue?: { [key: string]: string | number | boolean | null }): Promise<HttpResponse<Blob>> {
    const ob: OptionsBuilder = this.newOptionsBuilder();

    if (keyValue) {
      for (const key of Object.keys(keyValue)) {
        const value = keyValue[key];
        if (value !== undefined && value !== null) {
          ob.appendParams(key, value as string);
        }
      }
    }

    const response = await this.http.get(this.url(urlSuffix), ob.getBlob()).toPromise();
    const url = window.URL.createObjectURL(response.body);
    const filename: string = decodeURIComponent(response.headers.get('Content-Disposition')
    .split(';')[1]
    .split('=')[1]
    .replace(/["]/g, ''));


    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    window.URL.revokeObjectURL(url);
    return response;
  }

  get token(): string | null {
    return localStorage.getItem('token') || null;
  }

  set token(value: string | null) {
    localStorage.setItem('token', value || '');
  }

  private newOptionsBuilder(): OptionsBuilder {
    const ob = new OptionsBuilder();
    if (localStorage.getItem('token')) {
      ob.appendHeader('token', this.token);
    }
    return ob;
  }
}
