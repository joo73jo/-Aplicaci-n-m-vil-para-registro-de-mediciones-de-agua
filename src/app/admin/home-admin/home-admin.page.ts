import { Component, OnInit } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonButton
} from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { SupabaseService } from '../../core/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton,
    CommonModule,
    DatePipe
  ]
})
export class HomeAdminPage implements OnInit {

  lecturas: any[] = [];

  constructor(
    private supa: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.cargarLecturas();
  }

  async cargarLecturas() {
    const { data, error } = await this.supa.client
      .from('lecturas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando lecturas:', error);
      return;
    }

    console.log('LECTURAS ENCONTRADAS:', data);

    this.lecturas = data || [];
  }

  logout() {
    this.supa.client.auth.signOut();
    this.router.navigate(['/']);
  }
}
