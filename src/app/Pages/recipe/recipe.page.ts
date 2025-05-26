import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from 'src/app/Services/recipe-service.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
})
export class RecipePage implements OnInit {
  recipe?: Recipe;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
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
  }
}
