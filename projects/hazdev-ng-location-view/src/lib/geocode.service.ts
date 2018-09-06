import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable ,  of ,  BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Injectable()
export class GeocodeService {
  // Documentation:
  // https://developers.arcgis.com/rest/geocode/api-reference/geocoding-geocode-addresses.htm
  public readonly API_URL = 'https://geocode.arcgis.com/arcgis/rest/services/' +
      'World/GeocodeServer/find';

  public location$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public error$: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor (private http: HttpClient) {}

  buildUrl (address: string): string {
    return this.API_URL + '?' + `f=json` + `&text=${address}`;
  }

  checkLocation (address: string): void {
    if (!address || address === '') {
      // timeout is necessary for some reason
      setTimeout(() => {
        this.error$.next('An address is required.');
        this.location$.next(null);
      }, 0);
      return;
    }
  }

  empty (): void {
    this.location$.next(null);
    this.error$.next(null);
  }

  getLocation (address: string): void {
    const url = this.buildUrl(address);

    this.checkLocation(address);

    // make a geocode request
    this.http.get<any>(url).pipe(
      catchError(this.handleError('getLocation', { locations: null }))
    ).subscribe((response) => {
      if (response.locations && response.locations.length !== 0) {
        this.location$.next(response.locations[0]);
      } else {
        this.error$.next('No results. Please search again.');
        this.location$.next(null);
      }
    });
  }

  handleError<T> (action: string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
