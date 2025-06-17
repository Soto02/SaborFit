import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/Services/recipe-service.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { arrowBack, star, starOutline } from 'ionicons/icons';
import { User } from 'src/app/Models/User/user';
import { FavoriteService } from 'src/app/Services/favorite-service.service';
import { UserService } from 'src/app/Services/user-service.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
})
export class RecipePage implements OnInit {
  //Receta actual
  recipe?: Recipe;

  //Recetas que ya se han intentado guardar en BD
  recetasGuardadas = new Set<number>();

  //Usuario actual
  user?: User;

  //Cargando receta
  loading = true;

  //Origen desde el que se ha navegado (por defecto 'main')
  from: string = 'main';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private userService: UserService,
    private favoriteService: FavoriteService
  ) {
    addIcons({ arrowBack, star, starOutline });
  }

  /** Se ejecuta al inicializar el componente */
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const externo = this.route.snapshot.queryParamMap.get('externo') === 'true';
    const idSpoonacular = externo
      ? Number(id.replace('spoonacular-', ''))
      : Number(id);

    this.recipeService.getRecipeById(idSpoonacular).subscribe({
      next: (receta) => {
        this.recipe = receta;

        const currentUser = this.userService.getCurrentUser();
        if (currentUser) {
          this.user = currentUser;
          this.loadEsFavorita();
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener la receta:', err);
        this.loading = false;
      },
    });

    // Obtener usuario actual
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  /** Comprueba si la receta actual está marcada como favorita */
  private loadEsFavorita() {
    if (!this.recipe || !this.user) return;

    this.favoriteService
      .listFavorites(this.user.getId())
      .subscribe((favoritos) => {
        const esFavorita = favoritos.some(
          (idExterno) => idExterno === this.recipe!.getIdExterno()
        );
        this.recipe!.setFavorite(esFavorita);
      });
  }

  /** Guarda la receta solo si no ha sido guardada antes */
  guardarSiNoExiste(recipe: Recipe) {
    if (this.recetasGuardadas.has(recipe.getId())) return;

    this.recetasGuardadas.add(recipe.getId());

    this.recipeService.saveRecipeBD(recipe).subscribe({
      next: () => console.log(`Receta guardada: ${recipe.getName()}`),
      error: (err) =>
        console.warn(
          `No se pudo guardar la receta ${recipe.getName()}:`,
          err.error
        ),
    });
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

  /** Vuelve a la página anterior desde la que se llegó */
  back() {
    this.router.navigate(['/' + this.from]);
  }
}
