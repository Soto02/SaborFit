import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonRouterLink,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { list, person, searchOutline } from 'ionicons/icons';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { RecipeService } from 'src/app/Services/recipe-service.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonRouterLink,
    RouterLink,
    CommonModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPage implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  searchQuery: string = '';

  constructor(private recipeService: RecipeService) {
    addIcons({ person });
    addIcons({ list });
    addIcons({ searchOutline });
  }

  ngOnInit() {
    this.loadRecipes();
  }

  private loadRecipes() {
    this.recipeService.getAll().subscribe({
      next: (recipe: Recipe[]) => {
        this.recipes = recipe;
      },
      error: (err) => {
        console.error('Error al cargar recetas:', err);
      },
    });
  }

  /** Lo utilizo porque estoy usando listas grandes y porque estoy actualizando la lista con frecuencia*/
  trackById(index: number, recipe: Recipe): number {
    return recipe.getId();
  }

  onIonInfinite(ev: InfiniteScrollCustomEvent) {
    //this.loadRecipes();
    // this.recipeService.getAll().subscribe({
    //   next: (recipe: Recipe[]) => {
    //     this.recipes.push(...recipe);
    //     ev.target.complete();
    //   },
    //   error: (err) => {
    //     console.error('Error al cargar más recetas:', err);
    //     ev.target.complete();
    //   },
    // });

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }

  onSearch() {
    const terms = this.searchQuery.split(',').map(i => i.trim().toLowerCase());
  this.filteredRecipes = this.recipes.filter(recipe =>
    terms.some(term => recipe.getName().toLowerCase().includes(term))
  );
  }

}
