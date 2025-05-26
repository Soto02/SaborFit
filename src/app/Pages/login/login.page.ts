import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';
import { IonContent, IonButton } from '@ionic/angular/standalone';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, FormsModule, SharedModule],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private authService: AuthService) {
    addIcons({ mailOutline, lockClosedOutline });
  }

  ngOnInit() {}

  goToLoggedPage() {
    if (this.form.invalid) return;
    const email = this.form.get('email')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';
    this.authService.logIn(email, password);
    this.router.navigate(['/main']);
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
