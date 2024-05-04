import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { DTDataRequest, DTHttp, DTHttpRequest, DTHttpResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class DTHttpService {
  private http = inject(HttpClient);
  /* private params$ = new BehaviorSubject<DTDataRequest>({
    start: 0,
    length: 10,
    order: [{ column: 0, dir: 'asc' }],
    columns: [],
    search: { value: '', regex: false },
  }); */
  private params$ = new Subject<DTDataRequest>();

  updateParams(params: DTDataRequest) {
    this.params$.next(params);
  }

  /* getData({ url, data, headers, method,  }: DTHttpRequest) {
    return this.params$.pipe(
      switchMap((params) => {
        if (typeof data === 'object') {
          params = { ...params, data };
        }
        if (method === 'post') {
          return this.http.post(url, params, headers);
        } else {
          const queryString = this.toHttpParams(params).slice(0, -1);
          return this.http.get(`${url}?${queryString}`, {
            headers,
          });
        }
      }),
    );
  } */
  getData<T>(
    { url, data, headers, method, pipeResponse }: DTHttp<T>,
    dtParameters?: DTDataRequest,
  ): Observable<DTHttpResponse<T>> {
    if (typeof data === 'object' && dtParameters) {
      dtParameters = { ...dtParameters, data: data };
    }
    if (method === 'get') {
      let queryString = '';
      if (dtParameters) {
        queryString = `?${this.toHttpParams(dtParameters).slice(0, -1)}`;
      }
      return this.http
        .get(`${url}${queryString}`, {
          headers,
        })
        .pipe(
          map((response) => {
            return pipeResponse ? pipeResponse(response as T[]) : response;
          }),
        ) as Observable<DTHttpResponse<T>>;
    }
    return this.http.post(url, dtParameters || data, headers).pipe(
      map((response) => {
        return pipeResponse ? pipeResponse(response as T[]) : response;
      }),
    ) as Observable<DTHttpResponse<T>>;
  }
  private toHttpParams = (
    params: Record<string, unknown> | unknown,
    skipObjects = false,
    prefix = '',
  ): string => {
    let result = '';
    if (typeof params !== 'object' || params === null) {
      return `${prefix}=${encodeURIComponent(String(params))}&`;
    }
    if (Array.isArray(params)) {
      params.forEach((item, index) => {
        const newPrefix = `${prefix}[${index}]`;
        result += this.toHttpParams(item, skipObjects, newPrefix);
      });
    } else {
      Object.entries(params as Record<string, unknown>).forEach(
        ([key, value]) => {
          const newPrefix = `${prefix}${prefix !== '' ? '[' : ''}${key}${
            prefix !== '' ? ']' : ''
          }`;
          if (
            typeof value === 'object' &&
            value !== null &&
            !(value instanceof Array)
          ) {
            result += this.toHttpParams(
              value as Record<string, unknown>,
              skipObjects,
              newPrefix,
            );
          } else if (Array.isArray(value)) {
            result += this.toHttpParams(value, skipObjects, newPrefix);
          } else {
            result += `${newPrefix}=${encodeURIComponent(String(value))}&`;
          }
        },
      );
    }
    return result;
  };
}
