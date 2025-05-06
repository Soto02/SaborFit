import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../Models/Recipe/recipe';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl: string = 'https://api.spoonacular.com/recipes/complexSearch';
  private apiKey: string = '4303689fb8e94ba69206e1fcf2488e38';
  //`${this.apiUrl}?apiKey=${this.apiKey}&query=chicken`

  //recipes?: any[];
  constructor(private http: HttpClient) {}

  getAll(): Observable<Recipe[]> {
    const url: string = `${this.apiUrl}?apiKey=${this.apiKey}&query=chicken`;
    return this.http
      .get<any>(url)
      .pipe(
        map((response) =>
          response.results.map(
            (recipe: any) =>
              new Recipe(
                recipe.id,
                recipe.title,
                '',
                '',
                '',
                // [recipe.image],
                [],
                recipe.image,
                false
              )
          )
        )
      );
  }
}
