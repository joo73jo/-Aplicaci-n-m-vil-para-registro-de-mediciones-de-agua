import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { CommonModule, DatePipe } from '@angular/common';
import { SupabaseService } from '../../core/supabase.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonList, IonItem, IonLabel,
    CommonModule, DatePipe
  ]
})
export class HomeAdminPage implements OnInit {

  lecturas: any[] = [];

  constructor(private supa: SupabaseService) {}

  async ngOnInit() {
    await this.cargarLecturas();
  }

  async cargarLecturas() {
    const { data, error } = await this.supa.client
      .from('lecturas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando lecturas:', error.message);
      return;
    }

    this.lecturas = data || [];
  }

  logout() {
    this.supa.client.auth.signOut();
    window.location.href = '/login';
  }
}
