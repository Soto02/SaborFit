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
import { UserService } from 'src/app/Services/user-service.service';
import { FavoriteService } from 'src/app/Services/favorite-service.service';
import { User } from 'src/app/Models/User/user';
@Component({
  selector: 'app-newrecipe',
  templateUrl: './newrecipe.page.html',
  styleUrls: ['./newrecipe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
})
export class NewrecipePage implements OnInit {
  recipe?: Recipe;
  user?: User;
  loading = true;
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

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.from = this.route.snapshot.queryParamMap.get('from') || 'main';

    this.recipeService.getRecipeById(id).subscribe({
      next: (r) => {
        this.recipe = r;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener receta:', err);
        this.loading = false;
      },
    });

    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }
  }

  recipeFavorita(recipe: Recipe) {
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

  back() {
    this.router.navigate(['/' + this.from]);
  }
}
