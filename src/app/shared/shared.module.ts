import { NgModule } from '@angular/core';
import { HeaderComponent } from './Components/header/header.component';
import { InputComponent } from './Components/input/input.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  exports: [
    HeaderComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  imports: [
    HeaderComponent,
    InputComponent,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
