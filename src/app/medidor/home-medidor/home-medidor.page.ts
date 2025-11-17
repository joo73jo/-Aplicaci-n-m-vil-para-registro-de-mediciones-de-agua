import { Component, OnInit } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { SupabaseService } from '../../core/supabase.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-home-medidor',
  templateUrl: './home-medidor.page.html',
  styleUrls: ['./home-medidor.page.scss'],
  imports: [
    CommonModule,
    DatePipe,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton
  ]
})
export class HomeMedidorPage implements OnInit {

  lecturas: any[] = [];

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarLecturas();
  }

  async cargarLecturas() {
    const { data: authData } = await this.supa.client.auth.getUser();
    const user = authData?.user;

    if (!user) return;

    const { data } = await this.supa.client
      .from('lecturas')
      .select('*')
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false });

    this.lecturas = data || [];
  }

  nuevaLectura() {
    this.router.navigate(['/nueva-lectura']);
  }

  async logout() {
    await this.supa.client.auth.signOut();
    this.router.navigate(['/']);
  }
}
