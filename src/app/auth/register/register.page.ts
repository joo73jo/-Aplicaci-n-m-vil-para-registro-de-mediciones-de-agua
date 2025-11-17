import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonInput, IonButton
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonInput, IonButton,
    FormsModule
  ]
})
export class RegisterPage {

  nombre = '';
  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) {}

  async registrar() {
    this.errorMsg = '';

    const { error } = await this.supa.client.auth.signUp({
      email: this.email,
      password: this.password
    });

    if (error) {
      this.errorMsg = error.message;
      return;
    }

    alert('Revisa tu correo para confirmar tu cuenta.');
    this.router.navigate(['/']);
  }
}
