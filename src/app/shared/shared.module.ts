import { NgModule } from '@angular/core';
import { HeaderComponent } from './Components/header/header.component';
import { InputComponent } from './Components/input/input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './Components/card/card.component';

@NgModule({
  declarations: [],
  exports: [
    HeaderComponent,
    InputComponent,
    CardComponent,
    ReactiveFormsModule,
  ],
  imports: [
    HeaderComponent,
    InputComponent,
    CardComponent,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
