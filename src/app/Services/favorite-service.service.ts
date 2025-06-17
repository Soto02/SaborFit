import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../Models/Recipe/recipe';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {

  constructor(private http: HttpClient) {}

  addFavorite(usuarioId: number, idExterno: string): Observable<string> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('idExterno', idExterno);

    return this.http.post('http://localhost:8080/api/favoritos/agregar', null, {
      params,
      responseType: 'text',
    });
  }

  deleteFavorite(usuarioId: number, recipe: Recipe): Observable<string> {
    const idExterno = recipe.getIdExterno?.();
    const finalIdExterno =
      idExterno && idExterno.startsWith('spoonacular-')
        ? idExterno
        : `spoonacular-${recipe.getId()}`;

    const params = new HttpParams()
      .set('usuarioId', usuarioId)
      .set('idExterno', finalIdExterno);

    return this.http.delete('http://localhost:8080/api/favoritos/eliminar', {
      params,
      responseType: 'text',
    });
  }

  listFavorites(usuarioId: number): Observable<string[]> {
    const params = new HttpParams().set('usuarioId', usuarioId);
    return this.http.get<string[]>(
      'http://localhost:8080/api/favoritos/listar',
      { params }
    );
  }
}
