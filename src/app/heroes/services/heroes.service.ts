import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { map } from 'rxjs/operators';
import { Hero } from '../interfaces/hero.interface';
import { environments } from '../../../environments/environments';

@Injectable({ providedIn: 'root' })
export class HeroesService {

  private baseUrl: string = environments.baseUrl;

  constructor(private http: HttpClient) { }


  getHeroes():Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById( id: string ): Observable<Hero|undefined> {
    return this.http.get<Hero>(`${ this.baseUrl }/heroes/${ id }`)
      .pipe(
        catchError( error => of(undefined) )
      );
  }

  getSuggestions( query: string ): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${ this.baseUrl }/heroes?q=${ query }&_limit=6`);
  }

  //contruimos los 3 CRUD que nos hacen falta. tres endpoints
  //agregamos
  addHero( hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${ this.baseUrl }/heroes`, hero);
  }

  //actualizamos datos
  updateHero( hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required');  //si no existe

    return this.http.patch<Hero>(`${ this.baseUrl }/heroes/${ hero.id}`, hero);
  }

  //eliminamos
  // si no da error no entra el catchError, si todo sale bien entra el map, el true
  deleteHeroById( id: string): Observable<boolean> {

    return this.http.delete(`${ this.baseUrl }/heroes/${ id}`)
      .pipe(
        catchError(err => of(false)), //quere decir que no se borró
        map( resp => true)
      );
  }



}
