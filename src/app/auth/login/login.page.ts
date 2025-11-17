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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonInput, IonButton,
    FormsModule
  ]
})
export class LoginPage {

  email = '';
  password = '';
  errorMsg = '';

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) {}

  async login() {
    this.errorMsg = '';

    const { data, error } = await this.supa.client.auth.signInWithPassword({
      email: this.email,
      password: this.password
    });

    if (error) {
      this.errorMsg = 'Credenciales incorrectas';
      return;
    }

    const user = data.user;

    // revisar si ya tiene perfil en "usuarios"
    const { data: perfil } = await this.supa.client
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // si no existe → crear su perfil como medidor
    if (!perfil) {
      await this.supa.client
        .from('usuarios')
        .insert({
          id: user.id,
          email: user.email,
          nombre: user.email,
          rol: 'MEDIDOR'
        });
    }

    const rol = perfil?.rol ?? 'MEDIDOR';

    if (rol === 'ADMIN') {
      this.router.navigate(['/home-admin']);
    } else {
      this.router.navigate(['/home-medidor']);
    }
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

}
