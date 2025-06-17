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
  //Recetas principales y del swiper
  recipes: Recipe[] = [];
  swiperRecipes: Recipe[] = [];

  //Recetas marcadas como favoritas por el usuario
  favoritosIds = new Set<string>();

  //Control de paginación y carga
  todasCargadas = false;
  inicio = 0;
  limit = 5;
  maxRecipes = 20;

  //Usuario actual
  user!: User;

  //Texto del input de búsqueda
  searchQuery: string = '';

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private router: Router,
    private popoverController: PopoverController
  ) {
    // Cargar iconos necesarios
    addIcons({ person, list, searchOutline, logOut, star, starOutline });
  }

  /** Inicializa el componente */
  ngOnInit() {
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }

    this.loadFavoritos(() => {
      this.loadRecipes();
      this.loadRandomSwiperRecipes();
    });
  }

  @ViewChild('page', { static: false }) content!: IonContent;

  /** Hace scroll al principio de la página con animación */
  scrollToTop() {
    this.content.scrollToTop(500); // 500ms de animación
  }

  /** Carga las recetas en bloques paginados */
  private loadRecipes(ev?: InfiniteScrollCustomEvent) {
    if (this.todasCargadas) {
      ev?.target.complete();
      return;
    }

    this.recipeService.getRecipesLimit(this.inicio, this.limit).subscribe({
      next: (newRecipes: Recipe[]) => {
        newRecipes.forEach((receta) => {
          receta.setFavorite(this.favoritosIds.has(receta.getIdExterno()));
        });

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

  /** Carga las recetas favoritas del usuario actual */
  private loadFavoritos(callback: () => void) {
    const user = this.userService.getCurrentUser();
    if (!user) {
      callback();
      return;
    }

    this.favoriteService.listFavorites(user.getId()).subscribe((favoritos) => {
      favoritos.forEach((idExterno) => this.favoritosIds.add(idExterno));
      callback();
    });
  }

  /** Devuelve el ID de receta para mejorar rendimiento con *ngFor */
  trackById(index: number, recipe: Recipe): number {
    return recipe.getId();
  }

  /** Carga recetas aleatorias para el swiper superior */
  private loadRandomSwiperRecipes(): void {
    this.recipeService.getMeatRecipes(5).subscribe({
      next: (recipes: Recipe[]) => {
        recipes.forEach((r) =>
          r.setFavorite(this.favoritosIds.has(r.getIdExterno()))
        );
        this.swiperRecipes = recipes;
      },
      error: (err) => {
        console.error('Error al cargar recetas de carne para swiper:', err);
      },
    });
  }

  /** Manejador para cargar más recetas con scroll infinito */
  onloadRecipes(ev: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      this.loadRecipes(ev);
    }, 500);
  }

  /** Realiza la búsqueda de recetas por ingredientes */
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

  /** Permite o no cerrar el modal por gesto */
  async canDismiss(data?: undefined, role?: string) {
    return role !== 'gesture';
  }

  /** Navega a la page de detalle de la receta */
  goToRecipe(recipe: Recipe) {
    this.router.navigate(['/recipe', recipe.getId()]);
  }

  /** Metodo para marcar o desmarar una receta de favoritos */
  recipeFavorite(recipe: Recipe) {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    const isFav = recipe.getFavorite();
    const idExterno = recipe.getIdExterno();

    if (isFav) {
      this.favoriteService
        .deleteFavorite(user.getId(), recipe)
        .subscribe(() => recipe.setFavorite(false));
    } else {
      this.recipeService.saveRecipeBD(recipe).subscribe(() => {
        this.favoriteService
          .addFavorite(user.getId(), idExterno)
          .subscribe(() => recipe.setFavorite(true));
      });
    }
  }

  /** Cierra el popover y cierra sesión */
  async logOut() {
    await this.popoverController.dismiss();
    this.router.navigate(['/login']);
  }

  /** Cierra el popover y navega al perfil */
  async goFavorites() {
    await this.popoverController.dismiss();
    this.router.navigate(['/perfil']);
  }
}
