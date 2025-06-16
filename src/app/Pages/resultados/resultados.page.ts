import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBack, star, starOutline } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/Services/recipe-service.service';
import { SharedModule } from '../../shared/shared.module';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { User } from 'src/app/Models/User/user';
import { FavoriteService } from 'src/app/Services/favorite-service.service';
import { UserService } from 'src/app/Services/user-service.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
})
export class ResultadosPage implements OnInit {
  user?: User;
  ingredientes: string[] = [];
  recetasFiltradas: any[] = [];
  sinResultados = false;
  sinGluten = false;
  sinLactosa = false;
  loadingRecipe = false;
  timerRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private userService: UserService,
    private favoriteService: FavoriteService
  ) {
    addIcons({ arrowBack, star, starOutline });
  }

  ngOnInit() {
    const query = this.route.snapshot.queryParamMap.get('ingredientes');
    if (query) {
      const ingredientes = query.split(',').map((i) => i.trim().toLowerCase());
      this.recipeService
        .searchRecipesByIngredients(ingredientes)
        .subscribe((recetas) => {
          this.recetasFiltradas = recetas;
          this.sinResultados = recetas.length === 0;
        });
    }

    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  createRecipe() {
    this.loadingRecipe = true;

    this.timerRef = setTimeout(() => {
      this.loadingRecipe = false;

      // Simula navegación a una receta creada. Cambia por lógica real si quieres.
      this.router.navigate(['/newrecipe', 9999], {
        queryParams: { from: 'resultados' },
      });
    }, 10000);
  }
  recipeFavorite(recipe: Recipe) {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    const isFav = recipe.getFavorite();

    if (isFav) {
      this.favoriteService
        .deleteFavorite(user.getId(), recipe.getId())
        .subscribe(() => recipe.setFavorite(false));
    } else {
      this.recipeService.saveRecipeBD(recipe).subscribe((id) => {
        this.favoriteService
          .addFavorite(user.getId(), id)
          .subscribe(() => recipe.setFavorite(true));
      });
    }
  }

  goToRecipe(recipe: Recipe) {
    this.router.navigate(['/recipe', recipe.getId()], {
      queryParams: { from: 'resultados' },
    });
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}

// filtrarRecetas() {
//   const todasLasRecetas = this.recipeService.getAllRecipes(); // simulado desde localStorage u otro array
//   this.recetasFiltradas = todasLasRecetas.filter((receta) =>
//     this.ingredientes.every((ing) =>
//       receta
//         .getIngredients()
//         .some((ri: string) => ri.toLowerCase().includes(ing))
//     )
//   );
//   this.sinResultados = this.recetasFiltradas.length === 0;
// }
