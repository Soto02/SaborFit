import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { arrowBack, heart } from 'ionicons/icons';
import { Router } from '@angular/router';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { RecipeService } from 'src/app/Services/recipe-service.service';
import { UserService } from 'src/app/Services/user-service.service';
import { User } from 'src/app/Models/User/user';
import { FavoriteService } from 'src/app/Services/favorite-service.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
})
export class PerfilPage implements OnInit {
  favoriteRecipes: Recipe[] = [];
  user!: User;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private userService: UserService,
    private favoriteService: FavoriteService
  ) {
    addIcons({ arrowBack, heart });
  }

  ngOnInit() {
    this.loadFavorites();
    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  /** Metodo para cargar la lista de recetas favoritos y ademas limpia el array de recetas favoritas */
  loadFavorites() {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    this.favoriteService
      .listFavorites(user.getId())
      .subscribe((idsExternos: string[]) => {
        console.log('IDs externos favoritos:', idsExternos);

        this.favoriteRecipes = [];

        idsExternos.forEach((idExt) => {
          const spoonacularId = Number(idExt.replace('spoonacular-', ''));
          this.recipeService
            .getRecipeById(spoonacularId)
            .subscribe((receta) => {
              receta.setFavorite(true);
              this.favoriteRecipes.push(receta);
            });
        });
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
        .subscribe(() => {
          recipe.setFavorite(false);

          this.favoriteRecipes = this.favoriteRecipes.filter(
            (r) => r.getId() !== recipe.getId()
          );
        });
    } else {
      this.recipeService.saveRecipeBD(recipe).subscribe(() => {
        this.favoriteService
          .addFavorite(user.getId(), idExterno)
          .subscribe(() => {
            recipe.setFavorite(true);
          });
      });
    }
  }

  goToRecipe(recipe: Recipe) {
    this.router.navigate(['/recipe', recipe.getIdExterno()], {
      queryParams: { externo: true },
    });
  }

  back() {
    this.router.navigate(['/main']);
  }
}
