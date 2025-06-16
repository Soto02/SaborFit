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

  loadFavorites() {
    const user = this.userService.getCurrentUser();
    if (!user) return;

    this.favoriteService.listFavorites(user.getId()).subscribe((favoritos) => {
      console.log('Favoritos del backend:', favoritos);
      // favoritos es un array de objetos Favorito que contienen la receta asociada
      this.favoriteRecipes = favoritos.map((f) => {
        const receta = new Recipe(
          f.receta.id,
          f.receta.title,
          f.receta.ingredientes,
          f.receta.summary,
          f.receta.image,
          false,
          f.receta.instrucciones
        );
        receta.setFavorite(true);
        return receta;
      });
    });
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
    this.router.navigate(['/recipe', recipe.getId()]);
  }

  goToMain() {
    this.router.navigate(['/main']);
  }
}
