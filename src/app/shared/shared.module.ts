import { NgModule } from '@angular/core';
import { InputComponent } from './Components/input/input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './Components/card/card.component';

@NgModule({
  declarations: [],
  exports: [
    InputComponent,
    CardComponent,
    ReactiveFormsModule,
  ],
  imports: [
    InputComponent,
    CardComponent,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
