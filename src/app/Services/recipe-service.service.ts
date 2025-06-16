import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from '../Models/Recipe/recipe';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl: string = 'https://api.spoonacular.com/recipes';
  //private apiUrlBuena: string = 'http://localhost:8080/api/recetas';
  private apiKey: string = '4303689fb8e94ba69206e1fcf2488e38';

  private allRecipes: Recipe[] = [];

  constructor(private http: HttpClient) {}

  /** Obtener las recetas, añadiendo un limite para que no llegue al infinito */
  getRecipesLimit(inicio: number, limite: number): Observable<Recipe[]> {
    const url: string = `${this.apiUrl}/complexSearch?offset=${inicio}&number=1&apiKey=${this.apiKey}`;
    // `${this.apiUrl}?offset=${inicio}&number=${limite}&apiKey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const recetas = response.results.map(
          (recipe: any) =>
            new Recipe(recipe.id, recipe.title, [''], '', recipe.image, false, [
              '',
            ])
        );
        recetas.forEach((nueva: any) => {
          if (!this.allRecipes.some((r) => r.getId() === nueva.getId())) {
            this.allRecipes.push(nueva);
          }
        });

        return recetas;
      })
    );
  }

  /** Buscar la receta por el id */
  getRecipeById(id: number): Observable<Recipe> {
    const url: string = `${this.apiUrl}/${id}/information?apiKey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((recipe: any) => {
        const ingredientes =
          recipe.extendedIngredients?.map((i: any) => i.original) || [];

        return new Recipe(
          recipe.id,
          recipe.title,
          ingredientes,
          recipe.summary || 'Sin descripción',
          recipe.image || '',
          false,
          recipe.analyzedInstructions?.[0]?.steps.map((s: any) => s.step) || []
        );
      })
    );
  }

  /** Buscar recetas que contengan los ingredientes del input */
  searchRecipesByIngredients(ingredientes: string[]): Observable<Recipe[]> {
    const ingredientesParam = ingredientes.join('&ingredientes=');
    const url = `${this.apiUrl}/search?ingredientes=${ingredientesParam}`;

    return this.http.get<any[]>(url).pipe(
      map((response) => {
        return response.map((recipe: any) => {
          return new Recipe(
            recipe.id,
            recipe.title,
            recipe.ingredientes || [],
            recipe.summary || '',
            recipe.image || '',
            false,
            recipe.instrucciones || ''
          );
        });
      })
    );
  }

  saveRecipeBD(recipe: Recipe): Observable<number> {
    const body = {
      id: recipe.getId(),
      nombre: recipe.getName(),
      descripcion: recipe.getDescription(),
      instrucciones: recipe.getInstructions(),
      ingredientes: recipe.getIngredients(),
      image: recipe.getThumbnail(),
    };

    return this.http.post<number>(
      'http://localhost:8080/api/recetas/save',
      body
    );
  }

  /** Obtener todas las recetas */
  getAllRecipes(): Recipe[] {
    return this.allRecipes;
  }

  /** Añadir recetas a favoritas */
  toggleFavorite(id: number): void {
    const recipe = this.allRecipes.find((r) => r.getId() === id);
    if (recipe) {
      recipe.setFavorite(!recipe.getFavorite());
    }
  }
}

//private apiUrl: string = '';
//`${this.apiUrl}?apiKey=${this.apiKey}&query=chicken`

// getAll(): Observable<Recipe[]> {
//     const url: string = `${this.apiUrl}?apiKey=${this.apiKey}&query=chicken`;
//     return this.http.get<any>(url).pipe(
//       map((response) =>
//         response.results.map(
//           (recipe: any) =>
//             new Recipe(
//               recipe.id,
//               recipe.title,
//               '',
//               '',
//               '',
//               // [recipe.image],
//               [],
//               recipe.image,
//               false,
//               ''
//             )
//         )
//       )
//     );
//   }

// searchRecipesByIngredients(ingredientes: string[]): Observable<Recipe[]> {
//     const ingredientesParam = ingredientes.join(',');
//     const url = `${this.apiUrl}/complexSearch?includeIngredients=${ingredientesParam}&number=10&apiKey=${this.apiKey}`;

//     return this.http.get<any>(url).pipe(
//       map((response) => {
//         return response.results.map((recipe: any) => {
//           const ingredientes =
//             recipe.extendedIngredients?.map((i: any) => i.original) || [];

//           return new Recipe(
//             recipe.id,
//             recipe.title,
//             ingredientes,
//             recipe.summary || '',
//             recipe.analyzedInstructions?.[0]?.steps
//               .map((s: any) => s.step)
//               .join('. ') || '',
//             recipe.analyzedInstructions?.[0]?.steps.map((s: any) => s.step) ||
//               [],
//             recipe.image || '',
//             false,
//             recipe.instructions || ''
//           );
//         });
//       })
//     );
//   }
