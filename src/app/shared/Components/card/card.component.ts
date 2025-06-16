import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class CardComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Output() toggleFavorite = new EventEmitter<Recipe>();
  @Output() recipeClick = new EventEmitter<Recipe>();

  ngOnInit() {}

  onCardClick() {
    this.recipeClick.emit(this.recipe);
  }

  onToggleFavorite(event: Event) {
    event.stopPropagation();
    this.toggleFavorite.emit(this.recipe);
    const icon = event.target as HTMLElement;
    icon.classList.add('animate');

    setTimeout(() => icon.classList.remove('animate'), 300);
  }
}
