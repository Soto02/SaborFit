import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {}

  goToLoggedPage() {
    if (this.form.invalid) return;
    const email = this.form.get('email')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';

    this.userService.login(email, password).subscribe((success) => {
      if (success) {
        this.router.navigate(['/main']);
      } else {
        alert('Correo o contraseña incorrectos, o cuenta no verificada.');
      }
    });
  }
  goToRegister() {
    this.router.navigate(['/register']);
  }
}
