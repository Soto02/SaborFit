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
  loadingRecipe = false;

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
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  /** Se ejecuta cada vez que se entra en la page */
  ionViewWillEnter() {
    this.recetasFiltradas = [];
    this.sinResultados = false;

    const query = this.route.snapshot.queryParamMap.get('ingredientes');
    if (query) {
      this.ingredientes = query.split(',').map((i) => i.trim().toLowerCase());
      this.recipeService
        .searchRecipesByIngredients(this.ingredientes)
        .subscribe((recetas) => {
          this.recetasFiltradas = recetas;
          this.sinResultados = recetas.length === 0;
        });
    }
  }

  /** Metodo para generar una nueva receta con la ia y navega a la page de detalle */
  createRecipe() {
    this.loadingRecipe = true;

    const ingredientes = this.ingredientes.join(', ');

    this.recipeService.generarRecetaConAI(ingredientes).subscribe((res) => {
      if (!res.error) {
        const receta = res.receta;

        localStorage.setItem('nuevaReceta', JSON.stringify(receta));

        this.router.navigate(['/newrecipe'], {
          queryParams: { from: 'resultados' },
        });
      }
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

  goToRecipe(recipe: Recipe) {
    this.router.navigate(['/recipe', recipe.getId()], {
      queryParams: { from: 'resultados' },
    });
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}
