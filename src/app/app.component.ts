import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {
  constructor() {
    this.showSplash();
  }

  async showSplash() {
    await SplashScreen.show({
      autoHide: true,
      showDuration: 2000
    });
  }
}
