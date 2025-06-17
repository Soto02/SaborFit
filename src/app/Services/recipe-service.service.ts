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

  private allRecipes: Recipe[] = [];

  constructor(private http: HttpClient) {}


  /** Obtener las recetas, añadiendo un limite para que no llegue al infinito */
  getRecipesLimit(inicio: number, limite: number): Observable<Recipe[]> {
    const url: string = `${this.apiUrl}/complexSearch?offset=${inicio}&number=${inicio}&apiKey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        const recetas = response.results.map(
          (recipe: any) =>
            new Recipe(
              recipe.id,
              `spoonacular-${recipe.id}`,
              recipe.title,
              [''],
              '',
              recipe.image,
              false,
              ['']
            )
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

  /** Obtener recetas que contengan cualquier tipo de carne */
  getMeatRecipes(limit: number): Observable<Recipe[]> {
    const url: string = `${this.apiUrl}/complexSearch?number=10&includeIngredients=pork&apiKey=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        const recetas = response.results
          .filter((recipe: any) => recipe.title.toLowerCase().includes('pork'))
          .slice(0, limit)
          .map(
            (recipe: any) =>
              new Recipe(
                recipe.id,
                `spoonacular-${recipe.id}`,
                recipe.title,
                [''],
                '',
                recipe.image,
                false,
                ['']
              )
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
          `spoonacular-${recipe.id}`,
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
    const ingredientesParam = ingredientes.join(',');
    const url = `${this.apiUrl}/findByIngredients?ingredients=${ingredientesParam}&number=15&apiKey=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        return response.map((recipe: any) => {
          return new Recipe(
            recipe.id,
            `spoonacular-${recipe.id}`,
            recipe.title,
            recipe.ingredients || [],
            recipe.summary || '',
            recipe.image || '',
            false,
            recipe.instructions || []
          );
        });
      })
    );
  }

  /** Guarda una receta en tu base de datos evitando duplicados */
  saveRecipeBD(recipe: Recipe): Observable<number> {
    const body = {
      idExterno: recipe.getIdExterno(),
      nombre: recipe.getName(),
      descripcion: recipe.getDescription(),
      instrucciones: recipe
        .getInstructions()
        .map((i) => i.trim())
        .filter((i) => i !== ''),
      ingredientes: recipe
        .getIngredients()
        .map((i) => i.trim())
        .filter((i) => i !== ''),
      image: recipe.getThumbnail(),
    };

    console.log('POST Body:', JSON.stringify(body));
    return this.http.post<number>(
      'http://localhost:8080/api/recetas/save',
      body
    );
  }

  /** Generar la receta con ia */
  generarRecetaConAI(ingredientes: string): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/ai/generar', {
      params: { ingredientes },
    });
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
