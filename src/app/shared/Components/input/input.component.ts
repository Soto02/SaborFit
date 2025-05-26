import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonItem, IonInput, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'Input-ion',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonInput, IonItem, ReactiveFormsModule, NgIf],
})
export class InputComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;

  isPassword!: boolean;
  hide: boolean = true;

  constructor() {}

  ngOnInit() {
    if(this.type == 'password') this.isPassword = true;
    addIcons({ eyeOutline, eyeOffOutline });
  }

  showHide() {
    this.hide = !this.hide;

    if(this.hide) this.type = 'password';
    else this.type = 'text';
  }
}
