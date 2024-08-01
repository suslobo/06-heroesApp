import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from '../interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  private baseUrl = environments.baseUrl;
  private user?: User;

  constructor(private http: HttpClient) { }

  // get va a regresar un usuario o undefined o null
  get currentUser():User|undefined {
    if ( !this.user ) return undefined;   //si el usuario no existe, devuelve un undefined
    return structuredClone(this.user);  //si el usario existe
  }

  //mandamos llamar un servicio del login
  login( email: string, password: string): Observable<User> {
    //http.post('login', {email, password });
  //hacemos la petición http
  return this.http.get<User>(`${this.baseUrl }/Users/1`)
    .pipe(
      tap( user => this.user = user),
      tap( user => localStorage.setItem('token', 'AS1i2y.3hSD712.63yjasd' )),
      );
  }

  //nuevo método
  checkAuthentication(): Observable <boolean> {
    //si el usuario no está autenticado, si el localStorage.getItem('token') no tiene nada
    if ( !localStorage.getItem('token') ) return of(false);

    const token = localStorage.getItem('token');

    return this.http.get<User>(`${ this.baseUrl }/users/1`)
      .pipe(
        tap( user => this.user = user ),
        map( user => !!user ),
        catchError( err => of(false) )
      );

  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }


}
