import {
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, PopoverController, IonContent } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  list,
  person,
  searchOutline,
  logOut,
  star,
  starOutline,
} from 'ionicons/icons';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { RecipeService } from 'src/app/Services/recipe-service.service';
import { register } from 'swiper/element/bundle';
import { SharedModule } from 'src/app/shared/shared.module';
import { User } from 'src/app/Models/User/user';
import { UserService } from 'src/app/Services/user-service.service';
import { FavoriteService } from 'src/app/Services/favorite-service.service';

register();

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MainPage implements OnInit {
  recipes: Recipe[] = [];
  swiperRecipes: Recipe[] = [];
  user!: User;
  todasCargadas = false;
  inicio = 0;
  limit = 5;
  maxRecipes = 20;
  searchQuery: string = '';

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private router: Router,
    private popoverController: PopoverController
  ) {
    addIcons({ person, list, searchOutline, logOut, star, starOutline });
  }

  ngOnInit() {
    this.loadRecipes();
    this.loadRandomSwiperRecipes();
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  @ViewChild('page', { static: false }) content!: IonContent;

  /** Sirve para que me lleve a lo mas alto de la pagina con una animacion de 0.5 segundos */
  scrollToTop() {
    this.content.scrollToTop(500); // 500ms de animación
  }

  /** Cargar recetas */
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

  private loadRandomSwiperRecipes(): void {
    this.recipeService.getRecipesLimit(0, 5).subscribe({
      next: (recipes: Recipe[]) => {
        const random = this.getRandomSubset(recipes, 5);
        this.swiperRecipes = random;
      },
      error: (err) => {
        console.error('Error al cargar recetas para swiper:', err);
      },
    });
  }

  /** Utilidad para seleccionar recetas aleatorias */
  private getRandomSubset(array: Recipe[], count: number): Recipe[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  onloadRecipes(ev: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.loadRecipes(ev);
    }, 500);
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;

    const ingredientes = this.searchQuery
      .split(',')
      .map((i) => i.trim().toLowerCase())
      .filter((i) => i.length > 0);

    if (ingredientes.length === 0) return;

    this.router.navigate(['/resultados'], {
      queryParams: {
        ingredientes: ingredientes.join(','),
      },
    });
  }
  async canDismiss(data?: undefined, role?: string) {
    return role !== 'gesture';
  }

  /** Metodo que te dirigue a la pagina de la receta */
  goToRecipe(recipe: Recipe) {
    this.router.navigate(['/recipe', recipe.getId()], {
      queryParams: { from: 'main' },
    });
  }
  /** Añade o elimina una receta de favoritos */
  recipeFavorite(recipe: Recipe) {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    const isFav = recipe.getFavorite();

    if (isFav) {
      this.favoriteService
        .deleteFavorite(user.getId(), recipe.getId())
        .subscribe(() => {
          recipe.setFavorite(false);
        });
    } else {
      this.favoriteService
        .addFavorite(user.getId(), recipe.getId())
        .subscribe(() => {
          recipe.setFavorite(true);
        });
    }
  }

  async logOut() {
    await this.popoverController.dismiss();
    this.router.navigate(['/login']);
  }
  async goFavorites() {
    await this.popoverController.dismiss();
    this.router.navigate(['/perfil']);
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
