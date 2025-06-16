import { Injectable } from '@angular/core';
import { User } from '../Models/User/user';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  /** Metodo para registrar un nuevo usuario*/
  register(user: User): Observable<boolean> {
    const params = new HttpParams()
      .set('email', user.getEmail())
      .set('password', user.getPassword())
      .set('nombre', user.getName());

    return this.http
      .post<any>(this.apiUrl + '/register', null, { params })
      .pipe(
        map((response) => {
          if (response.error) return false;

          const newUser = new User(
            response.nombre,
            response.email,
            user.getPassword(),
            Number(response.id)
          );

          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              id: newUser.getId(),
              name: newUser.getName(),
              email: newUser.getEmail(),
              password: newUser.getPassword(),
            })
          );

          return true;
        }),
        catchError(() => of(false))
      );
  }

  /** Metodo para iniciar sesion usuario */
  login(email: string, password: string): Observable<boolean> {
    const params = new HttpParams()
      .set('email', email)
      .set('password', password);

    return this.http.post<any>(this.apiUrl + '/login', null, { params }).pipe(
      map((response) => {
        if (response.error) return false;

        const user = new User(response.nombre, response.email, password, Number(response.id));
        localStorage.setItem(
          this.currentUserKey,
          JSON.stringify({
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
          })
        );
        return true;
      }),
      catchError((err) => of(false))
    );
  }

  getCurrentUser(): User | null {
    const userJSON = localStorage.getItem(this.currentUserKey);
    if (!userJSON) return null;

    const data = JSON.parse(userJSON);
    const user = new User(data.name, data.email, data.password, data.id);
    return user;
  }

  logOut(): void {
    localStorage.removeItem(this.currentUserKey);
  }
}
