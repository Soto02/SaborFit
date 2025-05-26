import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../Models/Recipe/recipe';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl: string = 'https://api.spoonacular.com/recipes';
  private apiKey: string = '4303689fb8e94ba69206e1fcf2488e38';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Recipe[]> {
    const url: string = `${this.apiUrl}?apiKey=${this.apiKey}&query=chicken`;
    return this.http.get<any>(url).pipe(
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
              false,
              ''
            )
        )
      )
    );
  }

  getRecipesLimit(inicio: number, limite: number): Observable<Recipe[]> {
    const url: string = `${this.apiUrl}/complexSearch?offset=${inicio}&number=1&apiKey=${this.apiKey}`;
    // `${this.apiUrl}?offset=${inicio}&number=${limite}&apiKey=${this.apiKey}`;
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
                [],
                recipe.image,
                false,
                ''
              )
          )
        )
      );
  }

  getRecipeById(id: number): Observable<Recipe> {
    const url: string = `${this.apiUrl}/${id}/information?apiKey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((recipe: any) => {
        return new Recipe(
          recipe.id,
          recipe.title,
          recipe.extendedIngredients?.map((i: any) => i.original).join(', ') ||
            '',
          recipe.summary || 'Sin descripción',
          recipe.analyzedInstructions?.[0]?.steps
            .map((s: any) => s.step)
            .join('. ') || '',
          recipe.analyzedInstructions?.[0]?.steps.map((s: any) => s.step) || [],
          recipe.image || '',
          false,
          recipe.instructions || ''
        );
      })
    );
  }
}

//private apiUrl: string = '';
//`${this.apiUrl}?apiKey=${this.apiKey}&query=chicken`
