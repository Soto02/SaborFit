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
import { addIcons } from 'ionicons';
import { personCircleOutline, arrowBack } from 'ionicons/icons';
import { Router } from '@angular/router';
import { UserService } from 'src/app/Services/user-service.service';
import { User } from 'src/app/Models/User/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, SharedModule],
})
export class RegisterPage implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, private userService: UserService) {
    addIcons({ personCircleOutline, arrowBack });
  }

  ngOnInit() {}

  register() {
    if (this.form.invalid) return;
    const name = this.form.get('name')?.value ?? '';
    const email = this.form.get('email')?.value ?? '';
    const password = this.form.get('password')?.value ?? '';
    const user = new User(name, email, password);

    this.userService.register(user).subscribe((response) => {
      if (response  === true) {
        //localStorage.setItem('email', email);
        this.router.navigate(['/main']);
      } else {
        alert('Ya existe una cuenta con este correo o hubo un error.');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
