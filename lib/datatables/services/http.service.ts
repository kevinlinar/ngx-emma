import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DTHttp } from '../types';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);

  getData<T>({ url, data, headers, method }: DTHttp): Observable<T> {
    if (method === 'get') {
      return this.http.get<T>(url, { headers });
    }
    return this.http.post<T>(url, data, { headers });
  }

  getData2<T>(): Observable<T> {
    return of([
      {
        id: 2,
        name: 'desde http',
        age: 25,
        country: 'USA',
        lastname: 'Smith ',
      },
      {
        id: 1,
        name: 'Kevin',
        age: 30,
        country: 'USA',
        lastname: 'Linar',
      },
      {
        id: 3,
        name: 'John ',
        age: 20,
        country: 'USA',
        lastname: 'Doe',
      },
    ] as unknown as T);
  }
}
