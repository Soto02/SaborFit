import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLogged: boolean = false;

  logIn(email: string, password: string): void {
    if (email !== '' && password !== '') {
      this.isLogged = true;
    }
  }
  isLoggedInUser(): boolean {
    return this.isLogged;
  }
}
