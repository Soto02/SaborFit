import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Recipe } from 'src/app/Models/Recipe/recipe';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { addIcons } from 'ionicons';
import { arrowBack, star, starOutline, bookOutline } from 'ionicons/icons';
import { UserService } from 'src/app/Services/user-service.service';
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
  imagenError = false;

  constructor(
    private router: Router,
    private userService: UserService,
  ) {
    addIcons({ arrowBack, star, starOutline, bookOutline });
  }

  ngOnInit() {
    const recetaStr = localStorage.getItem('nuevaReceta');
    if (recetaStr) {
      const data = JSON.parse(recetaStr);
      const randomId = Math.floor(Math.random() * 1000000);
      this.recipe = new Recipe(
        randomId,
        `ia-${Date.now()}`,
        data.name,
        data.ingredients,
        data.description,
        data.thumbnail,
        false,
        data.instructions
      );
    }

    const currentUser = this.userService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
    }

    this.loading = false;
  }

  onImagenError() {
    this.imagenError = true;
  }

  back() {
    this.router.navigate(['/main']);
  }
}
