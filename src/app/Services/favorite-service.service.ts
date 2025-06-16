import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private apiUrl = 'http://localhost:8080/api/favoritos';

  constructor(private http: HttpClient) {}

  addFavorite(usuarioId: number, recetaId: number): Observable<string> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('recetaId', recetaId);

    return this.http.post(this.apiUrl + '/agregar', null, { params, responseType: 'text' });
  }

  listFavorites(usuarioId: number): Observable<any[]> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.get<any[]>(this.apiUrl + '/listar', { params });
  }

  deleteFavorite(usuarioId: number, recetaId: number): Observable<string> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('recetaId', recetaId);

    return this.http.delete(this.apiUrl + '/eliminar', { params, responseType: 'text' });
  }
}
