import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRouterLink } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, person, searchOutline, logOut } from 'ionicons/icons';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { RecipeService } from 'src/app/Services/recipe-service.service';
import { register } from 'swiper/element/bundle';
import { SharedModule } from 'src/app/shared/shared.module';

register();

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    IonRouterLink,
    RouterLink,
    CommonModule,
    FormsModule,
    SharedModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPage implements OnInit {
  recipes: Recipe[] = [];
  private filteredRecipes: Recipe[] = [];
  todasCargadas = false;
  inicio = 0;
  limit = 15;
  maxRecipes = 60;
  searchQuery: string = '';

  constructor(private recipeService: RecipeService) {
    addIcons({ person, list, searchOutline, logOut });
  }

  ngOnInit() {
    this.loadRecipes();
  }

  private loadRecipes(ev?: InfiniteScrollCustomEvent) {
    if (this.todasCargadas) {
      ev?.target.complete();
      return;
    }

    this.recipeService.getRecipesLimit(this.inicio, this.limit).subscribe({
      next: (newRecipes: Recipe[]) => {
        this.recipes = [...this.recipes, ...newRecipes];
        this.inicio += this.limit;

        if (
          this.recipes.length >= this.maxRecipes ||
          newRecipes.length < this.limit
        ) {
          this.todasCargadas = true;
        }

        ev?.target.complete();
      },
      error: (err) => {
        console.error('Error al cargar recetas:', err);
        ev?.target.complete();
      },
    });
  }

  /** Lo utilizo porque estoy usando listas grandes y porque estoy actualizando la lista con frecuencia*/
  trackById(index: number, recipe: Recipe): number {
    return recipe.getId();
  }

  onloadRecipes(ev: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.loadRecipes(ev);
    }, 500);
  }

  onSearch() {
    const terms = this.searchQuery
      .split(',')
      .map((i) => i.trim().toLowerCase());
    this.filteredRecipes = this.recipes.filter((recipe) =>
      terms.some((term) => recipe.getName().toLowerCase().includes(term))
    );
  }
  async canDismiss(data?: undefined, role?: string) {
    return role !== 'gesture';
  }
}

// this.recipeService.getAll().subscribe({
//   next: (recipe: Recipe[]) => {
//     this.recipes = recipe;
//   },
//   error: (err) => {
//     console.error('Error al cargar recetas:', err);
//   },
// });
